import { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import { obtenerMatricula } from '../Access/SessionService';
import banner from '../../assets/banner.png';
import StudentCalendar from './Calendar';

const BaseURL = import.meta.env.VITE_URL_BASE_API;

// Animación de aparición
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Index = () => {
  const matricula = obtenerMatricula(); // Obtener la matrícula del estudiante desde el servicio de sesión
  const [selectedEvent, setSelectedEvent] = useState(null); // Estado para la actividad seleccionada
  const [events, setEvents] = useState([]); // Estado para los eventos del calendario
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // Estado para conexión

  // 🔌 Detectar conexión/desconexión en tiempo real
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Obtener eventos del calendario
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!isOffline) {
          const response = await axios.get(`${BaseURL}calendar`, {
            params: { matricula },
          });
          if (response.status === 200 && response.data?.events) {
            const fetchedEvents = response.data.events;
            setEvents(fetchedEvents);
            // Guardar en localStorage
            localStorage.setItem('calendarEvents', JSON.stringify(fetchedEvents));
          } else {
            console.warn('No se encontraron eventos para la matrícula.');
            const localEvents = localStorage.getItem('calendarEvents');
            if (localEvents) {
              setEvents(JSON.parse(localEvents));
            }
          }
        } else {
          console.warn('⚠️ Sin conexión, cargando eventos guardados...');
          const localEvents = localStorage.getItem('calendarEvents');
          if (localEvents) {
            setEvents(JSON.parse(localEvents));
          }
        }
      } catch (error) {
        console.warn('⚠️ Error al cargar eventos, intentando con datos locales...');
        const localEvents = localStorage.getItem('calendarEvents');
        if (localEvents) {
          setEvents(JSON.parse(localEvents));
        } else {
          console.error('Error al obtener eventos:', error);
        }
      }
    };

    if (matricula) {
      fetchEvents();
    }
  }, [matricula, isOffline]);

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1%',
        width: '100%',
        alignItems: 'top',
      }}
    >
      {/* 🔌 Indicador de conexión */}
      {isOffline && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
          ⚠️ Estás sin conexión. Se están mostrando los eventos guardados.
        </Alert>
      )}

      {/* Contenedor de la imagen */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          gap: 6,
        }}
      >
        <img
          src={banner}
          alt="Banner-PODAI"
          style={{
            width: '100%',
            maxWidth: '100vw',
            height: 'auto',
            boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.9)',
            borderRadius: 10,
          }}
        />
      </Box>

      {/* Contenedor con dos Boxes alineados horizontalmente */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Responsive: columna en móviles, fila en escritorio
          gap: 2,
          marginTop: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#cdcdcd',
            padding: 2,
            borderRadius: 5,
            maxHeight: 700,
            maxWidth: { xs: '100%', md: 600 }, // Responsive: ancho completo en móviles
            overflow: 'auto', // Soporte para desbordamiento
          }}
        >
          {/* Calendario con eventos y función para manejar el clic */}
          <StudentCalendar onSelectEvent={setSelectedEvent} events={events} matricula={matricula} />
        </Box>

        {/* Box donde se muestra la actividad seleccionada */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#cdcdcd',
            padding: 2,
            borderRadius: 5,
            textAlign: 'left',
            animation: selectedEvent ? `${fadeIn} 0.5s ease-out` : 'none',
            boxShadow: 2,
          }}
        >
          {selectedEvent ? (
            <>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#333',
                }}
              >
                {selectedEvent.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginY: 1,
                  color: '#555',
                }}
              >
                {selectedEvent.description.split('\n').map((item, index) => (
                  <span key={index}>
                    {item}
                    <br />
                  </span>
                ))}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#888',
                }}
              >
                {selectedEvent.end.toLocaleString()}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body1"
              sx={{
                color: '#888',
              }}
            >
              Selecciona una actividad en el calendario
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Index;