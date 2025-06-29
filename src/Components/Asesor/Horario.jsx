import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';

const HorarioDocente = () => {
  const [horario, setHorario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  const nombreDocente = 'Gadiel'; // Usar nombre exacto de la hoja
  const docenteCompleto = 'Ing. Gadiel Ramos Hernández';
  const URL_HORARIOS = 'http://localhost:3000/horarios';

  // Obtener el día actual de la semana
  useEffect(() => {
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    setCurrentDay(days[today]);
  }, []);

  useEffect(() => {
    const cargarHorario = async () => {
      try {
        const response = await fetch(URL_HORARIOS);
        if (!response.ok) throw new Error('Error al cargar el horario');
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        if (!workbook.SheetNames.includes(nombreDocente)) {
          throw new Error(`No existe hoja para el docente: ${nombreDocente}`);
        }

        const sheet = workbook.Sheets[nombreDocente];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Extraer PERIODO y CARRERA
        const metaPeriodo = data.find((row) => row[0]?.toString().toUpperCase().includes('PERIODO'));
        const metaCarrera = data.find((row) => row[0]?.toString().toUpperCase().includes('CARRERA'));

        if (metaPeriodo) setPeriodo(metaPeriodo[1] || '');
        if (metaCarrera) setCarrera(metaCarrera[1] || '');

        const esHoraValida = (valor) => {
          if (!valor) return false;
          const texto = valor.toString().trim();
          return /^[0-2]?[0-9]:[0-5][0-9]\s*-\s*[0-2]?[0-9]:[0-5][0-9]$/.test(texto);
        };

        const filas = data
          .filter((fila) => esHoraValida(fila[0]))
          .map((fila) => ({
            hora: fila[0],
            lunes: fila[1] || '',
            martes: fila[2] || '',
            miercoles: fila[3] || '',
            jueves: fila[4] || '',
            viernes: fila[5] || '',
          }));

        setHorario(filas);
      } catch (err) {
        console.error('Error:', err.message);
        setHorario([]);
      } finally {
        setLoading(false);
      }
    };

    cargarHorario();
  }, [nombreDocente]);

  // Variantes de animación para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" size={40} />
      </Box>
    );
  }

  const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  const displayDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Vieres'];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: 1000, margin: 'auto', padding: '16px' }}
    >
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          p: 3,
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}
        >
          Universidad Tecnológica de la Huasteca Hidalguense
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ color: '#424242', mb: 1 }}>
          Dirección de Tecnologías de la Información
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: '#a00037', fontWeight: 'medium', mb: 1 }}
        >
          Horario del Docente
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: '#616161' }}>
          Docente: {docenteCompleto}
        </Typography>
        {periodo && (
          <Typography variant="body2" align="center" sx={{ color: '#616161' }}>
            Período: {periodo}
          </Typography>
        )}
        {carrera && (
          <Typography variant="body2" align="center" sx={{ color: '#616161', mb: 2 }}>
            Carrera: {carrera}
          </Typography>
        )}
      </Box>

      {horario.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(90deg, #2e7d32 0%, #388e3c 100%)',
                }}
              >
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    py: 1.5,
                    px: 2,
                    textAlign: 'center',
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                    width: '15%',
                  }}
                >
                  Hora
                </TableCell>
                {displayDays.map((day, index) => (
                  <TableCell
                    key={day}
                    sx={{
                      color: days[index] === currentDay ? '#ffffff' : 'white',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      py: 1.5,
                      px: 2,
                      textAlign: 'center',
                      borderRight: '1px solid rgba(255,255,255,0.2)',
                      '&:last-child': { borderRight: 'none' },
                      backgroundColor: days[index] === currentDay ? '#490C28' : 'transparent', // Color vino para el día actual
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {horario.map((row, idx) => {
                const esReceso = row.lunes?.toString().toUpperCase().includes('RECESO');
                return (
                  <motion.tr
                    key={idx}
                    custom={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    sx={{
                      backgroundColor: esReceso
                        ? '#e8f5e9'
                        : idx % 2 === 0
                        ? '#f7faf7'
                        : '#ffffff',
                      '&:hover': {
                        backgroundColor: esReceso ? '#dcedc8' : '#f1f8e9',
                        transition: 'background-color 0.2s',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        py: 1,
                        px: 2,
                        textAlign: 'center',
                        borderRight: '1px solid #e0e0e0',
                        color: '#2e7d32',
                      }}
                    >
                      {row.hora}
                    </TableCell>
                    {esReceso ? (
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          py: 1,
                          color: '#388e3c',
                          fontStyle: 'italic',
                        }}
                      >
                        {row.lunes}
                      </TableCell>
                    ) : (
                      days.map((day) => (
                        <TableCell
                          key={day}
                          sx={{
                            fontSize: '0.8rem',
                            py: 1,
                            px: 1.5,
                            textAlign: 'center',
                            borderRight: '1px solid #e0e0e0',
                            '&:last-child': { borderRight: 'none' },
                            color: '#424242',
                            backgroundColor: day === currentDay ? '#490C281A' : 'transparent', // Fondo vino claro para celdas del día actual
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: (row[day] || '').replace(/\n/g, '<br />'),
                            }}
                          />
                        </TableCell>
                      ))
                    )}
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            color="error"
            align="center"
            sx={{ mt: 2, fontSize: '0.9rem', fontWeight: 'medium' }}
          >
            No se encontró horario para el docente: {nombreDocente}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HorarioDocente;