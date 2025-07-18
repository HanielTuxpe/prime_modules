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

dayjs.locale('es');
dayjs.extend(utc);

const localizer = dayjsLocalizer(dayjs);

const StyledCalendar = styled(Calendar)({
    '& .rbc-toolbar button, & .rbc-toolbar-label': {
        fontSize: '14px',
        color: '#000000',
        fontWeight: 500,
    },
    '& .rbc-header': {
        fontSize: '14px',
        color: '#000000',
        fontWeight: 600,
        padding: '8px',
    },
    '& .rbc-event': {
        fontSize: '12px',
        fontWeight: 500,
    },
    '& .rbc-label': {
        fontSize: '12px',
        color: '#000000',
    },
    '& .rbc-month-view': {
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
    },
    '& .rbc-today': {
        backgroundColor: '#FFE4E6', // Fondo suave para el día actual
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
    let backgroundColor = '#921F45'; // Color principal

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
            padding: '4px',
            fontSize: '12px',
            fontWeight: 500,
        },
    };
};

const StudentCalendar = ({ onSelectEvent, matricula }) => {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        const obtenerActividades = async () => {
            try {
                const response = await axios.get('http://localhost:3000/actividadesXAlumno', { params: { Matricula: matricula } });

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

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center', // Centra horizontalmente
                alignItems: 'center', // Centra verticalmente
                minHeight: '100vh', // Ocupa toda la altura de la ventana
                width: '100%', // Asegura que ocupe todo el ancho disponible
                padding: 2,
                boxSizing: 'border-box', // Evita desbordamientos por padding
            }}
        >
            <Box
                sx={{
                    maxWidth: 700, // Aumenta ligeramente el ancho para mejor legibilidad
                    width: '100%', // Ocupa todo el ancho disponible hasta el máximo
                    backgroundColor: '#FFFFFF', // Fondo blanco para el calendario
                    borderRadius: 3, // Bordes redondeados más pronunciados
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Sombra más definida
                    overflow: 'hidden', // Evita desbordamientos
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        color: '#921F45', // Color principal para el título
                        fontWeight: 700,
                        marginBottom: 2,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}
                >
                    Calendario de Actividades
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        height: 550, // Aumenta la altura para mejor visualización
                    }}
                >
                    <StyledCalendar
                        localizer={localizer}
                        events={eventos}
                        messages={messages}
                        views={['month']}
                        culture="es"
                        defaultDate={new Date(2025, 2, 10)} // Fecha inicial: 10 de marzo de 2025
                        style={{ fontSize: '0.9rem' }}
                        eventPropGetter={eventStyleGetter}
                        onSelectEvent={onSelectEvent}
                        tooltipAccessor="title"
                        allDayAccessor="allDay"
                        step={1440} // 1 paso = 1 día completo
                        timeslots={1} // Solo una franja diaria
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