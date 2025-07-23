import { useState } from 'react';
import {
    Box, Typography, Button, Paper, Grid, Card, CardContent, List, ListItem, ListItemText,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios';
import { obtenerMatricula } from '../Access/SessionService';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#ffffff',
            fontSize: '16px',
            fontFamily: 'Roboto, Open Sans, sans-serif',
            '::placeholder': {
                color: '#cccccc',
            },
        },
        invalid: {
            color: '#ff5252',
            iconColor: '#ff5252',
        },
    }
};

const conceptosPago = [
    { nombre: "Colegiatura", precio: 1700 },
    { nombre: "Constancia de estudios", precio: 120 },
    { nombre: "Título profesional", precio: 2650 },
    { nombre: "Reposición de credencial", precio: 80 },
];

const CardCheckout = ({ precio }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error('[Stripe Error]', error.message);
            alert('❌ Error al crear el método de pago.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/crear-pago', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: precio,
                    payment_method: paymentMethod.id
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('✅ ¡Pago realizado con éxito!');
            } else {
                toast.error(`❌ Error en el pago: ${result.error}`);
            }
        } catch (err) {
            toast.error('❌ Error al conectar con el servidor');
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <Paper elevation={3} sx={{ backgroundColor: '#8A1538', p: 4, mt: 2 }}>
            <Typography variant="h6" color="white" gutterBottom>
                Pago con Tarjeta
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{
                    backgroundColor: '#4a0c24',
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                    border: '1px solid #ffffff'
                }}>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!stripe || loading}
                    sx={{
                        backgroundColor: '#ffffff',
                        color: '#8A1538',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#f4f4f4'
                        }
                    }}
                >
                    {loading ? 'Procesando...' : 'Confirmar Pago'}
                </Button>
            </form>
        </Paper>
    );
};

const Payments = () => {
    const [concepto, setConcepto] = useState('');
    const [tipoPago, setTipoPago] = useState('');
    const [studentData, setStudentData] = useState(null);
    const matricula = obtenerMatricula();

    const conceptoSeleccionado = conceptosPago.find(c => c.nombre === concepto);
    const precio = conceptoSeleccionado?.precio || 0;

    const generarFolio = () => `FOLIO-${Math.floor(100000 + Math.random() * 900000)}`;
    const generarReferencia = () => `REF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const handleDownloadFormato = (datosEstudiante, concepto, precio) => {
        const doc = new jsPDF();
        const folio = generarFolio();
        const referencia = generarReferencia();

        // Encabezado institucional
        doc.setTextColor(138, 21, 56);
        doc.setFontSize(16);
        doc.text("Plataforma PRIME - UTHH", 105, 15, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Formato de Pago", 105, 25, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(20, 30, 190, 30);

        // Sección: Datos del estudiante
        const datos = [
            ["Matrícula", datosEstudiante?.Matricula || "---"],
            ["Nombre", `${datosEstudiante?.Nombre || ""} ${datosEstudiante?.APaterno || ""} ${datosEstudiante?.AMaterno || ""}`],
            ["Carrera", datosEstudiante?.NombreCarrera || "---"],
            ["Cuatrimestre", `${datosEstudiante?.Cuatrimestre || "---"}°`],
            ["Correo", datosEstudiante?.Email || "---"]
        ];

        doc.autoTable({
            startY: 35,
            head: [["Campo", "Valor"]],
            body: datos,
            theme: 'striped',
            styles: { halign: 'left' },
            headStyles: { fillColor: [138, 21, 56] }
        });

        // Sección: Detalles del pago
        const detallesPago = [
            ["Concepto", concepto],
            ["Monto a pagar", `$${precio} MXN`],
            ["Folio de transferencia", folio],
            ["Número de referencia", referencia],
        ];

        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Detalle", "Valor"]],
            body: detallesPago,
            styles: { halign: 'left' },
            headStyles: { fillColor: [138, 21, 56] }
        });

        // Nota
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Realice su pago en los medios oficiales. Guarde este formato como comprobante preliminar.", 20, doc.lastAutoTable.finalY + 20);

        // Guardar
        doc.save(`formato_pago_${datosEstudiante?.Matricula || "alumno"}.pdf`);
    };

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/Fulldata/?matricula=${matricula}`);
                if (response.data?.data?.length > 0) {
                    setStudentData(response.data.data[0]);
                } else {
                    console.warn("No se encontró información para la matrícula.");
                }
            } catch (error) {
                console.error("Error al obtener datos del estudiante:", error);
            }
        };

        fetchStudentData();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
                {/* Panel izquierdo */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                            Selecciona tu concepto y forma de pago
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel sx={{ color: 'text.primary' }}>Concepto de pago</InputLabel>
                            <Select
                                value={concepto}
                                label="Concepto de pago"
                                onChange={(e) => {
                                    setConcepto(e.target.value);
                                    setTipoPago('');
                                }}
                                sx={{
                                    color: 'text.primary',
                                    '& .MuiSelect-icon': { color: 'text.primary' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.dark' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.dark' }
                                }}
                            >
                                {conceptosPago.map((item, idx) => (
                                    <MenuItem key={idx} value={item.nombre} sx={{ color: 'text.primary' }}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {concepto && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: 'text.primary' }}>Método de pago</InputLabel>
                                <Select
                                    value={tipoPago}
                                    label="Método de pago"
                                    onChange={(e) => setTipoPago(e.target.value)}
                                    sx={{
                                        color: 'text.primary',
                                        '& .MuiSelect-icon': { color: 'text.primary' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.dark' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.dark' }
                                    }}
                                >
                                    <MenuItem value="formato" sx={{ color: 'text.primary' }}>
                                        Transferencia (Formato)
                                    </MenuItem>
                                    <MenuItem value="tarjeta" sx={{ color: 'text.primary' }}>
                                        Pago en línea (tarjeta)
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {tipoPago === 'formato' && (
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleDownloadFormato(studentData, concepto, precio)}
                                >
                                    Descargar formato de pago
                                </Button>
                            </Box>
                        )}

                        {tipoPago === 'tarjeta' && (
                            <Box sx={{ mt: 2 }}>
                                <Elements stripe={stripePromise}>
                                    <CardCheckout precio={precio} />
                                </Elements>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Panel derecho */}
                <Grid item xs={12} md={5}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Datos del estudiante
                            </Typography>
                            <List dense>
                                <ListItem disablePadding>
                                    <ListItemText primary="Matrícula:" secondary={studentData?.Matricula || '---'} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Nombre:" secondary={studentData?.Nombre || '---'} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary="Apellidos:"
                                        secondary={`${studentData?.APaterno || ''} ${studentData?.AMaterno || ''}`.trim() || '---'}
                                    />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Cuatrimestre:" secondary={`${studentData?.Cuatrimestre || '---'}°`} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Carrera:" secondary={studentData?.NombreCarrera || '---'} />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3, p: 2, backgroundColor: '#f4f4f4' }} elevation={1}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Total: <span style={{ float: 'right' }}>${precio} MXN</span>
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box >
    );
};

export default Payments;

CardCheckout.propTypes = {
    precio: PropTypes.number.isRequired
};
