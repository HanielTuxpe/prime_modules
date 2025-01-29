import { Container, Box } from '@mui/material';
import banner from '../../assets/banner.png'; // Ruta relativa ajustada
import StudentCalendar from './Calendar';

const Index = () => {

    {/**VARIABLES GLOBALES DEL COMPO */}

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '5%',
                width: '100%',
                maxWidth: '100vw',
                alignItems: 'top'
            }}
        >
            {/* Contenedor de la imagen */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    gap: 6
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
                    gap: 2, // Espacio entre los dos boxes
                    marginTop: 4, // Espacio superior
                }}
            >
                <Box
                    sx={{
                        flex: 1, // Hace que el Box ocupe el mismo tamaño
                        backgroundColor: '#cdcdcd', // Color de fondo
                        padding: 2, // Espaciado interno
                        borderRadius: 5, // Bordes redondeados
                    }}
                >
                    {/* Contenido del primer Box */}
                    <StudentCalendar/>
                </Box>
                
                {/**BOX PARA PONER LAS ACTIVIDADES DE ACUERDO A LAS FECHAS xd */}
                <Box
                    sx={{
                        flex: 1, // Hace que el Box ocupe el mismo tamaño
                        backgroundColor: '#cdcdcd', // Color de fondo
                        padding: 2, // Espaciado interno
                        borderRadius: 5, // Bordes redondeados
                    }}
                >
                    {/* Contenido del segundo Box */}
                    <h3>Box 2</h3>
                    <p>Contenido para el segundo box.</p>
                </Box>
            </Box>
        </Container>
    );
};

export default Index;
