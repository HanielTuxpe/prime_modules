import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, IconButton } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import banner from '../../assets/banner-login.png';
import { useMediaQuery } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { iniciarSesion } from './SessionService';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const Login = () => {
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isCodeRequired, setIsCodeRequired] = useState(false);
    const isMobile = useMediaQuery('(max-width: 600px)');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!matricula.trim() || !password.trim() || !userType.trim()) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        const sanitizedMatricula = DOMPurify.sanitize(matricula.trim());
        const sanitizedPassword = DOMPurify.sanitize(password.trim());
        const sanitizedUserType = DOMPurify.sanitize(userType.trim());

    
        try {
            const loginResponse = await axios.post('http://localhost:3000/access', {
                matricula: sanitizedMatricula,
                password: sanitizedPassword,
                userType: sanitizedUserType,
            });

            if (loginResponse.status === 200) {
                toast.success(loginResponse.data.message);

                if (sanitizedUserType === 'estudiante') {
                    // Solo para estudiantes: solicitar código de verificación
                    setIsCodeRequired(true);
               
                } else if (sanitizedUserType === 'docente') {
                    // Para docentes: iniciar sesión directo sin código
                    iniciarSesion('Docente', sanitizedMatricula);
                    toast.success('Bienvenido docente');
                    window.location.replace('/Docente/');
                }
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
            const verifyResponse = await axios.post('http://localhost:3000/CodigoVerificacion', {
                matricula,
                code: Number(code),
            });

            const TipodeUsuario = 'Estudiante';

            if (verifyResponse.status === 200) {
                iniciarSesion(TipodeUsuario, matricula);

                // Aseguramos la redirección después de un tiempo breve para garantizar el flujo correcto.
                toast.success(verifyResponse.data.message);
                window.location.replace('/Estudiante/');
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


    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                color: '#fff',
                marginTop: '1%'
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
                                    <option value="estudiante">Estudiante</option>
                                    <option value="docente">Docente</option>
                                </TextField>

                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="matricula"
                                    label={userType === 'docente' ? 'Clave Docente' : 'Matrícula'}
                                    name="matricula"
                                    autoComplete="matricula"
                                    autoFocus
                                    value={matricula}
                                    onChange={(e) => setMatricula(e.target.value)}
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
                            <Link href="/Publico/forgot-password" variant="h5" sx={{ mr: 1, fontSize: 18, color: '#fff' }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;
