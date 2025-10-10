import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Modal,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { obtenerMatricula } from '../Access/SessionService';

const CLV_DOCENTE = obtenerMatricula(); // ID del docente

const BaseURL = import.meta.env.VITE_URL_BASE_API;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const AlumnosRiesgoAsesorView = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tutorInfo, setTutorInfo] = useState({
    nombreTutor: 'Desconocido',
    grupo: 'Desconocido',
    cuatrimestre: 'Desconocido',
    periodo: 'Desconocido',
    carrera: 'Tecnologías de la Información',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ matricula: '', nombre: '', parcial: '', failedSubjects: [] });
  const [failedSubjectsRanking, setFailedSubjectsRanking] = useState([]);

  // Formatear el período para mostrarlo de forma legible
  const formatPeriodo = (periodo) => {
    if (!periodo || periodo === 'Desconocido') return 'Desconocido';
    const year = periodo.slice(0, 4);
    const term = periodo.slice(4);
    const months = {
      '1': 'Enero - Abril',
      '2': 'Mayo - Agosto',
      '3': 'Septiembre - Diciembre',
    };
    return `${months[term] || 'Desconocido'} ${year}`;
  };

  // Determinar si un parcial ha pasado basado en el período y la fecha actual
  const hasParcialPassed = (parcial, periodo) => {
    if (!periodo || periodo === 'Desconocido') return false;

    const year = parseInt(periodo.slice(0, 4), 10);
    const term = periodo.slice(4);
     const currentDate = new Date(2025, 0, 31); // Obtener la fecha actual del sistema

    // Definir fechas de fin para los parciales (último día del mes)
    const parcialDates = {
      '1': [ // Enero - Abril
        new Date(year, 0, 31), // Parcial 1: 31 de enero
        new Date(year, 1, 28), // Parcial 2: 28 de febrero (o 29 en año bisiesto)
        new Date(year, 2, 31), // Parcial 3: 31 de marzo
      ],
      '2': [ // Mayo - Agosto
        new Date(year, 4, 31), // Parcial 1: 31 de mayo
        new Date(year, 5, 30), // Parcial 2: 30 de junio
        new Date(year, 6, 31), // Parcial 3: 31 de julio
      ],
      '3': [ // Septiembre - Diciembre
        new Date(year, 8, 30), // Parcial 1: 30 de septiembre
        new Date(year, 9, 31), // Parcial 2: 31 de octubre
        new Date(year, 10, 30), // Parcial 3: 30 de noviembre
      ],
    };

    // Ajustar febrero para años bisiestos
    if (term === '1') {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      parcialDates['1'][1] = new Date(year, 1, isLeapYear ? 29 : 28); // Parcial 2: 28 o 29 de febrero
    }

    const dates = parcialDates[term] || [];
    return dates[parcial - 1] && currentDate >= dates[parcial - 1];
  };

  // Manejar la apertura del modal
  const handleOpenModal = (estudiante, parcial) => {
    const failedSubjects = estudiante[`failedSubjectsP${parcial}`] || [];
    setModalData({
      matricula: estudiante.matricula,
      nombre: `${estudiante.nombre} ${estudiante.apaterno} ${estudiante.amaterno || ''}`,
      parcial: `Parcial ${parcial}`,
      failedSubjects,
    });
    setModalOpen(true);
  };

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData({ matricula: '', nombre: '', parcial: '', failedSubjects: [] });
  };

  // Obtener datos del tutor y estudiantes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener lista de estudiantes
        const studentsResponse = await axios.get(`${BaseURL}studentsList?ClvTutor=${CLV_DOCENTE}`);
        const studentsData = studentsResponse.data.data || [];
        console.log('Datos de estudiantes (/studentsList):', studentsData); // Depuración

        if (studentsData.length === 0) {
          setError('No se encontraron estudiantes para el tutor especificado.');
          setEstudiantes([]);
          return;
        }

        // Extraer información del tutor del primer estudiante
        const firstStudent = studentsData[0];
        const tutorData = {
          nombreTutor: firstStudent.Nombre_Tutor?.trim() || 'Desconocido',
          grupo: firstStudent.Grupo?.trim() || 'Desconocido',
          cuatrimestre: firstStudent.Cuatri?.trim() || 'Desconocido',
          periodo: formatPeriodo(firstStudent.Periodo) || 'Desconocido',
          carrera: 'Tecnologías de la Información',
        };
        setTutorInfo(tutorData);
        console.log('Información del tutor:', tutorData); // Depuración

        // Obtener calificaciones
        const gradesResponse = await axios.get(
          `${BaseURL}getCalificacionesPorGrupo/?grupo=${tutorData.grupo}&cuatrimestre=${tutorData.cuatrimestre}&periodo=${firstStudent.Periodo}`
        );
        const gradesData = gradesResponse.data.data || [];
        console.log('Datos de calificaciones (/getCalificacionesPorGrupo):', gradesData); // Depuración

        // Procesar estudiantes y calcular materias reprobadas
        const estudiantesProcesados = studentsData
          .map((student) => {
            const studentGrades = gradesData.filter((grade) => grade.Matricula === student.Matricula);

            const calificaciones = studentGrades.map((grade) => {
              const parcial1Efectiva = Math.max(
                grade.Parcial1 || 0,
                grade.Parcial1E1 || 0,
                grade.Parcial1E2 || 0,
                grade.Parcial1E3 || 0
              );
              const parcial2Efectiva = Math.max(
                grade.Parcial2 || 0,
                grade.Parcial2E1 || 0,
                grade.Parcial2E2 || 0,
                grade.Parcial2E3 || 0
              );
              const parcial3Efectiva = Math.max(
                grade.Parcial3 || 0,
                grade.Parcial3E1 || 0,
                grade.Parcial3E2 || 0,
                grade.Parcial3E3 || 0
              );

              return {
                materia: grade.Materia?.trim() || 'Sin materia',
                parcial1Efectiva,
                parcial2Efectiva,
                parcial3Efectiva,
              };
            });

            // Contar materias reprobadas y guardar nombres de materias reprobadas
            const failedSubjectsP1 = hasParcialPassed(1, firstStudent.Periodo)
              ? calificaciones
                  .filter((c) => c.parcial1Efectiva === 0 || (c.parcial1Efectiva > 0 && c.parcial1Efectiva < 7))
                  .map((c) => c.materia)
              : [];
            const failedSubjectsP2 = hasParcialPassed(2, firstStudent.Periodo)
              ? calificaciones
                  .filter((c) => c.parcial2Efectiva === 0 || (c.parcial2Efectiva > 0 && c.parcial2Efectiva < 7))
                  .map((c) => c.materia)
              : [];
            const failedSubjectsP3 = hasParcialPassed(3, firstStudent.Periodo)
              ? calificaciones
                  .filter((c) => c.parcial3Efectiva === 0 || (c.parcial3Efectiva > 0 && c.parcial3Efectiva < 7))
                  .map((c) => c.materia)
              : [];

            const materiasP1 = failedSubjectsP1.length;
            const materiasP2 = failedSubjectsP2.length;
            const materiasP3 = failedSubjectsP3.length;

            // Solo incluir estudiantes con al menos una materia reprobada
            if (materiasP1 === 0 && materiasP2 === 0 && materiasP3 === 0) {
              return null; // Excluir estudiantes sin materias reprobadas
            }

            console.log('Estudiante procesado:', {
              matricula: student.Matricula,
              nombre: `${student.NomAlumno} ${student.APaterno} ${student.AMaterno || ''}`,
              failedSubjectsP1,
              failedSubjectsP2,
              failedSubjectsP3,
            }); // Depuración específica

            return {
              matricula: student.Matricula?.trim() || 'Sin matrícula',
              nombre: student.NomAlumno?.trim() || 'Sin nombre',
              apaterno: student.APaterno?.trim() || '',
              amaterno: student.AMaterno?.trim() || '',
              materiasP1,
              materiasP2,
              materiasP3,
              failedSubjectsP1,
              failedSubjectsP2,
              failedSubjectsP3,
            };
          })
          .filter((student) => student !== null) // Filtrar estudiantes sin materias reprobadas
          // Ordenar por nombre completo
          .sort((a, b) => {
            const nombreCompletoA = `${a.nombre} ${a.apaterno} ${a.amaterno || ''}`.toLowerCase().trim();
            const nombreCompletoB = `${b.nombre} ${b.apaterno} ${b.amaterno || ''}`.toLowerCase().trim();
            return nombreCompletoA.localeCompare(nombreCompletoB);
          });

        console.log('Estudiantes en riesgo:', estudiantesProcesados); // Depuración
        setEstudiantes(estudiantesProcesados);

        // Calcular ranking de materias reprobadas
        const subjectCounts = {};
        estudiantesProcesados.forEach((student) => {
          const allFailedSubjects = [
            ...student.failedSubjectsP1,
            ...student.failedSubjectsP2,
            ...student.failedSubjectsP3,
          ];
          allFailedSubjects.forEach((subject) => {
            if (subject && subject !== 'Sin materia') {
              subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
            }
          });
        });

        const ranking = Object.entries(subjectCounts)
          .map(([subject, count]) => ({ subject, count }))
          .sort((a, b) => b.count - a.count || a.subject.localeCompare(b.subject));
        console.log('Ranking de materias reprobadas:', ranking); // Depuración
        setFailedSubjectsRanking(ranking);

        if (estudiantesProcesados.length === 0) {
          setError('No se encontraron estudiantes con materias reprobadas (calificaciones menores a 7).');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(
          error.response?.status === 404
            ? 'No se encontraron datos para el tutor o grupo especificado.'
            : 'Error al cargar los datos. Verifique la conexión con el servidor.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card sx={{ maxWidth: '95%', margin: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h4" fontWeight="bold" align="center" color="#921F45" gutterBottom>
          Lista de Estudiantes
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Tutor: {tutorInfo.nombreTutor}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Período: {tutorInfo.periodo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Carrera: {tutorInfo.carrera}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Cuatrimestre: {tutorInfo.cuatrimestre}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3, borderColor: '#921F45' }} />

        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
          Estudiantes
        </Typography>
        {estudiantes.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#921F45' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Num</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Matrícula</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Apellido Paterno</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Apellido Materno</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Materias P1</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Materias P2</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Materias P3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estudiantes.map((e, index) => (
                  <TableRow key={e.matricula} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white' }}>
                    <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.matricula}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.nombre}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.apaterno}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.amaterno}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'medium',
                        py: 1.5,
                        color: e.materiasP1 > 0 ? 'red' : 'inherit',
                        cursor: e.materiasP1 > 0 ? 'pointer' : 'default',
                        '&:hover': e.materiasP1 > 0 ? { backgroundColor: '#f0f0f0' } : {},
                      }}
                      onClick={() => e.materiasP1 > 0 && handleOpenModal(e, 1)}
                    >
                      {e.materiasP1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'medium',
                        py: 1.5,
                        color: e.materiasP2 > 0 ? 'red' : 'inherit',
                        cursor: e.materiasP2 > 0 ? 'pointer' : 'default',
                        '&:hover': e.materiasP2 > 0 ? { backgroundColor: '#f0f0f0' } : {},
                      }}
                      onClick={() => e.materiasP2 > 0 && handleOpenModal(e, 2)}
                    >
                      {e.materiasP2}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'medium',
                        py: 1.5,
                        color: e.materiasP3 > 0 ? 'red' : 'inherit',
                        cursor: e.materiasP3 > 0 ? 'pointer' : 'default',
                        '&:hover': e.materiasP3 > 0 ? { backgroundColor: '#f0f0f0' } : {},
                      }}
                      onClick={() => e.materiasP3 > 0 && handleOpenModal(e, 3)}
                    >
                      {e.materiasP3}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info" sx={{ mt: 3 }}>
            No hay estudiantes con materias reprobadas (calificaciones menores a 7) en este grupo.
          </Alert>
        )}

        {/* Tabla de ranking de materias reprobadas */}
        <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
          Ranking de Materias Reprobadas
        </Typography>
        {failedSubjectsRanking.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#921F45' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Posición</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Materia</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                    Número de Reprobaciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {failedSubjectsRanking.map((item, index) => (
                  <TableRow key={item.subject} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white' }}>
                    <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{item.subject}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'medium', py: 1.5, color: 'red' }}>
                      {item.count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info" sx={{ mt: 3 }}>
            No hay materias reprobadas para mostrar en este grupo.
          </Alert>
        )}

        {/* Modal para mostrar materias reprobadas */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#921F45', fontWeight: 'bold' }}>
                Materias Reprobadas - {modalData.parcial}
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon sx={{ color: 'black' }} />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, color: '#1e1e1e' }}>
              {modalData.nombre}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#921F45' }}>
              <strong>Matrícula:</strong> {modalData.matricula}
            </Typography>
            {modalData.failedSubjects.length > 0 ? (
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {modalData.failedSubjects.map((subject, index) => (
                  <li key={index}>
                    <Typography variant="body2" sx={{ color: 'black' }}>
                      {subject}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2" sx={{ color: 'black' }}>
                No hay materias reprobadas para este parcial.
              </Typography>
            )}
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default AlumnosRiesgoAsesorView;