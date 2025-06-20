import { useState } from 'react';
import {
    Box, Typography, FormControl, Select, MenuItem, InputLabel,
    TextField, Button, Divider, Grid, Paper, Card, CardContent, List, ListItem, ListItemText
} from '@mui/material';

const Payments = () => {
    const [concepto, setConcepto] = useState('');
    const [metodo, setMetodo] = useState('');
    const [folio, setFolio] = useState('');

    const conceptosPago = [
        'Colegiatura',
        'Constancia de estudios',
        'Título profesional',
        'Reposición de credencial'
    ];

    const handleGenerarPago = () => {
        // lógica de generación o confirmación
        console.log({ concepto, metodo, folio });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
                {/* Panel izquierdo - formulario */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                            Selecciona tu forma de pago
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            1. <strong>Pago en línea</strong> con tarjeta de crédito/débito (Visa o Mastercard).<br />
                            2. <strong>Formato bancario</strong> para pago en ventanilla bancaria o tiendas autorizadas.
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel sx={{color:"text.primary" }}>Concepto de pago</InputLabel>
                            <Select
                                value={concepto}
                                label="Concepto de pago"
                                onChange={(e) => setConcepto(e.target.value)}
                            >
                                {conceptosPago.map((item, idx) => (
                                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel sx={{color:"text.primary" }}>Método de pago</InputLabel>
                            <Select
                                value={metodo}
                                label="Método de pago"
                                onChange={(e) => setMetodo(e.target.value)}
                            >
                                <MenuItem value="spei">Transferencia SPEI</MenuItem>
                                <MenuItem value="formato">Formato bancario</MenuItem>
                            </Select>
                        </FormControl>

                        {metodo === 'spei' && (
                            <TextField
                                fullWidth
                                label="Folio de transferencia"
                                variant="outlined"
                                sx={{ mb: 2, input: { color: 'text.primary' }, label: { color: 'text.primary' },  }}
                                value={folio}
                                onChange={(e) => setFolio(e.target.value)}
                            />
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleGenerarPago}
                        >
                            {metodo === 'spei' ? 'Confirmar Pago' : 'Generar Formato'}
                        </Button>
                    </Paper>
                </Grid>

                {/* Panel derecho - resumen o datos personales */}
                <Grid item xs={12} md={5}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Datos del estudiante
                            </Typography>
                            <List dense>
                                <ListItem disablePadding>
                                    <ListItemText primary="Matrícula:" secondary="20221026" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Nombre:" secondary="HANIEL ANTONIO" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Apellidos:" secondary="TUXPEÑO GONZÁLEZ" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Cuatrimestre:" secondary="9°" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Carrera:" secondary="Ingeniería en Desarrollo y Gestión de Software" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3, p: 2, backgroundColor: '#f4f4f4' }} elevation={1}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color:"text.primary" }}>
                            Total: <span style={{ float: 'right' }}>$850 MXN</span>
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Payments;
