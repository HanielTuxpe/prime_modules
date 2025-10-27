import { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { obtenerTipoUsuario } from '../Access/SessionService';
import AlumnoMenu from '../Students/MenuAlumnos';
import AsesorMenu from '../Asesor/MenuAsesor';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#1e1e2d',
    color: '#fff',
  },
}));

const DefaultMenu = () => (
  <List sx={{ p: 2 }}>
    <ListItem
      component={Link}
      to="/Publico/login"
      sx={{
        color: '#fff',
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
      }}
    >
      <ListItemText primary="Iniciar Sesión" />
    </ListItem>
    <ListItem
      component={Link}
      to="/"
      sx={{
        color: '#fff',
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
      }}
    >
      <ListItemText primary="Home" />
    </ListItem>
  </List>
);

function SideMenu({ open, toggleMenu }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = obtenerTipoUsuario();
    setUser(savedUser);
  }, []); // Ejecutar solo al montar el componente

  const getMenuComponent = (userType) => {
    switch (userType) {
      case 'Estudiante':
        return <AlumnoMenu />;
      case 'Docente':
        return <AsesorMenu />;
      default:
        return <DefaultMenu />;
    }
  };

  return (
    <StyledDrawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={toggleMenu}
    >
     
      {getMenuComponent(user)}
    </StyledDrawer>
  );
}

SideMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default SideMenu;