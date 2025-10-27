import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText, Divider, Link, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import uthh from '../../../assets/uthh.png';
import FacebookIcon from '../../../assets/facebook.png';
import TwitterIcon from '../../../assets/twitter.png';
import InstagramIcon from '../../../assets/instagram.png';
import LinkedInIcon from '../../../assets/linkedin.png';
import WhatsAppIcon from '../../../assets/whatsapp.png';
import YouTubeIcon from '../../../assets/youtube.png';

const socialLinks = [
  { name: 'WhatsApp', icon: WhatsAppIcon, url: '#' },
  { name: 'Facebook', icon: FacebookIcon, url: '#' },
  { name: 'Instagram', icon: InstagramIcon, url: '#' },
  { name: 'YouTube', icon: YouTubeIcon, url: '#' },
  { name: 'Twitter', icon: TwitterIcon, url: '#' },
  { name: 'LinkedIn', icon: LinkedInIcon, url: '#' },
];

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks((prev) => !prev);
  };

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

  // Datos predeterminados adaptados a UTHH
  const defaultFaqs = [
    {
      _id: '1',
      pregunta: '¿Cómo puedo inscribirme en UTHH?',
      respuesta: 'Para inscribirte, visita el módulo de admisiones en nuestro portal web, completa el formulario de registro con tu información personal y académica, y sigue las instrucciones para enviar los documentos requeridos.',
    },
    {
      _id: '2',
      pregunta: '¿Qué programas académicos ofrece UTHH?',
      respuesta: 'UTHH ofrece programas en diversas áreas, incluyendo ingeniería, ciencias de la salud, ciencias sociales y humanidades. Consulta el catálogo completo en nuestro sitio web oficial.',
    },
    {
      _id: '3',
      pregunta: '¿Cómo recupero mi contraseña del portal estudiantil?',
      respuesta: 'Haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión del portal estudiantil. Recibirás un correo electrónico con un enlace para restablecer tu contraseña.',
    },
    {
      _id: '4',
      pregunta: '¿Qué tipo de soporte académico está disponible?',
      respuesta: 'Ofrecemos tutorías personalizadas, asesorías académicas, y acceso a recursos digitales las 24 horas. Contacta al equipo de soporte a través del módulo de atención en el portal o por correo institucional.',
    },
    {
      _id: '5',
      pregunta: '¿Cuáles son los métodos de pago para colegiaturas?',
      respuesta: 'Aceptamos pagos mediante tarjetas de crédito, transferencias bancarias y pagos en línea a través de nuestro portal seguro. Todos los datos de pago están protegidos con cifrado avanzado.',
    },
  ];

  // Obtener FAQs desde la API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const baseUrl = import.meta.env.VITE_URL_BASE_API || '';
        const response = await fetch(`${baseUrl}/faqs`);
        if (response.ok) {
          const data = await response.json();
          setFaqs(data);
        } else {
          console.error('Error al obtener los datos de la API');
          setFaqs(defaultFaqs);
        }
      } catch (error) {
        console.error('Error al obtener las FAQs:', error);
        setFaqs(defaultFaqs);
      }
    };

    fetchFaqs();
  }, []);

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)',
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div variants={titleVariants} initial="hidden" animate="visible">
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
            }}
          >
            {/* Título principal y logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <img src={uthh} alt="UTHH Logo" style={{ maxWidth: '150px', marginBottom: '16px' }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: '#921F45',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Preguntas Frecuentes - UTHH
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 6,
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Encuentra respuestas a las preguntas más comunes sobre la Universidad Tecnológica de la Huasteca Hidalguense (UTHH), desde el proceso de inscripción hasta los recursos disponibles para nuestros estudiantes.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ mt: 4 }}>
          {faqs.map((faq, index) => (
            <motion.div key={faq._id} variants={sectionVariants} initial="hidden" animate="visible">
              <Card
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  p: 2,
                  mb: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#921F45',
                      fontWeight: 'medium',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onClick={() => handleToggle(index)}
                  >
                    {faq.pregunta}
                    {expanded === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Typography>
                  {expanded === index && (
                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
                      {faq.respuesta}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Footer */}
        <Divider sx={{ mb: 4, borderColor: '#921F45' }} />
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            color: 'white',
            p: 2,
            boxShadow: theme.custom?.boxShadow,
          }}
        >
          {isSmallScreen ? (
            <Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <img src={uthh} alt="UTHH Logo" style={{ maxWidth: '100px', marginBottom: '16px' }} />
                
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                      fontWeight: 400,
                    }}
                  >
                    © {new Date().getFullYear()}. Todos los derechos reservados.
                  </Typography>
             
              </Box>
             
                <List
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    p: 0,
                    mt: 1,
                  }}
                >
                  {socialLinks.map((social, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        width: 'auto',
                        px: 1,
                      }}
                    >
                      <Link
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: '#921F45' },
                        }}
                      >
                        <img
                          src={social.icon}
                          alt={`${social.name} icon`}
                          style={{ width: '20px', height: '20px' }}
                        />
                      </Link>
                    </ListItem>
                  ))}
                </List>
             
            </Box>
          ) : (
            <Box>
              <img src={uthh} alt="UTHH Logo" style={{ maxWidth: '100px', marginBottom: '16px' }} />
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mb: 2 }}
              >
                © {new Date().getFullYear()} Universidad Tecnológica de la Huasteca Hidalguense. Todos los derechos reservados.
              </Typography>
              <List
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  p: 0,
                }}
              >
                {socialLinks.map((social, index) => (
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
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQs;