import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import banner from '../../assets/banner.png';
import { useMediaQuery } from '@mui/material';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visits, setVisits] = useState(0);
  const [usersConnected, setUsersConnected] = useState(0);
  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);

    const storedVisits = parseInt(localStorage.getItem('visits'), 10) || 0;
    const storedUsersConnected = parseInt(localStorage.getItem('usersConnected'), 10) || 0;

    const updatedVisits = storedVisits + 1;
    const updatedUsersConnected = 20; // Simplified logic for demo; adjust as needed

    setVisits(updatedVisits);
    setUsersConnected(updatedUsersConnected);

    localStorage.setItem('visits', updatedVisits);
    localStorage.setItem('usersConnected', updatedUsersConnected);
  }, []);

  return (
    <Container
      maxWidth={false} // Desactiva el ancho fijo de MUI
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%',
        width: '100%',
        maxWidth: '90%', // Ocupa solo el 70% del ancho máximo
        mx: 'auto', // Centra horizontalmente
        padding: 0,
      }}
    >
      {/* Banner Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%', // Ahora ocupa todo el ancho disponible dentro del container
          mb: 5,
        }}
      >
        <img
          src={banner}
          alt="Banner-PODAI"
          style={{
            width: '100%', // Hace que la imagen se adapte al ancho del contenedor
            height: 'auto',
            boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)',
            borderRadius: 10,
            display: 'block',
          }}
        />
      </Box>

      {/* Responsive Boxes Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'space-evenly',
          width: '100%',
          gap: isMobile ? 2 : 4,
          mt: 3,
        }}
      >
        {/* Total Visits Box */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: isMobile ? '1 1 100%' : '0 1 30%',
            padding: 3,
            background: '#BC955B',
            boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'medium',
            }}
          >
            Visitas totales desde su activación
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontSize: 50,
              fontWeight: 'bold',
            }}
          >
            {visits}
          </Typography>
        </Box>

        {/* Connected Users Box */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: isMobile ? '1 1 100%' : '0 1 30%',
            padding: 3,
            background: '#BC955B',
            boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'medium',
            }}
          >
            Usuarios Conectados
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontSize: 50,
              fontWeight: 'bold',
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
