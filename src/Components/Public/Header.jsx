import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Box, IconButton, useMediaQuery, Container, useTheme, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LoginIcon from '@mui/icons-material/Login';
import Home from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu'; // Icono para el menú
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/uthh.png';
import MenuPrincipal from '../Public/Menu'; // Importa tu menú
import { obtenerTipoUsuario } from '../Access/SessionService';
import PropTypes from 'prop-types';

const Header = ({ usuario, onLogout, toggleDarkMode, darkMode }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false); // Controla el estado de visibilidad del menú lateral

    const tituloLargo = "Plataforma de Rendimiento Integral y Monitoreo Educativo de la UTHH";
    const tituloCorto = "PRIME UTHH";

    // Cargar usuario inicial al montar el componente
    useEffect(() => {
        const savedUser = obtenerTipoUsuario();
        if (savedUser) {
            setUser(savedUser);
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/Publico/login');
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/Publico/');
    };

    const handleGoIndex = () => {
        // Verifica si hay un usuario almacenado
        if (user) {
            navigate('/Publico/index'); // Si hay usuario, navega a /index
        } else {
            navigate('/Publico/'); // Si no hay usuario, navega a /
        }
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu); // Alterna la visibilidad del menú lateral
    };

    return (
        <Box component="header" bgcolor="primary.main" color="white" p={2}
            position="static"
            sx={{
                display: "flex",
                flexDirection: isSmallScreen ? 'column' : 'row', // Cambia la dirección a columna en pantallas pequeñas
                alignItems: "center",
                padding: 0,
                boxShadow: theme.custom.boxShadow, // Aplica el boxShadow solo en modo oscuro
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: isSmallScreen ? 'row' : 'row', // Cambia la dirección a columna en pantallas pequeñas
                    maxWidth: "none",
                    '@media (min-width: 600px)': {
                        paddingLeft: 0, // Elimina el padding a partir de 600px
                        paddingRight: 0, // Elimina el padding a partir de 600px
                    },
                    '@media (min-width: 1200px)': {
                        maxWidth: "none",
                    },
                }}
            >
                {/* Contenedor de Imagen (Logo) */}

                <Box display="flex" alignItems="center" sx={{ flexGrow: 0, marginBottom: isSmallScreen ? '10px' : '0', }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            maxWidth: "80px", height: "auto",
                            marginRight: "10%", marginLeft: isSmallScreen ? '0' : '40%',
                            filter: theme.custom.dropShadow,
                        }}
                    />
                </Box>

                {/* Contenedor Texto */}
                <Box display="flex" alignItems="center" sx={{ flexGrow: 0, }}>
                    {/* Contenedor de Título */}
                    <Typography
                        variant="h5"
                      
                        sx={{
                            fontWeight: "bold",
                            display: isSmallScreen ? 'none' : 'block',
                            marginLeft: isSmallScreen ? '0' : '30px',
                        }}
                    >
                        {tituloLargo}
                    </Typography>
                    <Typography
                        variant="h5"
                      
                        sx={{
                            fontWeight: "bold",
                            display: isSmallScreen ? 'block' : 'none',
                        }}
                    >
                        {tituloCorto}
                    </Typography>
                </Box>

                {/* Contenedor de Funciones (Botones e Iconos) */}
                <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 0, marginRight: "2%", marginTop: isSmallScreen ? '10px' : '0' }}>
                    <Tooltip title="Modo" arrow>
                        <IconButton color="inherit" onClick={toggleDarkMode}
                            sx={{
                                display: isSmallScreen ? 'none' : 'block',
                            }}
                        >
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Tooltip>
                    {usuario ? (
                        <Tooltip title="Exit" arrow>
                            <IconButton color="inherit" onClick={handleLogoutClick}
                                sx={{
                                    display: isSmallScreen ? 'none' : 'block',
                                }}
                            >
                                <ExitToAppIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Login" arrow>
                            <IconButton color="inherit" onClick={handleLoginClick}
                                sx={{
                                    display: isSmallScreen ? 'none' : 'block',
                                }}
                            >
                                <LoginIcon />
                            </IconButton>
                        </Tooltip>

                    )}
                    <Tooltip title="Home" arrow>
                        <IconButton color="inherit" onClick={handleGoIndex}
                            sx={{
                                display: isSmallScreen ? 'none' : 'block',
                            }}
                        >
                            <Home />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Menu" arrow>
                        <IconButton color="inherit" onClick={toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    {/* Menú lateral */}
                    <MenuPrincipal open={showMenu} toggleMenu={toggleMenu} user={user} onLogout={onLogout} toggleDarkMode={toggleDarkMode} darkMode={darkMode} usuario={usuario} />
                </Box>
            </Container>
        </Box>

    );
};

Header.propTypes = {
    usuario: PropTypes.bool.isRequired, 
    toggleMenu: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    toggleDarkMode: PropTypes.func.isRequired,
    darkMode: PropTypes.bool.isRequired,
  };

export default Header;
