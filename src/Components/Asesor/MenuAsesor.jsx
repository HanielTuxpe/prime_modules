import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { Home, Groups, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const menuItems = [
    { text: 'Inicio', icon: <Home />, path: '/Docente/' },
    { 
        text: 'Grupo Asesorado', 
        icon: <Groups />, 
        path: '/Docente/GrupoAsesorado',
        subItems: [
            { text: 'Lista Alumnos', path: '/Docente/GrupoAsesorado' },
            { text: 'Lista en Riesgo', path: '/Docente/GrupoAsesorado/Riesgo' },
        ]
    },
    { 
        text: 'Materias Impartidas', 
        icon: <Groups />, 
        path: '/Docente/MateriasImpartidas',
        subItems: [
            { text: 'Lista Alumnos', path: '/Docente/MateriasImpartidas' },
            { text: 'Lista en Riesgo', path: '/Docente/MateriasImpartidas/Riesgo' },
        ]
    }
];

const AlumnoMenu = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSubItemPath, setSelectedSubItemPath] = useState('');
    const [openSubMenus, setOpenSubMenus] = useState({});
    const navigate = useNavigate();

    const handleListItemClick = (index, path) => {
        setSelectedIndex(index);
        setSelectedSubItemPath(path);
        navigate(path);
    };

    const handleSubMenuToggle = (index) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <List>
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                    <ListItem 
                        button 
                        selected={selectedIndex === index} 
                        onClick={() => {
                            handleListItemClick(index, item.path);
                            if (item.subItems) {
                                handleSubMenuToggle(index);
                            }
                        }}
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
                        {item.subItems && (
                            openSubMenus[index] ? <ExpandLess /> : <ExpandMore />
                        )}
                    </ListItem>
                    {item.subItems && (
                        <Collapse in={openSubMenus[index]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {item.subItems.map((subItem, subIndex) => (
                                    <ListItem
                                        button
                                        key={subIndex}
                                        sx={{ 
                                            pl: 4,
                                            bgcolor: selectedSubItemPath === subItem.path ? 'primary.light' : 'transparent',
                                            '&:hover': { bgcolor: 'primary.dark', color: '#fff' }
                                        }}
                                        onClick={() => handleListItemClick(index, subItem.path)}
                                    >
                                        <ListItemText 
                                            primary={subItem.text}
                                            sx={{ color: selectedSubItemPath === subItem.path ? 'primary.main' : 'inherit' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    )}
                </React.Fragment>
            ))}
        </List>
    );
};

export default AlumnoMenu;