import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box, Container } from '@mui/material';
import IndexPublic from './Components/Students/Index';
import Login from './Components/Access/LogIn';
import ForgotPassword from './Components/Access/PasswdRecovery';
import Header from './Components/Public/Header';
import Footer from './Components/Public/Footer';
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

          </Routes>
        </Layout>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
};

export default App;