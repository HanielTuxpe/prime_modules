import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, useMediaQuery, Alert } from '@mui/material';
import bannerLogin from '../../assets/banner-login.jpeg';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visits, setVisits] = useState(0);
  const [usersConnected, setUsersConnected] = useState(0);
  const [offline, setOffline] = useState(!navigator.onLine);

  const isMobile = useMediaQuery('(max-width: 600px)');
  const baseUrl = import.meta.env.VITE_URL_BASE_API || '';

  // detectar offline
  useEffect(() => {
    const handleConnectionChange = () => {
      setOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  // prefetch para cache
  useEffect(() => {
    if (navigator.onLine) {
      fetch(`${baseUrl}Politicas`);
      fetch(`${baseUrl}faqs`);
      fetch(`${baseUrl}AcercaDe`);
    }
  }, []);

  // visits + theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);

    const storedVisits = parseInt(localStorage.getItem('visits'), 10) || 0;
    const storedUsersConnected = parseInt(localStorage.getItem('usersConnected'), 10) || 0;

    const updatedVisits = storedVisits + 1;
    const updatedUsersConnected = 20;

    setVisits(updatedVisits);
    setUsersConnected(updatedUsersConnected);

    localStorage.setItem('visits', updatedVisits);
    localStorage.setItem('usersConnected', updatedUsersConnected);
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%',
        width: '100%',
        maxWidth: '90%',
        mx: 'auto',
        padding: 0,
      }}
    >

  
      {/* Banner */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          mb: 5,
          borderRadius: 8,
          backgroundColor: '#BC955B',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            flex: isMobile ? '1 1 100%' : '0 0 50%',
            height: { xs: 170, md: 200 },
            backgroundColor: '#921F45',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            clipPath: isMobile ? 'none' : 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)',
          }}
        >
          <Box
            component="img"
            src={bannerLogin}
            alt="Banner Login"
            sx={{
              width: '80%',
              height: '80%',
              objectFit: 'cover',
              opacity: 0.8,
            }}
          />
        </Box>

        <Box
          sx={{
            flex: isMobile ? '1 1 100%' : '0 0 50%',
            height: { xs:170, md:200 },
            backgroundColor: '#BC955B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 2,
          }}
        >
          <Typography sx={{ color:'#fff', fontSize:'clamp(1rem,1.5vw,2.5rem)', fontWeight:400, maxWidth:'90%' }}>
            PRIME, nace para apoyar de manera virtual al estudiante, a través del uso de las tecnologías...
          </Typography>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'space-evenly',
        width: '100%',
        gap: isMobile ? 2 : 4,
        mt: 3,
      }}>
        <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', background:'#BC955B', boxShadow:'4px 10px 20px rgba(0,0,0,0.9)', padding:3, borderRadius:2 }}>
          <Typography sx={{ color:'#fff', fontSize:'clamp(1rem,2vw,1.3rem)', fontWeight:500 }}>Visitas totales desde su activación</Typography>
          <Typography sx={{ color:'#fff', fontSize:'clamp(2rem,6vw,3rem)', fontWeight:'bold' }}>{visits}</Typography>
        </Box>

        <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', background:'#BC955B', boxShadow:'4px 10px 20px rgba(0,0,0,0.9)', padding:3, borderRadius:2 }}>
          <Typography sx={{ color:'#fff', fontSize:'clamp(1rem,2vw,1.3rem)', fontWeight:500 }}>Usuarios Conectados</Typography>
          <Typography sx={{ color:'#fff', fontSize:'clamp(2rem,6vw,3rem)', fontWeight:'bold' }}>{usersConnected}</Typography>
        </Box>
      </Box>

    </Container>
  );
};

export default Index;
