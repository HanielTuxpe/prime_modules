import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';
import { styled } from '@mui/system';
import { obtenerTipoUsuario } from '../Access/SessionService';
import PropTypes from 'prop-types';

import AlumnoMenu from '../Students/MenuAlumnos';
import AsesorMenu from '../Asesor/MenuAsesor';

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

function SideMenu({ open, toggleMenu }) {
    const [user, setUser] = useState(() => obtenerTipoUsuario()); // Inicializa el estado con el valor de la cookie

    useEffect(() => {
        // Ejecuta cada vez que el componente se renderiza
        const savedUser = obtenerTipoUsuario(); // Obtiene el valor actual de la cookie
        if (savedUser !== user) { // Si el valor de la cookie es diferente del estado actual
            setUser(savedUser); // Actualiza el estado solo si la cookie ha cambiado
        }
    }, [user]); // Se ejecuta siempre que el estado `user` cambie


    const getMenuComponent = (user) => {
        switch (user) {
            //case 'Admin':
                //return <AdminMenu />;
            case 'Alumno':
                return <AlumnoMenu />;
            case 'Asesor':
                return <AsesorMenu />;
            default:
                return (
                    <AlumnoMenu />
                );
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
    onLogout: PropTypes.func.isRequired,
    toggleDarkMode: PropTypes.func.isRequired,
    darkMode: PropTypes.bool.isRequired,
    usuario: PropTypes.object.isRequired, // Cambia esto si usuario tiene una estructura específica
};


export default SideMenu;
