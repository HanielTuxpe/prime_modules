import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box, Container } from '@mui/material';
import IndexPublic from './Components/Students/Index';
import Login from './Components/Access/LogIn';
import ForgotPassword from './Components/Access/PasswdRecovery';
import Header from './Components/Public/Header';
import Footer from './Components/Public/Footer';

import {Error400, Error404, Error500} from './Components/Public/Error_Codigo';

// info de la empresa
import Politicas from './Components/Public/InfoDeEmpresa/Politicas';
import FAQS from './Components/Public/InfoDeEmpresa/FaQs';
import AcercaDe from './Components/Public/InfoDeEmpresa/AcercaDe';


import { obtenerTipoUsuario, cerrarSesion } from './Components/Access/SessionService';
import getTheme from './Components/theme';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = obtenerTipoUsuario();
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    if (savedUser) {
      setUsuario(savedUser);
    }
    setDarkMode(savedTheme);
  }, []);

  const handleLogout = () => {
    cerrarSesion();
    setUsuario(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const theme = getTheme(darkMode);

  const Layout = ({ children }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>

      <Header usuario={usuario} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Container component="main" sx={{ mt: 1, flexGrow: 1 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );

  Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <ThemeProvider sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} theme={theme}>
      <CssBaseline />
      <Router>
        <Layout key={usuario ? 'authenticated' : 'guest'}>
          <Routes>

            <Route path="/" element={<IndexPublic />} />
            <Route path="/public/" element={<IndexPublic />} />
            <Route path="/public/login" element={usuario ? <Navigate to="/" /> : <Login />} />
            <Route path="/public/forgot-password" element={<ForgotPassword />} />

            {/* Rutas públicas info de la empresa */}
            <Route path="/public/Politicas" element={<Politicas />} />
            <Route path="/public/FAQS" element={<FAQS />} />
            <Route path="/public/Acercade" element={<AcercaDe />} />

            <Route path="/public/Error404" element={<Error404 />} />
            <Route path="/public/Error400" element={<Error400 />} />
            <Route path="/public/Error500" element={<Error500 />} />

          </Routes>
        </Layout>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
};

export default App;