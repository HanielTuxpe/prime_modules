import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';

const BaseURL = import.meta.env.VITE_URL_BASE_API;

dayjs.locale('es');
dayjs.extend(utc);

const localizer = dayjsLocalizer(dayjs);

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
  '& .rbc-event': {
    fontSize: 'clamp(10px, 2vw, 12px)',
    fontWeight: 500,
  },
  '& .rbc-label': {
    fontSize: 'clamp(10px, 2vw, 12px)',
    color: '#000000',
  },
  '& .rbc-month-view': {
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
  },
  '& .rbc-today': {
    backgroundColor: '#FFE4E6',
  },
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
  showMore: (total) => `+ Ver más (${total})`,
};

const eventStyleGetter = (event) => {
  let backgroundColor = '#921F45';

  switch (event.topic?.toUpperCase()) {
    case 'SEGURIDAD EN EL DESARROLLO DE APLICACIONES':
      backgroundColor = '#4CAF50';
      break;
    case 'DESARROLLO WEB PROFESIONAL':
      backgroundColor = '#FF5722';
      break;
    case 'INGLÉS VII':
      backgroundColor = '#3F51B5';
      break;
    case 'MATEMÁTICAS PARA INGENIERÍA II':
      backgroundColor = '#795548';
      break;
    case 'PLANEACIÓN Y ORGANIZACIÓN DEL TRABAJO':
      backgroundColor = '#009688';
      break;
    case 'ADMINISTRACIÓN DE BASE DE DATOS':
      backgroundColor = '#9C27B0';
      break;
    default:
      break;
  }

  return {
    style: {
      backgroundColor,
      color: '#FFFFFF',
      borderRadius: '5px',
      padding: '2px',
      fontSize: 'clamp(10px, 2vw, 12px)',
      fontWeight: 500,
    },
  };
};

const StudentCalendar = ({ onSelectEvent, matricula }) => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        const response = await axios.get(BaseURL + 'actividadesXAlumno', { params: { Matricula: matricula } });

        const actividades = response.data.data;

        const actividadesTransformadas = actividades.map((actividad) => {
          const fecha = dayjs.utc(actividad.FechaEntrega);
          const hora = dayjs.utc(actividad.HoraEntrega);

          const fechaEntrega = fecha.set('hour', hora.hour()).set('minute', hora.minute()).add(6, 'hour');

          return {
            title: actividad.Titulo,
            description: actividad.Descripcion,
            topic: actividad.NomMateria,
            start: fechaEntrega.toDate(),
            end: fechaEntrega.toDate(),
            allDay: true,
          };
        });

        setEventos(actividadesTransformadas);
      } catch (error) {
        console.error('Error al obtener actividades del alumno:', error);
      }
    };

    obtenerActividades();
  }, [matricula]);

  useEffect(() => {
    const actividadesEstaticas = [
      {
        title: 'Entrega de Proyecto',
        description: 'Proyecto final de Desarrollo Web Profesional',
        topic: 'DESARROLLO WEB PROFESIONAL',
        start: new Date(2025, 2, 12),
        end: new Date(2025, 2, 12),
        allDay: true,
      },
      {
        title: 'Examen de Seguridad',
        description: 'Examen parcial de Seguridad en el Desarrollo de Aplicaciones',
        topic: 'SEGURIDAD EN EL DESARROLLO DE APLICACIONES',
        start: new Date(2025, 2, 13),
        end: new Date(2025, 2, 13),
        allDay: true,
      },
      {
        title: 'Clase especial de Inglés',
        description: 'Clase con práctica oral intensiva',
        topic: 'INGLÉS VII',
        start: new Date(2025, 2, 14),
        end: new Date(2025, 2, 14),
        allDay: true,
      },
    ];

    setEventos(actividadesEstaticas);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        padding: { xs: '16px 8px', sm: '32px 16px' }, // Padding moderado desde arriba
        paddingTop: { xs: '60px', sm: '80px' }, // Espacio controlado desde el inicio de la página
        boxSizing: 'border-box',
        backgroundColor: 'transparent', // Sin fondo que ocupe toda la pantalla
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: '100%', sm: 600 }, // 100% en móviles para aprovechar todo el ancho
          width: '100%',
          margin: '0 auto', // Centrado horizontal
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
        <Box
          sx={{
            width: '100%',
            height: { xs: '280px', sm: '400px' }, // Altura más compacta en móviles
            minHeight: { xs: '280px', sm: '400px' },
          }}
        >
          <StyledCalendar
            localizer={localizer}
            events={eventos}
            messages={messages}
            views={['month']}
            culture="es"
            defaultDate={new Date()}
            style={{ fontSize: '0.9rem' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={onSelectEvent}
            tooltipAccessor="title"
            allDayAccessor="allDay"
            step={1440}
            timeslots={1}
            showMultiDayTimes={false}
          />
        </Box>
      </Box>
    </Box>
  );
};

StudentCalendar.propTypes = {
  onSelectEvent: PropTypes.func.isRequired,
  matricula: PropTypes.string.isRequired,
};

export default StudentCalendar;