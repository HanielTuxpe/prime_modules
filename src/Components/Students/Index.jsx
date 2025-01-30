import { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import banner from '../../assets/banner.png';
import StudentCalendar from './Calendar';
import { keyframes } from '@emotion/react';

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
    const [selectedEvent, setSelectedEvent] = useState(null); // Estado para la actividad seleccionada

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '5%',
                width: '100%',
                alignItems: 'top',
            }}
        >
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
                    flexDirection: 'row',
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
                        maxheight: 700,
                        maxWidth: 600
                    }}
                >
                    {/* Calendario con la función para manejar el clic en eventos */}
                    <StudentCalendar onSelectEvent={setSelectedEvent} />
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
