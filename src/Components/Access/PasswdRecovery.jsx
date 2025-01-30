import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, LinearProgress, IconButton, Link } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import banner from '../../assets/banner-login.png';
import { useMediaQuery } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const isMobile = useMediaQuery('(max-width: 600px)');

    // Función para calcular el progreso de la fortaleza de la contraseña
    const calculatePasswordProgress = () => {
        let progress = 0;

        // Validación de longitud mínima
        if (newPassword.length >= 8) progress += 20;

        // Validación de al menos una letra
        if (/[a-z]/.test(newPassword)) progress += 20;

        // Validación de al menos una letra Mayuscula
        if (/[A-Z]/.test(newPassword)) progress += 20;

        // Validación de al menos un número
        if (/\d/.test(newPassword)) progress += 20;

        // Validación de al menos un carácter especial
        if (/[!@#$%^&*()_+.,;:]/.test(newPassword)) progress += 20;

        return progress;
    };

    const passwordProgress = calculatePasswordProgress();

    const getProgressColor = () => {
        if (passwordProgress === 0) return '#FFFFFF'; // Blanco
        if (passwordProgress === 20) return '#FF0000'; // Rojo
        if (passwordProgress === 40) return '#FFFF00'; // Amarillo
        if (passwordProgress === 60) return '#FFA500'; // Entre amarillo y anaranjado
        if (passwordProgress === 80) return '#FF7F50'; // Anaranjado
        if (passwordProgress === 100) return '#00FF00'; // Verde
        return '#FFFFFF'; // Color por defecto
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.warning('Por favor, ingrese su correo electrónico.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.warning('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            const response = await axios.post('https://prj-server.onrender.com/forgot-password', {
                email,
            });

            if (response.status === 200) {
                setNombreUsuario(response.data.username);
                setIsEmailSent(true);
                toast.success('Código de recuperación enviado. Por favor, revise su bandeja de entrada.');
            } else if (response.status === 400) {
                toast.warning(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.warning(error.response.data.message);
            } else {
                toast.error('Error al enviar el correo de recuperación');
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://prj-server.onrender.com/verify-code', {
                code: codigo,
            });

            if (response.status === 200) {
                setIsCodeVerified(true);
                toast.success('Código verificado correctamente.');
                setToken(response.data.token);
            } else {
                toast.warning(response.data.message);
            }
        } catch (error) {
            toast.error('Error al verificar el código.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword.trim()) {
            toast.warning('Por favor, ingrese su nueva contraseña.');
            return;
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+.,;:])[A-Za-z\d!@#$%^&*()_+.,;:]{8,}$/;
        if (!passwordPattern.test(newPassword)) {
            toast.warning('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales (.!@#$%^&*()_+).');
            return;
        }

        try {

            // Realizar la solicitud con fetch
            const response = await fetch('https://prj-server.onrender.com/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            // Parsear la respuesta
            const data = await response.json();

            console.log(data);

            if (response.ok) { // `response.ok` es equivalente a verificar si el status es 200-299
                toast.success(data.message);
                navigate('/login');
            } else {
                toast.warning(data.message || 'Error inesperado');
            }
        } catch (error) {
            toast.error('Error al restablecer la contraseña.');
            console.error('Error:', error);
        }
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                color: '#fff',
                marginTop: 10,
            }}
        >
            <Box
                maxWidth="md"
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
                    borderRadius: 5,
                    maxWidth: isMobile ? 'auto' : '100%',
                    marginLeft: '0 !important',
                    marginRight: '0 !important',
                }}
            >
                {/* Banner Izquierdo */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: isMobile ? '100%' : '100%', // Ajustar para móvil
                        alignItems: 'center',
                        backgroundColor: '#921F45',
                        borderRadius: '10px 0 0 10px',
                    }}
                >
                    <img
                        src={banner}
                        alt="Banner Registro"
                        style={{
                            borderRadius: 10,
                            width: '80%', // Ajustar imagen al ancho disponible
                            height: 'auto', // Ajustar la altura en móviles
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#BC955B',
                        borderRadius: '0 10px 10px 0',
                        padding: 1,
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Recuperar Contraseña
                    </Typography>
                    {!isEmailSent ? (
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Correo Electrónico"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Enviar Correo de Recuperación
                            </Button>

                            <Typography variant="body2" align="center">
                                <Link href="/public/login" variant="h5" sx={{ mr: 1, fontSize: 18, color: '#fff' }}>
                                    Regresar
                                </Link>
                            </Typography>

                        </Box>
                    ) : !isCodeVerified ? (
                        <Box component="form" onSubmit={handleVerify} sx={{ mt: 3 }}>
                            <Typography component="p" variant="body1">
                                Usuario vinculado: {nombreUsuario}
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="codigo"
                                label="Código de Verificación"
                                name="codigo"
                                autoComplete="one-time-code"
                                autoFocus
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Verificar Código
                            </Button>

                      

                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 3 }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="newPassword"
                                label="Nueva Contraseña"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="newPassword"
                                autoComplete="new-password"
                                autoFocus
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    )
                                }}
                            />
                            <LinearProgress
                                variant="determinate"
                                value={passwordProgress}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    mt: 2,
                                    backgroundColor: '#E0E0E0',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: getProgressColor(),
                                    },
                                }}
                            />
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {passwordProgress === 0 && ''}
                                {passwordProgress === 20 && 'Muy débil'}
                                {passwordProgress === 40 && 'Débil'}
                                {passwordProgress === 60 && 'Moderada'}
                                {passwordProgress === 80 && 'Fuerte'}
                                {passwordProgress === 100 && 'Contraseña segura'}
                            </Typography>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Restablecer Contraseña
                            </Button>

                        </Box>
                    )}
                </Box>

            </Box>

        </Container>
    );
};

export default ForgotPassword;
