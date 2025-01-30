import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'dayjs/locale/es';
import PropTypes from 'prop-types';

dayjs.locale('es'); // Configura dayjs en español
const localizer = dayjsLocalizer(dayjs);

const StyledCalendar = styled(Calendar)({
    '& .rbc-toolbar button, & .rbc-toolbar-label': {
        fontSize: '14px',
    },
    '& .rbc-header': {
        fontSize: '12px',
    },
    '& .rbc-event': {
        fontSize: '13px',
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

// Eventos programados
const events = [
    {
        title: 'Actividad 2: Etapas del ciclo de vida de seguridad',
        topic: 'Seguridad en el Desarrollo de Aplicaciones',
        description: `El/la estudiante elaborará un documento que contenga:
            - Las buenas prácticas y estándares en el desarrollo de aplicaciones seguras utilizando frameworks.
            - Mencionar los beneficios de la implementación del uso de registros en aplicaciones.
            - Mencionar los tipos de pruebas de seguridad de aplicaciones y las herramientas para su aplicación.`,
        start: new Date(2025, 0, 29, 23, 59),
        end: new Date(2025, 0, 29, 23, 59),
    },
    {
        title: 'Actividad 3: Buenas prácticas y estándares en el desarrollo',
        topic: 'Seguridad en el Desarrollo de Aplicaciones',
        description: `El/la estudiante elaborará un documento que contenga: \n
            - Las buenas prácticas y estándares en el desarrollo de aplicaciones seguras utilizando frameworks.\n
            - Mencionar los beneficios de la implementación del uso de registros en aplicaciones.\n
            - Mencionar los tipos de pruebas de seguridad de aplicaciones y las herramientas para su aplicación.`,
        start: new Date(2025, 0, 30, 23, 59),
        end: new Date(2025, 0, 30, 23, 59),
    },
    {
        title: 'Avance de proyecto',
        topic: 'Desarrollo Web Profesional',
        description: 'Desarrollo Web Profesional',
        start: new Date(2025, 0, 31, 23, 59),
        end: new Date(2025, 0, 31, 23, 59),
    },
    {
        title: 'Documentación del Proyecto',
        description: 'Administración de Bases de Datos',
        start: new Date(2025, 1, 1, 23, 59),
        end: new Date(2025, 1, 1, 23, 59),
    },
    {
        title: 'Tipos y niveles de pruebas ejecutadas',
        description: 'Evaluación de Software',
        start: new Date(2025, 1, 2, 23, 59),
        end: new Date(2025, 1, 2, 23, 59),
    },
];

const eventStyleGetter = (event) => {
    // Aquí puedes asignar colores según la materia
    let backgroundColor = '#3174ad'; // Default color

    // Corrección: usar event.topic en lugar de event.topi
    switch (event.topic) {
        case 'Seguridad en el Desarrollo de Aplicaciones':
            backgroundColor = '#4CAF50'; // Green
            break;
        case 'Desarrollo Web Profesional':
            backgroundColor = '#FF5722'; // Orange
            break;
        case 'Evaluación de Software':
            backgroundColor = '#9C27B0'; // Purple
            break;
        default:
            break;
    }
    return {
        style: {
            backgroundColor,
            color: 'white', // Color de texto
            borderRadius: '5px',
            padding: '5px',
        },
    };
};

const StudentCalendar = ({ onSelectEvent }) => (
    <Box
        sx={{
            height: 450,
            maxWidth: 600,
            color: "#000000"
        }}
    >
        <StyledCalendar
            localizer={localizer}
            events={events}
            messages={messages}
            views={["month", "week"]}
            startAccessor="start"
            endAccessor="end"
            culture="es"
            style={{ fontSize: '1rem' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={onSelectEvent} // Manejo de clic en eventos
        />
    </Box>
);

StudentCalendar.propTypes = {
    onSelectEvent: PropTypes.func.isRequired, // Debe ser una función
};

export default StudentCalendar;
