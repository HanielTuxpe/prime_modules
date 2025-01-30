import React, { useEffect, useState } from 'react';
import {
    Box,
    CssBaseline,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const FAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [expanded, setExpanded] = useState(null); // Controlar qué FAQ está expandido
    const theme = useTheme();

    // Datos predeterminados de ejemplo en caso de que la API no responda
    const defaultFaqs = [
        {
            _id: '1',
            pregunta: '¿Qué es este sitio?',
            respuesta: 'Este es un sitio web de ejemplo para mostrar cómo funcionan las FAQs. Puedes aprender más sobre nuestra misión y objetivos aquí.',
        },
        {
            _id: '2',
            pregunta: '¿Cómo puedo registrarme?',
            respuesta: 'Puedes registrarte haciendo clic en el botón de registro en la página de inicio. Solo necesitas un correo electrónico y una contraseña.',
        },
        {
            _id: '3',
            pregunta: '¿Cómo puedo recuperar mi contraseña?',
            respuesta: 'Si olvidaste tu contraseña, haz clic en el enlace "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Recibirás un correo con instrucciones para restablecerla.',
        },
        {
            _id: '4',
            pregunta: '¿Hay soporte disponible?',
            respuesta: 'Sí, nuestro equipo de soporte está disponible 24/7. Puedes contactarnos a través de nuestro formulario de contacto o directamente por correo electrónico.',
        },
        {
            _id: '5',
            pregunta: '¿Cuáles son los métodos de pago?',
            respuesta: 'Aceptamos pagos con tarjetas de crédito, PayPal y transferencias bancarias. Toda la información de pago está segura y cifrada.',
        },
    ];

    // Obtener FAQs desde la API
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch('https://prj-server.onrender.com/faqs');
                if (response.ok) {
                    const data = await response.json();
                    setFaqs(data);
                } else {
                    // Si la API no responde correctamente, usar datos predeterminados
                    console.error('Error al obtener los datos de la API');
                    setFaqs(defaultFaqs);
                }
            } catch (error) {
                // En caso de error (por ejemplo, no hay conexión), usar datos predeterminados
                console.error('Error al obtener las FAQs:', error);
                setFaqs(defaultFaqs);
            }
        };

        fetchFaqs();
    }, []);

    const handleToggle = (index) => {
        setExpanded(expanded === index ? null : index); // Alternar expansión
    };

    return (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: theme.palette.paper, // Fondo dinámico
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Preguntas Frecuentes (FAQs)
                    </Typography>
                    <List>
                        {faqs.map((faq, index) => (
                            <ListItem key={faq._id} alignItems="flex-start">
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle1" gutterBottom onClick={() => handleToggle(index)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        {faq.pregunta}
                                        {expanded === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </Typography>

                                    {expanded === index && (
                                        <Box>
                                            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                                {faq.respuesta}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default FAQs;
