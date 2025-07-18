import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box, Container } from '@mui/material';

import IndexPublic from './Components/Public/Index';
import Login from './Components/Access/LogIn';
import ForgotPassword from './Components/Access/PasswdRecovery';
import Header from './Components/Public/Header';
import Footer from './Components/Public/Footer';
import { Error400, Error404, Error500 } from './Components/Public/Error_Codigo';

// Info de la empresa
import Politicas from './Components/Public/InfoDeEmpresa/Politicas';
import FAQS from './Components/Public/InfoDeEmpresa/FAQS';
import AcercaDe from './Components/Public/InfoDeEmpresa/AcercaDe';

// Estudiante
import Calendar from './Components/Students/Calendar';
import Calificaciones from './Components/Students/Calificaciones';
import Historial from './Components/Students/Historial';
import Rendimiento from './Components/Students/Rendimiento';
import Predicciones from './Components/Students/Predicciones';
import Profile from './Components/Students/Profile';
import Payments from './Components/Students/Paymets';

// Asesor / Docente
import GrupoAccesorado from './Components/Asesor/GrupoAsesorado';
import GrupoAsesoradoRiesgo from './Components/Asesor/GrupoAsesoradoRiesgo';
import MateriasImpartidasView from './Components/Asesor/MateriasImpartidasView';
import MateriasImpartidasAlumRiesgo from './Components/Asesor/MateriasImpartidasAlumRiesgo';
import HorarioDocente from './Components/Asesor/Horario';

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

  const handleLogin = (tipoUsuario) => {
    setUsuario(tipoUsuario);
  };

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
      <Container
        disableGutters
        maxWidth={false}
        sx={{ mt: 1, flexGrow: 1, width: '100%' }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );

  Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const RutaPrivada = ({ children, tipoPermitido }) => {
    if (!usuario) {
      return <Navigate to="/Publico/login" replace />;
    }
    if (usuario !== tipoPermitido) {
      return <Navigate to="/Publico/Error400" replace />;
    }
    return children;
  };

  RutaPrivada.propTypes = {
    children: PropTypes.node.isRequired,
    tipoPermitido: PropTypes.string.isRequired,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout key={usuario ? 'authenticated' : 'guest'}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<IndexPublic />} />
            <Route path="/Publico/" element={<IndexPublic />} />
            <Route path="/Publico/login" element={usuario ? <Navigate to={`/${usuario}/`} /> : <Login onLogin={handleLogin} />} />
            <Route path="/Publico/forgot-password" element={<ForgotPassword />} />
            <Route path="/Publico/Politicas" element={<Politicas />} />
            <Route path="/Publico/FAQS" element={<FAQS />} />
            <Route path="/Publico/Acercade" element={<AcercaDe />} />
            <Route path="/Publico/Error404" element={<Error404 />} />
            <Route path="/Publico/Error400" element={<Error400 />} />
            <Route path="/Publico/Error500" element={<Error500 />} />

            {/* Rutas protegidas - Estudiante */}
            <Route path="/Estudiante/" element={
              <RutaPrivada tipoPermitido="Estudiante">
                <Calendar />
              </RutaPrivada>
            } />
            <Route path="/Estudiante/Calificaciones" element={
              <RutaPrivada tipoPermitido="Estudiante">
                <Calificaciones />
              </RutaPrivada>
            } />
            <Route path="/Estudiante/Historial" element={
              <RutaPrivada tipoPermitido="Estudiante">
                <Historial />
              </RutaPrivada>
            } />
            <Route path="/Estudiante/Rendimiento" element={
              <RutaPrivada tipoPermitido="Estudiante">
                <Rendimiento />
              </RutaPrivada>
            } />
             <Route path="/Estudiante/Predicciones" element={
              <RutaPrivada tipoPermitido="Estudiante">
                <Predicciones />
              </RutaPrivada>
            } />
            <Route path="/Estudiante/Perfil" element={
              <RutaPrivada tipoPermitido="Estudiante">
                <Profile />
              </RutaPrivada>
            } />
            <Route path="/Estudiante/Pagos" element={
              <RutaPrivada tipoPermitido="Estudiante">
                <Payments />
              </RutaPrivada>
            } />

            {/* Rutas protegidas - Docente */}
            <Route path="/Docente/" element={
              <RutaPrivada tipoPermitido="Docente">
                <HorarioDocente />
              </RutaPrivada>
            } />
            <Route path="/Docente/GrupoAsesorado" element={
              <RutaPrivada tipoPermitido="Docente">
                <GrupoAccesorado />
              </RutaPrivada>
            } />
            <Route path="/Docente/GrupoAsesorado/Riesgo" element={
              <RutaPrivada tipoPermitido="Docente">
                <GrupoAsesoradoRiesgo />
              </RutaPrivada>
            } />
            <Route path="/Docente/MateriasImpartidas" element={
              <RutaPrivada tipoPermitido="Docente">
                <MateriasImpartidasView />
              </RutaPrivada>
            } />
            <Route path="/Docente/MateriasImpartidas/Riesgo" element={
              <RutaPrivada tipoPermitido="Docente">
                <MateriasImpartidasAlumRiesgo />
              </RutaPrivada>
            } />

            {/* Ruta por defecto a Error404 */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Layout>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
};

export default App;