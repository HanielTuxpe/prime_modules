import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
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
        fontSize: '12px',
    },
    '& .rbc-header': {
        fontSize: '12px',
    },
    '& .rbc-event': {
        fontSize: '11px',
    },
    '& .rbc-label': {
        fontSize: '12px',
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
    let backgroundColor = '#2196F3'; // color por defecto

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
            color: 'white',
            borderRadius: '5px',
            padding: '4px',
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
    }, []);

    return (
        <Box
            sx={{
                height: 450,
                maxWidth: 600,
                color: "#000000"
            }}
        >
            <StyledCalendar
                localizer={localizer}
                events={eventos}
                messages={messages}
                views={["month"]}
                culture="es"
                style={{ fontSize: '0.9rem' }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={onSelectEvent}
                tooltipAccessor="title"
                allDayAccessor="allDay"
                step={1440}           // 1 paso = 1 día completo
                timeslots={1}         // solo una franja diaria
                showMultiDayTimes={false}
            />

        </Box>
    );
};

StudentCalendar.propTypes = {
    onSelectEvent: PropTypes.func.isRequired,
    matricula: PropTypes.string.isRequired,
};

export default StudentCalendar;
