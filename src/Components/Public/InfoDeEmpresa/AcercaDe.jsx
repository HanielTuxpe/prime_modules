import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Link } from '@mui/material';
import { motion } from 'framer-motion';
import uthh from '../../../assets/uthh.png';
import FacebookIcon from '../../../assets/facebook.png';
import TwitterIcon from '../../../assets/twitter.png';
import InstagramIcon from '../../../assets/instagram.png';
import LinkedInIcon from '../../../assets/linkedin.png';
import WhatsAppIcon from '../../../assets/whatsapp.png';
import YouTubeIcon from '../../../assets/youtube.png';

const BaseURL = import.meta.env.VITE_URL_BASE_API;

const About = () => {
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
        <motion.div
          variants={titleVariants}
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
            }}
          >
            {/* Título principal y logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <img
                src={uthh}
                alt="UTHH12 Logo"
                style={{ maxWidth: '150px', marginBottom: '16px' }}
              />
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
                Universidad Tecnológica de la Huasteca Hidalguense
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
              La Universidad Tecnológica de la Huasteca Hidalguense es una institución educativa de prestigio que se destaca por su enfoque integral en la formación académica y su compromiso con la investigación de vanguardia. A lo largo de los años, ha establecido programas de formación en diversas áreas, brindando a los estudiantes las herramientas necesarias para enfrentar los desafíos globales con un enfoque ético y profesional.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ mt: 4 }}>
          {/* Misión */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible">
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                p: 4,
                mb: 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Typography variant="h5" sx={{ color: '#921F45', fontWeight: 'medium', mb: 2 }}>
                Misión
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Formar profesionales competentes, con una sólida formación académica, habilidades interpersonales y un fuerte compromiso con la innovación, la ética y el desarrollo social. La universidad promueve la educación superior de calidad, la investigación aplicada y la interacción con la sociedad para generar soluciones a los problemas globales.
              </Typography>
            </Box>
          </motion.div>

          {/* Visión */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible">
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                p: 4,
                mb: 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Typography variant="h5" sx={{ color: '#921F45', fontWeight: 'medium', mb: 2 }}>
                Visión
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Ser reconocida internacionalmente por su excelencia educativa, su capacidad de innovación en investigación y el impacto positivo de sus egresados en la sociedad. La universidad se proyecta como un referente global en la educación superior de alto rendimiento, contribuyendo a la formación de líderes comprometidos con el desarrollo sostenible.
              </Typography>
            </Box>
          </motion.div>

          {/* Objetivo */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible">
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                p: 4,
                mb: 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Typography variant="h5" sx={{ color: '#921F45', fontWeight: 'medium', mb: 2 }}>
                Objetivo
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                El objetivo principal de la universidad es formar profesionales altamente capacitados en diversas disciplinas, con habilidades que les permitan generar cambios significativos en sus respectivas áreas de trabajo. Además, busca fomentar una cultura de investigación avanzada y colaboración interinstitucional que impulse el progreso académico, científico y social.
              </Typography>
            </Box>
          </motion.div>

          {/* Dirección */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible">
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                p: 4,
                mb: 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Typography variant="h5" sx={{ color: '#921F45', fontWeight: 'medium', mb: 2 }}>
                Dirección
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Carretera Huejutla - Chalahuiyapa S/N, C.P. 43000, Huejutla de Reyes, Hidalgo, México
              </Typography>
            </Box>
          </motion.div>

        </Box>

        {/* Footer */}
       <Divider sx={{ mb: 4, borderColor: '#921F45' }} />
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
                  <ListItemText primary={social.name} sx={{ '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.9rem' } }} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default About;