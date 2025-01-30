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
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PoliticasPublica = () => {
    const [items, setItems] = useState([]);
    const theme = useTheme();


    // Obtener políticas desde la API
    useEffect(() => {
        const fetchPoliticas = async () => {
            try {
                const response = await fetch('https://prj-server.onrender.com/politicas');
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error al obtener las políticas:', error);
            }
        };

        fetchPoliticas();
    }, []);

    const handleView = (archivoBuffer) => {
        // Convertir el Buffer en un Blob de tipo PDF
        const blob = new Blob([new Uint8Array(archivoBuffer.data)], { type: 'application/pdf' });

        // Crear una URL a partir del Blob
        const fileURL = URL.createObjectURL(blob);

        // Abrir el archivo en una nueva pestaña del navegador
        window.open(fileURL, '_blank');

        // Liberar la URL del Blob cuando ya no se necesite (opcional)
        setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    };

    const handleDownload = (archivoBuffer, nombreArchivo) => {
        // Convertir el Buffer a una cadena Base64
        const base64String = btoa(
            new Uint8Array(archivoBuffer.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Crear la URL del archivo en formato PDF para descargarlo
        const fileURL = `data:application/pdf;base64,${base64String}`;

        // Crear un enlace temporal para la descarga
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = nombreArchivo;

        // Agregar el enlace al DOM, hacer clic para iniciar la descarga y luego eliminarlo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        Políticas de Privacidad
                    </Typography>
                    <List>
                        {items.map((policy) => (
                            <ListItem key={policy._id} alignItems="flex-start">
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {policy.titulo_politica}
                                    </Typography>
                                    <Box>
                                        {policy.secciones && policy.secciones.map((section) => (
                                            <Box key={section._id} mb={2}>
                                                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                                    Sección: {section.titulo_seccion}
                                                </Typography>
                                                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                                    Descripción: {section.description}
                                                </Typography>
                                                <List dense>
                                                    {section.list && section.list.map((listItem, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={listItem} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        ))}

                                        {policy.Archivo && Array.isArray(policy.Archivo) && policy.Archivo[0] && (
                                            <Box>
                                                <Typography variant="body2" >
                                                    Archivo adjunto: {policy.Archivo[0].nombre}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<DownloadIcon />}
                                                        onClick={() => handleDownload(policy.Archivo[0].archivo, policy.Archivo[0].nombre)}
                                                    >
                                                        Descargar
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<VisibilityIcon />}
                                                        onClick={() => handleView(policy.Archivo[0].archivo)}
                                                    >
                                                        Ver
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PoliticasPublica;
