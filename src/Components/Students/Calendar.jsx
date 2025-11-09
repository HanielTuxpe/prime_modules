import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Box, Typography, Modal, Paper, IconButton, Chip, useMediaQuery } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import { obtenerMatricula } from '../Access/SessionService';

const BaseURL = import.meta.env.VITE_URL_BASE_API;

dayjs.locale('es');
dayjs.extend(utc);

const localizer = dayjsLocalizer(dayjs);

const COLORES_DISPONIBLES = [
  '#921F45', '#4CAF50', '#FF5722', '#3F51B5', '#795548',
  '#009688', '#9C27B0', '#FF9800', '#2196F3', '#E91E63',
  '#607D8B', '#CDDC39', '#00BCD4', '#FFC107', '#8BC34A'
];

const StyledCalendar = styled(Calendar)({
  '& .rbc-toolbar button, & .rbc-toolbar-label': {
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    color: '#000000',
    fontWeight: 500,
  },
  '& .rbc-header': {
    fontSize: 'clamp(12px, 2vw, 14px)',
    color: '#000000',
    fontWeight: 600,
    padding: '4px',
  },
  '& .rbc-date-cell': {
    color: '#000000 !important',
    fontWeight: 600,
    textAlign: 'right',
    padding: '4px 8px 0 0',
    fontSize: '13px',
  },
  '& .rbc-off-range .rbc-date-cell': { color: '#ccc !important' },
  '& .rbc-current .rbc-date-cell': {
    color: '#d32f2f !important',
    fontWeight: 700,
    fontSize: '14px',
  },
  '& .rbc-event': {
    fontSize: '0',
    padding: '0',
    width: '14px',
    height: '14px',
    minWidth: '14px',
    minHeight: '14px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    margin: '0 3px',
    display: 'inline-block',
  },
  '& .rbc-event-content': { display: 'none' },
  '& .rbc-day-slot .rbc-events-container': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    maxWidth: '100%',
    padding: '2px 0',
  },
  '& .rbc-month-view': { borderRadius: '8px', backgroundColor: '#FFFFFF' },
  '& .rbc-today': { backgroundColor: '#FFE4E6' },
  '& .rbc-show-more': { color: '#921F45', fontSize: '10px', fontWeight: 600 },
});

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  showMore: (total) => `+${total} más`,
};

