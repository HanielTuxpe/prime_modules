import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Link,
} from '@mui/material';
import { styled } from '@mui/system';

// Import PNG icons
import FacebookIcon from '../../../assets/facebook.png';
import TwitterIcon from '../../../assets/twitter.png';
import InstagramIcon from '../../../assets/instagram.png';
import LinkedInIcon from '../../../assets/linkedin.png';
import WhatsAppIcon from '../../../assets/whatsapp.png';
import YouTubeIcon from '../../../assets/youtube.png';

const colors = {
  primary: '#921F45',
  secondary: '#914F65',
  accent: '#BC955B',
  white: '#FFFFFF',
  lightBlue: '#E1EDFF',
  black: '#000000',
};

// Styles for the ProfileCard
const ProfileCard = styled(Card)(({ theme }) => ({

  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.4)',
  },
}));

// Icon mapping for social media links (using images)
const iconMapping = {
  facebook: <img src={FacebookIcon} alt="Facebook" style={{ width: 24, height: 24 }} />,
  twitter: <img src={TwitterIcon} alt="Twitter" style={{ width: 24, height: 24 }} />,
  instagram: <img src={InstagramIcon} alt="Instagram" style={{ width: 24, height: 24 }} />,
  linkedin: <img src={LinkedInIcon} alt="LinkedIn" style={{ width: 24, height: 24 }} />,
  whatsapp: <img src={WhatsAppIcon} alt="WhatsApp" style={{ width: 24, height: 24 }} />,
  youtube: <img src={YouTubeIcon} alt="YouTube" style={{ width: 24, height: 24 }} />,
};

const Profile = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [imagen, setImagen] = useState('');
  const [redesSociales, setRedesSociales] = useState([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch('https://prj-server.onrender.com/InformacionEmpresa');
        const data = await response.json();

        if (data.length > 0) {
          const companyInfo = data[0];
          setNombreEmpresa(companyInfo.nombreEmpresa);
          setDescripcion(companyInfo.descripcion);
          setMision(companyInfo.mision);
          setVision(companyInfo.vision);
          setObjetivo(companyInfo.objetivo);
          setDireccion(companyInfo.direccion);
          setImagen(companyInfo.imagen);
          setRedesSociales(companyInfo.redesSociales || []);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, []);

  if (!nombreEmpresa) {
    return <Typography variant="h6" color={colors.black}>Cargando...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <ProfileCard >
            <Typography variant="h4"
              sx={{
                marginTop: '2px',
                marginBottom: '15px',
                textAlign: 'center',
                overflowWrap: 'break-word', // Ajusta palabras largas
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap', // Preserva los saltos de línea
              }}
            >
              {nombreEmpresa}
            </Typography>

            <CardMedia
              component="img"
              image={imagen}
              alt={`${nombreEmpresa} logo`}
              sx={{
                height: 200,
                objectFit: 'contain',
               
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))', // Filtro de sombra más natural
               // Opcional: redondea bordes
              }}
            />
            <CardContent>

              <Typography variant="body2" 
                sx={{
                  marginBottom: '15px',
                  textAlign: 'center',
                  overflowWrap: 'break-word', // Ajusta palabras largas
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap', // Preserva los saltos de línea
                }}
              >
                {descripcion}
              </Typography>

              <Typography variant="h6" >
                Misión
              </Typography>
              <Typography variant="body2"
                sx={{
                  marginTop: '2px',
                  marginBottom: '15px',
                  overflowWrap: 'break-word', // Ajusta palabras largas
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap', // Preserva los saltos de línea
                }}
              >
                {mision}
              </Typography>
              <Typography variant="h6" >
                Visión
              </Typography>
              <Typography variant="body2" 
                sx={{
                  marginTop: '2px',
                  marginBottom: '15px',
                  overflowWrap: 'break-word', // Ajusta palabras largas
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap', // Preserva los saltos de línea
                }}
              >
                {vision}
              </Typography>
              <Typography variant="h6" >
                Objetivo
              </Typography>
              <Typography variant="body2"
                sx={{
                  marginTop: '2px',
                  marginBottom: '15px',
                  overflowWrap: 'break-word', // Ajusta palabras largas
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap', // Preserva los saltos de línea
                }}
              >
                {objetivo}
              </Typography>
              <Typography variant="h6" >
                Dirección
              </Typography>
              <Typography variant="body2" 
                sx={{
                  marginTop: '2px',
                  marginBottom: '15px',
                  overflowWrap: 'break-word', // Ajusta palabras largas
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap', // Preserva los saltos de línea
                }}
              >
                {direccion}
              </Typography>
              <Box mt={2}>
                <Typography variant="h6"  sx={{  textAlign: 'center'}}>
                  Redes Sociales
                </Typography>
                <Box display="flex" flexWrap="wrap" mt={1}>
                  {Array.isArray(redesSociales) && redesSociales.length > 0 ? (
                    redesSociales.map((red, index) => (
                      <Link
                        href={red.link}
                        target="_blank"
                        rel="noopener"
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: 2,
                          marginTop: '15px',
                          textDecoration: 'none',
                          '&:hover': {
                            color: colors.primary, // Change color on hover
                          },
                        }}
                      >
                        {iconMapping[red.nombre.toLowerCase()] || <span>{red.nombre}</span>}
                        <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
                          {red.nombre}
                        </Typography>
                      </Link>
                    ))
                  ) : (
                    <Typography variant="body2" >
                      No hay redes sociales disponibles.
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </ProfileCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
