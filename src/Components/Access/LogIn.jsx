import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, IconButton } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import banner from '../../assets/banner-login.png';
import { useMediaQuery } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { iniciarSesion } from './SessionService';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [code, setCode] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isCodeRequired, setIsCodeRequired] = useState(false); // Nuevo estado para manejar el código
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim() || !userType.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        if (!recaptchaToken) {
            toast.warning('La validación de reCAPTCHA es necesaria.');
            return;
        }

        try {
            // Validar reCAPTCHA
            await axios.post('https://prj-server.onrender.com/validate-recaptcha', {
                recaptchaToken,
            });

            // Si el reCAPTCHA es exitoso, proceder a validar las credenciales de usuario
            const loginResponse = await axios.post('https://prj-server.onrender.com/login', {
                username,
                password,
                userType,
            });

            if (loginResponse.status === 200) {
                toast.success(loginResponse.data.message);
                setIsCodeRequired(true); // Mostrar el campo de código
                setRecaptchaToken(null);
            } 
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'Error en el proceso de inicio de sesión.';
                toast.warning(errorMessage);
                console.log(error);
            } else {
                toast.error('Error en el proceso de inicio de sesión.');
            }
        }
    };

    const verifyCode = async (e) => {
        e.preventDefault();

        if (!code.trim() || code.length !== 6) {
            toast.warning('Por favor, introduzca un código válido de 6 dígitos.');
            return;
        }

        try {
            // Verificar código
            const verifyResponse = await axios.post('https://prj-server.onrender.com/code-login', {
                username,
                code: Number(code),
            });

            if (verifyResponse.status === 200) {
                iniciarSesion(verifyResponse.data.type);

                // Aseguramos la redirección después de un tiempo breve para garantizar el flujo correcto.
                toast.success(verifyResponse.data.message);
 
                window.location.replace('/index');

            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'Error en el proceso de verificación.';
                toast.warning(errorMessage);
                console.log(error);
            } else {
                toast.error('Error en el proceso de verificación.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                color: '#fff',
            }}
        >
            <Box
                maxWidth="md"
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
                    borderRadius: 2,
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
                        width: isMobile ? '100%' : '90%',
                        alignItems: 'center',
                        backgroundColor: '#921F45',
                    }}
                >
                    <img
                        src={banner}
                        alt="Banner PODAI"
                        style={{
                            borderRadius: 10,
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                </Box>

                {/* Formulario */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#BC955B',
                        height: '50%',
                        width: isMobile ? '100%' : '50%',
                        padding: isMobile ? 2 : 4,
                        borderRadius: '0 8px 8px 0',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {isCodeRequired ? 'Verificar Código' : 'Acceder al Sistema'}
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={isCodeRequired ? verifyCode : handleSubmit}
                        sx={{ mt: 3, color: '#fff' }}
                    >
                        {!isCodeRequired && (
                            <>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="userType"
                                    label="Elige un tipo de usuario"
                                    name="userType"
                                    select
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value=" "> </option>
                                    <option value="Admin">Admin</option>
                                    <option value="Student">Estudiante</option>
                                </TextField>

                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Usuario"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <Box sx={{ position: 'relative' }}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Contraseña"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <IconButton
                                        color="inherit"
                                        onClick={togglePasswordVisibility}
                                        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                                    >
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </Box>
                                <ReCAPTCHA
                                    sitekey="6Le3YWUqAAAAAAsmFo9W0iT84R3qyVKtLuPJ9hhr"
                                    onChange={onRecaptchaChange}
                                />
                            </>
                        )}

                        {isCodeRequired && (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="code"
                                label="Ingrese el código de verificación"
                                name="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isCodeRequired ? 'Verificar Código' : 'Acceder'}
                        </Button>

                        <Typography variant="body2" align="center">
                            <Link href="/forgot-password" variant="h5" sx={{ mr: 1, fontSize: 18, color: '#fff' }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                            O &nbsp;
                            <Link href="/SignUp" variant="h5" sx={{ mr: 1, fontSize: 18, color: '#fff' }}>
                                Regístrate
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
