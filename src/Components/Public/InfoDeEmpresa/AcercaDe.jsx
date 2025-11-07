import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Link, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
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

const About = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <img src={uthh} alt="UTHH Logo" style={{ maxWidth: '150px', marginBottom: '16px' }} />
              <Typography variant="h3" sx={{ color: '#921F45', fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '2rem', md: '3rem' } }}>
                Universidad Tecnológica de la Huasteca Hidalguense
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, textAlign: 'center', maxWidth: '800px', mx: 'auto', fontSize: { xs: '1rem', md: '1.1rem' } }}>
              La Universidad Tecnológica de la Huasteca Hidalguense es una institución educativa que destaca por su compromiso con la formación de profesionales altamente capacitados, impulsando el desarrollo tecnológico, científico y social dentro de la región Huasteca y a nivel nacional.
            </Typography>
          </Box>
        </motion.div>

        {/* Footer */}
        <Divider sx={{ mb: 4, borderColor: '#921F45' }} />

        <Box sx={{ textAlign: 'center', mb: 4, color: 'white', p: 2, boxShadow: theme.custom?.boxShadow }}>
          {isSmallScreen ? (
            <Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <img src={uthh} alt="UTHH Logo" style={{ maxWidth: '100px', marginBottom: '16px' }} />
                <Typography variant="body2" sx={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)', fontWeight: 400 }}>
                  © {new Date().getFullYear()} Todos los derechos reservados.
                </Typography>
              </Box>

              <List sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', p: 0, mt: 1 }}>
                {socialLinks.map((social, index) => (
                  <ListItem key={index} sx={{ width: 'auto', px: 1 }}>
                    <Link href={social.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary', '&:hover': { color: '#921F45' } }}>
                      <img src={social.icon} alt={`${social.name} icon`} style={{ width: '20px', height: '20px' }} />
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Box>
              <img src={uthh} alt="UTHH Logo" style={{ maxWidth: '100px', marginBottom: '16px' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                © {new Date().getFullYear()} Universidad Tecnológica de la Huasteca Hidalguense. Todos los derechos reservados.
              </Typography>
              <List sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', p: 0 }}>
                {socialLinks.map((social, index) => (
                  <ListItem key={index} sx={{ width: 'auto', display: 'inline-flex', listStyleType: 'none', px: 1, '&:before': { content: '"➤"', color: 'text.secondary', fontSize: '1.2rem', mr: 1 } }}>
                    <Link href={social.url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      <img src={social.icon} alt={`${social.name} icon`} style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                      <ListItemText primary={social.name} sx={{ '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '0.9rem' } }} />
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

export default About;
