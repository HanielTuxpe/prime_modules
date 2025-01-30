import { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, IconButton, useTheme, useMediaQuery, Tooltip } from '@mui/material';
//import { TableChart } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { obtenerTipoUsuario } from '../Access/SessionService';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LoginIcon from '@mui/icons-material/Login';
import Home from '@mui/icons-material/Home';
import { Business, People, Report } from '@mui/icons-material';
import PropTypes from 'prop-types';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(() => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        backgroundColor: '#1e1e2d', // Color oscuro del fondo del menú
        color: '#fff',
    },
}));

SideMenu.propTypes = {
    open: PropTypes.bool.isRequired, 
    toggleMenu: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    toggleDarkMode: PropTypes.func.isRequired,
    darkMode: PropTypes.bool.isRequired,
    usuario: PropTypes.object.isRequired, // Cambia esto si usuario tiene una estructura específica
  };

function SideMenu({ open, toggleMenu, onLogout, toggleDarkMode, darkMode, usuario }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => obtenerTipoUsuario()); // Inicializa el estado con el valor de la cookie
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        // Ejecuta cada vez que el componente se renderiza
        const savedUser = obtenerTipoUsuario(); // Obtiene el valor actual de la cookie
        if (savedUser !== user) { // Si el valor de la cookie es diferente del estado actual
            setUser(savedUser); // Actualiza el estado solo si la cookie ha cambiado
        }
    }, [user]); // Se ejecuta siempre que el estado `user` cambie


    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    const handleGoIndex = () => {
        // Verifica si hay un usuario almacenado
        if (user) {
            navigate('/index'); // Si hay usuario, navega a /index
        } else {
            navigate('/'); // Si no hay usuario, navega a /
        }
    };

    const handleCrudClick = () => {
        navigate('/Crud');
    };

    const handleUsuariosClick = () => {
        navigate('/Usuarios');
    };

    const handleReporteSistemClick = () => {
        navigate('/ReporteSistem');
    };

    return (
        <StyledDrawer
            variant="temporary"
            anchor="right"
            open={open}
            onClose={toggleMenu}
        >
            <List>
                {user && user === 'Admin' ? (
                    <>
                        <ListItem>
                            <ListItemText primary="ADMINISTRADOR" style={{ color: '#ffffff' }} />
                        </ListItem>

                        <ListItem>
                            <ListItemText primary={`Bienvenido, ${user}`} style={{ color: '#ffffff' }} />
                        </ListItem>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={2} sx={{ flexGrow: 0, marginRight: "2%", }}>

                            <Tooltip title="Modo" arrow>
                                <IconButton color="inherit" onClick={toggleDarkMode}
                                    sx={{
                                        display: isSmallScreen ? 'block' : 'none',
                                    }}
                                >
                                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>


                            {usuario ? (
                                <Tooltip title="Exit" arrow>
                                    <IconButton color="inherit" onClick={handleLogoutClick}
                                        sx={{
                                            display: isSmallScreen ? 'block' : 'none',
                                        }}
                                    >
                                        <ExitToAppIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Login" arrow>
                                    <IconButton color="inherit" onClick={handleLoginClick}
                                        sx={{
                                            display: isSmallScreen ? 'block' : 'none',
                                        }}
                                    >
                                        <LoginIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Home" arrow>
                                <IconButton color="inherit" onClick={handleGoIndex}
                                    sx={{
                                        display: isSmallScreen ? 'block' : 'none',
                                    }}
                                >
                                    <Home />
                                </IconButton>
                            </Tooltip>

                        </Box>

                        <ListItem button onClick={handleCrudClick}>
                            <ListItemIcon>
                                <Business style={{ color: '#c2c2c2' }} />
                            </ListItemIcon>
                            <Typography>
                                INFORMACIÓN DE LA EMPRESA
                            </Typography>
                        </ListItem>

                        <ListItem button onClick={handleUsuariosClick}>
                            <ListItemIcon>
                                <People style={{ color: '#c2c2c2' }} />
                            </ListItemIcon>
                            <Typography>
                                USUARIOS
                            </Typography>
                        </ListItem>

                        <ListItem button onClick={handleReporteSistemClick}>
                            <ListItemIcon>
                                <Report style={{ color: '#c2c2c2' }} />
                            </ListItemIcon>
                            <Typography>
                                REPORTES DE SISTEMA
                            </Typography>
                        </ListItem>

                    </>
                ) : (
                    <>

                        <ListItem>
                            <ListItemText variant="body1" primary={`Por favor, inicie sesión${user ? `, ${user}` : ''}`} style={{ color: '#ffffff' }} />
                        </ListItem>


                        <Box display="flex" alignItems="center" justifyContent="center" gap={2} sx={{ flexGrow: 0, marginRight: "2%", }}>

                            <Tooltip title="Modo" arrow>
                                <IconButton color="inherit" onClick={toggleDarkMode}
                                    sx={{
                                        display: isSmallScreen ? 'block' : 'none',
                                    }}
                                >
                                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>


                            {usuario ? (
                                <Tooltip title="Exit" arrow>
                                    <IconButton color="inherit" onClick={handleLogoutClick}
                                        sx={{
                                            display: isSmallScreen ? 'block' : 'none',
                                        }}
                                    >
                                        <ExitToAppIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Login" arrow>
                                    <IconButton color="inherit" onClick={handleLoginClick}
                                        sx={{
                                            display: isSmallScreen ? 'block' : 'none',
                                        }}
                                    >
                                        <LoginIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Home" arrow>
                                <IconButton color="inherit" onClick={handleGoIndex}
                                    sx={{
                                        display: isSmallScreen ? 'block' : 'none',
                                    }}
                                >
                                    <Home />
                                </IconButton>
                            </Tooltip>

                        </Box>

                    </>
                )}
            </List>
        </StyledDrawer>
    );
}

export default SideMenu;
