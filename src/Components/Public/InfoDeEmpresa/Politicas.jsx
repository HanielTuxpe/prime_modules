import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Link } from '@mui/material';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

import uthh from '../../../assets/uthh.png';
import FacebookIcon from '../../../assets/facebook.png';
import TwitterIcon from '../../../assets/twitter.png';
import InstagramIcon from '../../../assets/instagram.png';
import LinkedInIcon from '../../../assets/linkedin.png';
import WhatsAppIcon from '../../../assets/whatsapp.png';
import YouTubeIcon from '../../../assets/youtube.png';

const API_BASE_URL = 'https://prime-api-iawe.onrender.com/';
const URL_POLITICAS = `${API_BASE_URL}/Politicas`;

const PrivacyPolicy = () => {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animaciones para las secciones
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Animación para el título principal
  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Obtener y procesar el archivo Excel
  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        const response = await fetch(URL_POLITICAS);
        if (!response.ok) {
          throw new Error(`Error al cargar el archivo de políticas: ${response.statusText}`);
        }
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets['Hoja1'];
        if (!sheet) {
          throw new Error('No se encontró la hoja "Hoja1" en el archivo Excel');
        }
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: ['Seccion', 'TipoElemento', 'Contenido'],
          range: 1, // Ignorar la primera fila (encabezados)
        });

        // Depuración: Mostrar datos crudos
        console.log('Datos crudos del Excel:', data);

        // Agrupar datos por sección
        const secciones = data.reduce((acc, row) => {
          const seccionId = row.Seccion;
          if (!acc[seccionId]) {
            acc[seccionId] = [];
          }
          acc[seccionId].push({
            tipoElemento: row.TipoElemento.trim().toLowerCase(),
            contenido: row.Contenido,
          });
          return acc;
        }, {});

        // Convertir a array de secciones ordenadas por id
        const seccionesOrdenadas = Object.keys(secciones)
          .map((seccionId) => ({
            id: parseInt(seccionId),
            elementos: secciones[seccionId], // Mantener el orden original del Excel
          }))
          .sort((a, b) => a.id - b.id);

        // Depuración: Mostrar secciones procesadas
        console.log('Secciones procesadas:', seccionesOrdenadas);

        setPoliticas(seccionesOrdenadas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticas();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="body1" sx={{ color: '#921F45', mr: 2 }}>
          Cargando políticas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" sx={{ color: '#921F45' }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      disableGutters
      sx={{
        maxWidth: '100%',
        bgcolor: 'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)',
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg" aria-label="Políticas de Privacidad">
        {politicas.map((seccion, index) => (
          <motion.div
            key={seccion.id}
            variants={index === 0 ? titleVariants : sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                p: { xs: 4, md: 8 },
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  bgcolor: '#921F45',
                },
                mt: index === 0 ? 0 : 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              {seccion.elementos.map((elemento, idx) => {
                if (elemento.tipoElemento === 'título' || elemento.tipoElemento === 'subtitulo') {
                  return (
                    <Typography
                      key={idx}
                      variant={index === 0 ? 'h3' : 'h5'}
                      component={index === 0 ? 'h1' : 'h2'}
                      sx={{
                        color: '#921F45',
                        fontWeight: index === 0 ? 'bold' : 'medium',
                        mb: 4,
                        textAlign: index === 0 ? 'center' : 'left',
                        fontSize: index === 0 ? { xs: '2rem', md: '3rem' } : '1.5rem',
                      }}
                    >
                      {elemento.tipoElemento === 'título' && index === 0
                        ? elemento.contenido
                        : `${seccion.id}. ${elemento.contenido}`}
                    </Typography>
                  );
                } else if (elemento.tipoElemento === 'parrafo') {
                  return (
                    <Typography
                      key={idx}
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        textAlign: index === 0 ? 'center' : 'left',
                        maxWidth: index === 0 ? '800px' : 'none',
                        mx: index === 0 ? 'auto' : 0,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                      }}
                    >
                      {elemento.contenido}
                    </Typography>
                  );
                } else if (elemento.tipoElemento === 'item') {
                  return (
                    <List key={idx} sx={{ pl: 2, mt: idx > 0 && seccion.elementos[idx - 1].tipoElemento !== 'item' ? 1 : 0 }}>
                      <ListItem
                        sx={{
                          py: 0.5,
                          display: 'list-item',
                          listStyleType: 'none',
                          pl: 4,
                          position: 'relative',
                          '&:before': {
                            content: '"➤"',
                            position: 'absolute',
                            left: 0,
                            color: 'text.secondary',
                            fontSize: '1.2rem',
                          },
                        }}
                      >
                        <ListItemText
                          primary={elemento.contenido}
                          sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
                        />
                      </ListItem>
                    </List>
                  );
                } else if (elemento.tipoElemento === 'items') {
                  const itemsList = elemento.contenido
                    .split(/(?<!\d)\.(?!\d)/) // Dividir por puntos, excluyendo puntos en números
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0);
                  return (
                    <List key={idx} sx={{ pl: 2, mt: idx > 0 && seccion.elementos[idx - 1].tipoElemento !== 'items' && seccion.elementos[idx - 1].tipoElemento !== 'item' ? 1 : 0 }}>
                      {itemsList.map((item, itemIdx) => (
                        <ListItem
                          key={itemIdx}
                          sx={{
                            py: 0.5,
                            display: 'list-item',
                            listStyleType: 'none',
                            pl: 4,
                            position: 'relative',
                            '&:before': {
                              content: '"➤"',
                              position: 'absolute',
                              left: 0,
                              color: 'text.secondary',
                              fontSize: '1.2rem',
                            },
                          }}
                        >
                          <ListItemText
                            primary={item}
                            sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  );
                }
                return null;
              })}
            </Box>
          </motion.div>
        ))}

        {/* Footer */}
        <Divider sx={{ my: 4, borderColor: '#921F45' }} />
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <img
            src={uthh}
            alt="UTHH Logo"
            style={{ maxWidth: '100px', marginBottom: '16px' }}
          />
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mb: 2 }}
          >
            © {new Date().getFullYear()} Universidad Tecnológica de la Huasteca Hidalguense. Todos los derechos reservados.
          </Typography>
          <List sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', p: 0 }}>
            {[
              { name: 'WhatsApp', icon: WhatsAppIcon, url: '#' },
              { name: 'Facebook', icon: FacebookIcon, url: '#' },
              { name: 'Instagram', icon: InstagramIcon, url: '#' },
              { name: 'YouTube', icon: YouTubeIcon, url: '#' },
              { name: 'Twitter', icon: TwitterIcon, url: '#' },
              { name: 'LinkedIn', icon: LinkedInIcon, url: '#' },
            ].map((social, index) => (
              <ListItem
                key={index}
                sx={{
                  width: 'auto',
                  display: 'inline-flex',
                  listStyleType: 'none',
                  px: 1,
                  '&:before': {
                    content: '"➤"',
                    color: 'text.secondary',
                    fontSize: '1.2rem',
                    mr: 1,
                  },
                }}
              >
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: '#921F45', textDecoration: 'underline' },
                  }}
                >
                  <img
                    src={social.icon}
                    alt={`${social.name} icon`}
                    style={{ width: '20px', height: '20px', marginRight: '8px' }}
                  />
                  <ListItemText
                    primary={social.name}
                    sx={{ '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.9rem' } }}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;