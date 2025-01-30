import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import banner from '../../assets/banner.png';
import { useMediaQuery } from '@mui/material';



const Index = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [visits, setVisits] = useState(0); 
    const [usersConnected, setusersConnected] = useState(0); 
    const isMobile = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        // Cargar tema guardado en localStorage
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);

        const storedVisits = parseInt(localStorage.getItem('visits'), 10) || 0;
        const storedUsersConnected = parseInt(localStorage.getItem('usersConnected'), 1) || 0;
        
        const updatedVisits = storedVisits + 1;
        const updatedUsersConnected = (storedVisits - storedVisits + 20) - (storedUsersConnected + 1);
        setVisits(updatedVisits);
        setusersConnected(updatedUsersConnected);
        localStorage.setItem('visits', updatedVisits);
        localStorage.setItem('usersConnected', updatedUsersConnected);
    }, []);

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 0,
                marginTop: '5%',
                width: '100%',
                maxWidth: '100vw', // No exceder el ancho de la ventana
            }}
        >
            {/* Contenedor del Banner */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <img
                    src={banner}
                    alt="Banner-PODAI"
                    style={{
                        width: '100%', // Ajusta al ancho del contenedor
                        maxWidth: '100vw', // Restringe el ancho al tamaño de la ventana
                        height: 'auto', // Mantiene las proporciones
                        boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)',
                        borderRadius: 10,
                    }}
                />
            </Box>
    
            {/* Contenedores Responsivos */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    gap: isMobile ? 2 : 10, // Espaciado dinámico
                    mt: 5,
                }}
            >
                {/* Contenedor: Visitas Totales */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: isMobile ? '1 1 auto' : '0 1 30%', // Adaptación flexible
                        padding: 2, // Espaciado interno dinámico
                        background: '#BC955B',
                        boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)',
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 20,
                            textAlign: 'center',
                        }}
                    >
                        Visitas totales desde su activación
                    </Typography>
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 50,
                        }}
                    >
                        {visits}
                    </Typography>
                </Box>
    
                {/* Contenedor: Usuarios Conectados */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: isMobile ? '1 1 auto' : '0 1 30%', // Adaptación flexible
                        padding: 2, // Espaciado interno dinámico
                        background: '#BC955B',
                        boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)',
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 20,
                            textAlign: 'center',
                        }}
                    >
                        Usuarios Conectados
                    </Typography>
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: 50,
                        }}
                    >
                        {usersConnected}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
    
};

export default Index;