const StudentCalendar = ({ onSelectEvent }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [coloresAsignados, setColoresAsignados] = useState({});
  const matricula = obtenerMatricula();

  // Detectar móvil
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const obtenerActividades = async () => {
      if (!matricula) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BaseURL}actividadesXAlumno`, {
          params: { Matricula: matricula, Mes: 3 },
        });

        const actividades = response.data.data || [];
        const añoActual = new Date().getFullYear();

        const materiasUnicas = [...new Set(actividades.map(a => a.NomMateria))];
        const nuevosColores = {};
        materiasUnicas.forEach((materia, i) => {
          nuevosColores[materia] = COLORES_DISPONIBLES[i % COLORES_DISPONIBLES.length];
        });
        setColoresAsignados(nuevosColores);

        const eventosTransformados = actividades.map((act) => {
          const fechaOriginal = dayjs.utc(act.FechaEntrega);
          const fechaCorrecta = fechaOriginal.year(añoActual);
          const fechaLocal = fechaCorrecta.local().startOf('day');

          return {
            id: act.IdActividad,
            title: `${act.NomMateria} (${act.Puntaje} pts)`,
            description: act.Descripcion,
            topic: act.NomMateria,
            puntaje: act.Puntaje,
            fechaEntrega: fechaLocal.format('YYYY-MM-DD'),
            start: fechaLocal.toDate(),
            end: fechaLocal.toDate(),
            allDay: true,
          };
        });

        setEventos(eventosTransformados);
      } catch (error) {
        console.error('ERROR:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerActividades();
  }, [matricula]);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: coloresAsignados[event.topic] || '#921F45',
        borderRadius: '50%',
        width: '14px',
        height: '14px',
        minWidth: '14px',
        minHeight: '14px',
        margin: '0 3px',
        display: 'inline-block',
        border: '2px solid white',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
      },
    };
  };

  const handleSelectEvent = (event) => {
    const fecha = dayjs(event.start).format('YYYY-MM-DD');
    const eventosDelDia = eventos.filter(e => dayjs(e.start).format('YYYY-MM-DD') === fecha);
    
    const porMateria = {};
    eventosDelDia.forEach(ev => {
      if (!porMateria[ev.topic]) porMateria[ev.topic] = [];
      porMateria[ev.topic].push(ev);
    });

    const materias = Object.keys(porMateria);
    setSelectedDayEvents(materias.map(m => ({
      materia: m,
      actividades: porMateria[m]
    })));
    setSelectedTab(0);
    setOpen(true);
    if (onSelectEvent) onSelectEvent(event);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDayEvents([]);
    setSelectedTab(0);
  };

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          padding: { xs: '16px 8px', sm: '32px 16px' },
          paddingTop: { xs: '60px', sm: '80px' },
          boxSizing: 'border-box',
          backgroundColor: 'transparent',
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', sm: 600 },
            width: '100%',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: { xs: '12px', sm: '20px' },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#921F45',
              fontWeight: 700,
              marginBottom: { xs: 1, sm: 2 },
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: { xs: '1.1rem', sm: '1.5rem' },
              width: '100%',
            }}
          >
            Calendario de Actividades
          </Typography>

          {loading ? (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Cargando...</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: { xs: '280px', sm: '400px' },
                minHeight: { xs: '280px', sm: '400px' },
              }}
            >
              <StyledCalendar
                localizer={localizer}
                events={eventos}
                messages={messages}
                views={['month']}
                culture="es"
                defaultDate={new Date(2025, 10, 1)}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                tooltipAccessor="title"
                allDayAccessor="allDay"
                step={1440}
                timeslots={1}
                showMultiDayTimes={false}
                style={{ height: '100%', fontSize: '0.9rem' }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* MODAL ULTRA RESPONSIVE */}
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            width: { xs: '96%', sm: '90%', md: '80%' },
            maxWidth: 700,
            maxHeight: '88vh',
            overflow: 'auto',
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            backgroundColor: '#fdfbff',
            border: '1px solid #f0e6f0',
            position: 'relative',
            mx: { xs: 1, sm: 2 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* BOTÓN CERRAR */}
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              color: '#921F45',
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#f8f8f8' },
              width: 40,
              height: 40,
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedDayEvents.length > 0 && (
            <>
              {/* TÍTULO */}
              <Typography 
                variant="h5" 
                fontWeight={700} 
                color="#921F45" 
                textAlign="center"
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  mb: 3,
                  mt: { xs: 5, sm: 0 }
                }}
              >
                {dayjs(selectedDayEvents[0].actividades[0].start).format('dddd, D [de] MMMM [de] YYYY')}
              </Typography>

              {/* PESTAÑAS */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 1.5 : 0,
                mb: 3,
                borderBottom: isMobile ? 'none' : '1px solid #e0e0e0',
              }}>
                {selectedDayEvents.map((item, index) => (
                  <Box
                    key={index}
                    onClick={() => handleTabChange(index)}
                    sx={{
                      flex: 1,
                      bgcolor: selectedTab === index ? coloresAsignados[item.materia] : '#f9f5f9',
                      color: selectedTab === index ? 'white' : '#921F45',
                      fontWeight: 600,
                      textAlign: 'center',
                      py: { xs: 2, sm: 1.8 },
                      px: 2,
                      borderRadius: isMobile ? 2 : 0,
                      borderBottom: isMobile ? 'none' : `4px solid ${selectedTab === index ? coloresAsignados[item.materia] : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      minHeight: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isMobile && selectedTab === index ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      '&:hover': {
                        bgcolor: selectedTab === index ? coloresAsignados[item.materia] : '#f0e8f0',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {item.materia}
                  </Box>
                ))}
              </Box>

              {/* CONTENIDO DE LA PESTAÑA */}
              <Box sx={{ mt: 1 }}>
                {selectedDayEvents[selectedTab].actividades.map((act, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      mb: 3.5, 
                      p: { xs: 2.5, sm: 3 }, 
                      backgroundColor: 'white', 
                      borderRadius: 2.5, 
                      border: `1px solid ${coloresAsignados[act.topic] || '#921F45'}30`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      color="#921F45"
                      sx={{ fontSize: { xs: '1.05rem', sm: '1.15rem' }, mb: 1 }}
                    >
                      {act.topic}
                    </Typography>

                    <Chip
                      label={`${act.puntaje} puntos`}
                      size="medium"
                      sx={{
                        backgroundColor: coloresAsignados[act.topic] || '#921F45',
                        color: 'white',
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        height: 32,
                      }}
                    />

                    <Typography 
                      variant="body1" 
                      color="text.primary" 
                      paragraph
                      sx={{ 
                        fontSize: { xs: '0.92rem', sm: '1rem' },
                        lineHeight: 1.7,
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {act.description}
                    </Typography>

                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}
                    >
                      <strong>ID:</strong> {act.id}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>
      </Modal>
    </>
  );
};

StudentCalendar.propTypes = {
  onSelectEvent: PropTypes.func,
};

export default StudentCalendar;