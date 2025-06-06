import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Home, Groups   } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const menuItems = [
    { text: 'Inicio', icon: <Home />, path: '/Docente/' },
    { text: 'Grupo Asesorado', icon: <Groups  />, path: '/Docente/GrupoAsesorado' },
    { text: 'Materias Impartidas', icon: <Groups  />, path: '/Docente/MateriasImpartidas' }

];

const AlumnoMenu = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    const handleListItemClick = (index, path) => {
        setSelectedIndex(index);
        navigate(path);
    };

    return (
        <List>
            {menuItems.map((item, index) => (
                <ListItem 
                    button 
                    key={index} 
                    selected={selectedIndex === index} 
                    onClick={() => handleListItemClick(index, item.path)} 
                    sx={{
                        bgcolor: selectedIndex === index ? 'primary.light' : 'transparent',
                        '&:hover': { bgcolor: 'primary.dark', color: '#fff' }
                    }}
                >
                    <ListItemIcon sx={{ color: selectedIndex === index ? 'primary.main' : 'inherit' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                        primary={item.text} 
                        sx={{ color: selectedIndex === index ? 'primary.main' : 'inherit' }}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default AlumnoMenu;
