import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto-condensed/700.css'; // Extra-negrita

const getTheme = (darkMode) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#490C28' : '#921F45',
            },
            secondary: {
                main: darkMode ? '#1e1e1e' : '#f5f5f5',
            },
            background: {
                default: darkMode ? '#121212' : '#D9D9D9', // Fondo general para ambos modos
                paper: darkMode ? '#1e1e1e' : '#f5f5f5', // Fondo de componentes tipo "papel"
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000', // Ajuste del color del texto según el modo
            },
        },
        typography: {
            fontFamily: 'Roboto Condensed',
            h5: { fontWeight: 700,  color: darkMode ? '#FFFFFF' : '#FFFFFF' ,textShadow: darkMode ? '0 5px 3px rgb(0, 0, 0)' : 'none',},
            h7: {  fontWeight: 700 ,  color: darkMode ? '#FFFFFF' : '#FFFFFF',  textShadow: darkMode ? '0 5px 3px rgb(0, 0, 0)' : 'none',},
            h4: {  fontWeight: 700 ,  color: darkMode ? '#FFFFFF' : '#000000',  textShadow: darkMode ? '0 5px 3px rgb(0, 0, 0)' : 'none',},
         
            h3: { fontWeight: 600,  fontSize: '2.5rem', color: darkMode ? '#FFFFFF' : '#921F45' ,textShadow: darkMode ? '0 5px 3px rgb(0, 0, 0)' : 'none',},
            h6: { fontWeight: 700,  color: darkMode ? '#FFFFFF' : '#921F45' ,textShadow: darkMode ? '0 5px 3px rgb(0, 0, 0)' : 'none',},

            subtitle1: {
                fontWeight: 600, // Peso medio
                fontSize: '1rem', // Tamaño de fuente
                color: darkMode ? '#FFFFFF' : '#000000', // Color adaptable al modo
                lineHeight: 1.5, // Altura de línea
                textShadow: darkMode ? '0 5px 3px rgb(0, 0, 0)' : 'none',
            },
            subtitle2: {
                fontWeight: 600, // Peso medio
                fontSize: '1rem', // Tamaño de fuente
                color: darkMode ? '#FFFFFF' : '#FFFFFF', // Color adaptable al modo
                lineHeight: 1.5, // Altura de línea
                textShadow: darkMode ? '0 5px 3px rgb(0, 0, 0)' : 'none',
            },

            body1: {
                fontWeight: 400, // Peso normal
                fontSize: '1rem', // Tamaño estándar de texto
                color: '#FFFFFF', // Color adaptable al modo
                lineHeight: 1.6, // Espaciado estándar entre líneas
            },
            body2: {
                fontWeight: 300, // Peso más ligero
                fontSize: '0.875rem', // Tamaño ligeramente menor
                color: darkMode ? '#FFFFFF' : '#000000', // Color adaptable al modo
                lineHeight: 1.5,
            },

           
           
            fontWeightBold: 900,
        },
        shadows: Array(25).fill(darkMode 
            ? '6px 4px 6px rgba(255, 255, 255, 0.3)' 
            : '6px 4px 6px rgba(0, 0, 0, 0.3)'
        ), // Define 25 sombras para evitar el error de índice

        custom: {
            boxShadow: darkMode 
                ? '0 5px 9px rgba(213, 0, 50, 3)' // Para el modo oscuro
                : 'none', // Para el modo claro
            dropShadow: darkMode 
                ? 'drop-shadow(1px 5px 2px rgb(0, 255, 0))' // Para el modo oscuro
                : 'none', // Para el modo claro
        },

        
    
    });

export default getTheme;
