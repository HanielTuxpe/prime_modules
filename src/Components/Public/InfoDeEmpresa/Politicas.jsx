import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider, Link, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
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

const PrivacyPolicy = () => {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // detectar offline / online
  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // GET excel
  useEffect(() => {
    const localData = localStorage.getItem("politicas");
    if (localData) {
      setPoliticas(JSON.parse(localData));
      setLoading(false);
    }

    const fetchPoliticas = async () => {
      if (!navigator.onLine) return; // evita error sin internet

      try {
        const baseUrl = import.meta.env.VITE_URL_BASE_API || '';
        const response = await fetch(`${baseUrl}Politicas`);
        if (!response.ok) throw new Error(`Error al cargar archivo`);

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets['Hoja1'];
        if (!sheet) throw new Error('No se encontró Hoja1');

        const data = XLSX.utils.sheet_to_json(sheet, {
          header: ['Seccion', 'TipoElemento', 'Contenido'],
          range: 1,
        });

        const secciones = data.reduce((acc, row) => {
          const id = row.Seccion;
          if (!acc[id]) acc[id] = [];
          acc[id].push({
            tipoElemento: row.TipoElemento.trim().toLowerCase(),
            contenido: row.Contenido,
          });
          return acc;
        }, {});

        const ordenadas = Object.keys(secciones)
          .map((id) => ({ id: parseInt(id), elementos: secciones[id] }))
          .sort((a, b) => a.id - b.id);

        setPoliticas(ordenadas);
        localStorage.setItem("politicas", JSON.stringify(ordenadas));
        setLoading(false);
      } catch (err) {
        if (!localData) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchPoliticas();
  }, []);

  if (loading) return <Box sx={{ textAlign:'center', py:6 }}><Typography>Cargando políticas...</Typography></Box>;
  if (error) return <Box sx={{ textAlign:'center', py:6 }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ minHeight:'100vh', bgcolor:'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)', py:{ xs:6, md:10 }, px:{ xs:2, sm:4 } }}>
      
      {/* mensaje offline */}
      {offline && (
        <Box sx={{ bgcolor:"#921F45", color:"#fff", py:2, mb:3, textAlign:"center", borderRadius:2 }}>
          Estás sin conexión. Mostrando contenido guardado en caché.
        </Box>
      )}

      <Container maxWidth="lg">
        
        {politicas.map((seccion, index) => (
          <motion.div key={seccion.id} variants={index === 0 ? titleVariants : sectionVariants} initial="hidden" animate="visible">
            <Box sx={{ bgcolor:'white', borderRadius:3, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', p:{ xs:4, md:8 }, position:'relative', overflow:'hidden',
              '&:before':{ content:'""', position:'absolute', top:0, left:0, width:'100%', height:'4px', bgcolor:'#921F45' },
              transition:'0.3s', '&:hover':{ transform:'translateY(-4px)', boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }, mt:index===0?0:4 }}>
              
              {seccion.elementos.map((el,idx)=>{

                if(el.tipoElemento==='título'||el.tipoElemento==='subtitulo')
                  return <Typography key={idx} variant={index===0?'h3':'h5'} sx={{color:'#921F45', fontWeight:index===0?'bold':'medium', mb:4, textAlign:index===0?'center':'left'}}>{el.contenido}</Typography>
                
                if(el.tipoElemento==='parrafo')
                  return <Typography key={idx} sx={{mb:2, color:'text.secondary'}}>{el.contenido}</Typography>

                if(el.tipoElemento==='item')
                  return (
                    <List key={idx} sx={{ pl:2 }}>
                      <ListItem sx={{ display:'list-item', listStyle:'none', pl:4, position:'relative', '&:before':{content:'"➤"', position:'absolute', left:0,color:'text.secondary'}}}>
                        <ListItemText primary={el.contenido}/>
                      </ListItem>
                    </List>
                  );
                return null
              })}
            </Box>
          </motion.div>
        ))}

        <Divider sx={{ my:4, borderColor:'#921F45' }}/>

        <Box sx={{ textAlign:'center', color:'white', p:2 }}>
          <img src={uthh} alt="UTHH" style={{ width:100, marginBottom:16 }}/>
          <Typography variant="body2" sx={{color:'text.secondary', mb:2}}>© {new Date().getFullYear()} UTHH. Todos los derechos reservados.</Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
