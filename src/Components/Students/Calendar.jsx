import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dayjsLocalizer(dayjs);

const StudentCalendar = () => (
    <Box>
        <Calendar
            localizer={localizer}
            events={[]} // Aquí van tus eventos
            views={["month", "week", "day"]}
            defaultView='week'
            style={{
                fontSize: '1rem', /* Tamaño de las fuentes */
            }}
        />
    </Box>
);

export default StudentCalendar;
