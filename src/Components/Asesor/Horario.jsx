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
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { obtenerMatricula } from '../Access/SessionService';

const CLV_DOCENTE = obtenerMatricula(); // ID del docente
const BaseURL = import.meta.env.VITE_URL_BASE_API;
const URL_DOCENTE = `${BaseURL}DatosDocente/?ClvDocente=${CLV_DOCENTE}`;
const URL_HORARIOS = `${BaseURL}horarios`;

const HorarioDocente = () => {
  const [horario, setHorario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [error, setError] = useState(null);
  const [nombreDocente, setNombreDocente] = useState('');
  const [docenteCompleto, setDocenteCompleto] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // 🔌 Detectar conexión/desconexión en tiempo real
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Obtener el día actual de la semana
  useEffect(() => {
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = new Date().getDay();
    setCurrentDay(days[today]);
  }, []);

  // Obtener datos del docente
  useEffect(() => {
    const fetchDocenteData = async () => {
      try {
        if (!isOffline) {
          const response = await fetch(URL_DOCENTE);
          if (!response.ok) {
            throw new Error(`Error al obtener datos del docente: ${response.statusText}`);
          }
          const result = await response.json();
          const docenteData = result.data[0];
          if (!docenteData) {
            throw new Error('No se encontraron datos para el docente');
          }
          // Extraer solo el nombre sin el prefijo (Ing., Mtro., etc.)
          const nombreCorto = docenteData.Nombre.split(' ')
            .join(' ')
            .split(' ')[0]; // Tomar solo el primer nombre
          setNombreDocente(nombreCorto); // Ejemplo: 'Gadiel'
          setDocenteCompleto(`${docenteData.Nombre}`); // Ejemplo: 'Ing. Gadiel Ramos Hernández'
          // Guardar en localStorage
          localStorage.setItem('docenteData', JSON.stringify({
            nombreDocente: nombreCorto,
            docenteCompleto: docenteData.Nombre,
          }));
        } else {
          console.warn('⚠️ Sin conexión, cargando datos del docente guardados...');
          const localData = localStorage.getItem('docenteData');
          if (localData) {
            const { nombreDocente, docenteCompleto } = JSON.parse(localData);
            setNombreDocente(nombreDocente);
            setDocenteCompleto(docenteCompleto);
          } else {
            setError('No hay datos disponibles offline. Conéctate para cargar el horario.');
          }
        }
      } catch (err) {
        console.error('Error al obtener datos del docente:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocenteData();
  }, [isOffline]);

  // Cargar horario una vez que se tenga el nombre del docente
  useEffect(() => {
    if (!nombreDocente) return; // Esperar a que nombreDocente esté disponible

    const cargarHorario = async () => {
      try {
        if (!isOffline) {
          const response = await fetch(URL_HORARIOS);
          if (!response.ok) {
            throw new Error(`Error al cargar el horario: ${response.statusText}`);
          }
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          console.log('Nombres de las hojas en el Excel:', workbook.SheetNames);

          if (!workbook.SheetNames.includes(nombreDocente)) {
            throw new Error(`No existe hoja para el docente: ${nombreDocente}`);
          }

          const sheet = workbook.Sheets[nombreDocente];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          console.log('Datos crudos de la hoja:', data);

          // Extraer PERIODO y CARRERA
          const metaPeriodo = data.find((row) => row[0]?.toString().toUpperCase().includes('PERIODO'));
          const metaCarrera = data.find((row) => row[0]?.toString().toUpperCase().includes('CARRERA'));

          const periodoValue = metaPeriodo ? metaPeriodo[1] || '' : '';
          const carreraValue = metaCarrera ? metaCarrera[1] || '' : '';
          setPeriodo(periodoValue);
          setCarrera(carreraValue);

          // Guardar periodo y carrera en localStorage
          localStorage.setItem('periodoData', JSON.stringify(periodoValue));
          localStorage.setItem('carreraData', JSON.stringify(carreraValue));

          const esHoraValida = (valor) => {
            if (!valor) return false;
            const texto = valor.toString().trim();
            return /^[0-2]?[0-9]:[0-5][0-9]\s*-\s*[0-2]?[0-9]:[0-5][0-9]$/.test(texto);
          };

          // Convertir hora inicial y final a minutos para comparación
          const timeToMinutes = (timeStr, isEnd = false) => {
            if (!timeStr || !esHoraValida(timeStr)) return isEnd ? -Infinity : Infinity;
            const time = timeStr.split('-').map((t) => t.trim())[isEnd ? 1 : 0];
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
          };

          // Filtrar filas con horas válidas
          let filas = data
            .filter((fila) => esHoraValida(fila[0]))
            .map((fila) => ({
              hora: fila[0],
              lunes: fila[1] || '',
              martes: fila[2] || '',
              miercoles: fila[3] || '',
              jueves: fila[4] || '',
              viernes: fila[5] || '',
            }));

          console.log('Filas con horas válidas:', filas);

          // Filtrar filas con al menos una clase (excluyendo RECESO)
          const filasConClases = filas.filter((fila) => {
            return ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].some(
              (day) =>
                fila[day] &&
                !/R\s*E\s*C\s*E\s*S\s*O|Receso/i.test(fila[day].toString())
            );
          });

          console.log('Filas con clases (sin RECESO):', filasConClases);

          if (filasConClases.length === 0) {
            throw new Error('No se encontraron clases para el docente');
          }

          // Encontrar la hora más temprana y más tardía con clases
          const earliestClassTime = Math.min(
            ...filasConClases.map((fila) => timeToMinutes(fila.hora, false))
          );
          const latestClassTime = Math.max(
            ...filasConClases.map((fila) => timeToMinutes(fila.hora, true))
          );

          console.log('Hora más temprana:', earliestClassTime, 'Hora más tardía:', latestClassTime);

          // Identificar filas con RECESO
          const filasReceso = filas.filter((fila) =>
            ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].some(
              (day) => fila[day] && /R\s*E\s*C\s*E\s*S\s*O|Receso/i.test(fila[day].toString())
            )
          );
          console.log('Filas con RECESO:', filasReceso);

          // Filtrar filas para incluir solo las que están dentro del rango de clases
          filas = filas.filter((fila) => {
            const rowStartTime = timeToMinutes(fila.hora, false);
            const rowEndTime = timeToMinutes(fila.hora, true);
            return rowStartTime >= earliestClassTime && rowEndTime <= latestClassTime;
          });

          console.log('Filas filtradas finales:', filas);

          setHorario(filas);
          // Guardar horario en localStorage
          localStorage.setItem('horarioData', JSON.stringify(filas));
        } else {
          console.warn('⚠️ Sin conexión, cargando horario guardado...');
          const localHorario = localStorage.getItem('horarioData');
          const localPeriodo = localStorage.getItem('periodoData');
          const localCarrera = localStorage.getItem('carreraData');
          if (localHorario && localPeriodo && localCarrera) {
            setHorario(JSON.parse(localHorario));
            setPeriodo(JSON.parse(localPeriodo));
            setCarrera(JSON.parse(localCarrera));
          } else {
            setError('No hay datos disponibles offline. Conéctate para cargar el horario.');
            setHorario([]);
          }
        }
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
        setHorario([]);
      } finally {
        setLoading(false);
      }
    };

    cargarHorario();
  }, [nombreDocente, isOffline]);

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
  const displayDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: 1000, margin: 'auto', padding: '16px' }}
    >
      {/* 🔌 Indicador de conexión */}
      {isOffline && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
          ⚠️ Estás sin conexión. Se están mostrando los datos guardados.
        </Alert>
      )}

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
          Docente: {docenteCompleto || 'Cargando...'}
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

      {error ? (
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
            {error}
          </Typography>
        </motion.div>
      ) : horario.length > 0 ? (
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
                  background: 'linear-gradient(90deg,rgb(202, 19, 80) 0%,rgb(181, 40, 87) 100%)',
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
                      backgroundColor: days[index] === currentDay ? '#490C28' : 'transparent',
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {horario.map((row, idx) => {
                const esReceso = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].some(
                  (day) => row[day] && /R\s*E\s*C\s*E\s*S\s*O|Receso/i.test(row[day].toString())
                );
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
                        color: '#921F45',
                      }}
                    >
                      {row.hora}
                    </TableCell>
                    {esReceso ? (
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
                            color: '#921F45',
                            fontStyle: 'italic',
                            backgroundColor: day === currentDay ? '#490C281A' : 'transparent',
                          }}
                        >
                          RECESO
                        </TableCell>
                      ))
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
                            backgroundColor: day === currentDay ? '#490C281A' : 'transparent',
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
            No se encontraron datos de horario para el docente: {nombreDocente || 'Cargando...'}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HorarioDocente;