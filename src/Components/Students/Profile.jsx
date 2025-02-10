import { Container, Box, Typography } from '@mui/material';
import QRCode from "react-qr-code";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Profile = () => {
    let value = "20181236";

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '2%',
                alignItems: 'top',
                padding: 0,
                width: '100%',
                height: '100%',
            }}
            disableGutters
        >
            {/* Sección del QR */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    backgroundColor: '#cdcdcd',
                    flexDirection: 'column',
                    padding: 2,
                    border: 1,
                    borderColor: "#000",
                    maxWidth: '35%',
                    maxHeight: '100%',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600}}>
                    QR de acceso
                </Typography>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "50%", width: "50%" }}
                    value={value.toString()}
                    viewBox={`0 0 256 256`}
                    bgColor='transparent'
                />
            </Box>

            {/* Sección de información del estudiante */}
            <Box
                sx={{
                    flex: 2,
                    backgroundColor: '#cdcdcd',
                    padding: 3,
                    border: 1,
                    borderColor: "#000",
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Nombre del estudiante */}
                <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 2, color: '#333'  }}>
                    Daniel Martínez Hernández
                </Typography>

                {/* Foto de perfil */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2,  }}>
                    <AccountCircleIcon sx={{ fontSize: 100, color: '#000',  }} />
                </Box>
                <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 500, color: '#333'  }}>
                    Foto de Perfil
                </Typography>

                {/* Información del estudiante en dos columnas */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: 2, mt: 2, }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333'  }}>Matrícula del alumno</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333'  }}>20181236</Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333'  }}>Correo Electrónico Institucional</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333'  }}>alumno@uthh.edu.mx</Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>Programa Educativo</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333'  }}>Ingeniería en Desarrollo y Gestión de Software</Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>Cuatrimestre Actual</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333'  }}>Séptimo (7°)</Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>Grupo</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333'  }}>B</Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;
