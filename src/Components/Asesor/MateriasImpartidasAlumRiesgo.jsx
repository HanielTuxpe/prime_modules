import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
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
} from '@mui/material';
import axios from 'axios';
import { obtenerMatricula } from '../Access/SessionService';

const CLV_DOCENTE = obtenerMatricula(); // ID del docente
const BaseURL = import.meta.env.VITE_URL_BASE_API;

const MateriasImpartidasNaView = () => {
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materia, setMateria] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docenteInfo, setDocenteInfo] = useState({ Nombre: '', PeriodoMasReciente: '' });

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

  // Obtener datos del docente
  useEffect(() => {
    const fetchDocenteInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BaseURL}/DatosDocente?ClvDocente=${CLV_DOCENTE}`);
        const docenteData = response.data.data[0] || { Nombre: 'Desconocido', PeriodoMasReciente: 'Desconocido' };
        setDocenteInfo({
          Nombre: docenteData.Nombre.trim(),
          PeriodoMasReciente: formatPeriodo(docenteData.PeriodoMasReciente),
        });
        console.log('Docente Info:', docenteData); // Depuración
      } catch (err) {
        setError('No se pudieron cargar los datos del docente. Verifique la conexión con el servidor.');
        setDocenteInfo({ Nombre: 'Desconocido', PeriodoMasReciente: 'Desconocido' });
        console.error('Error fetching docente info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocenteInfo();
  }, []);

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

  // Obtener materias del docente
  useEffect(() => {
    const fetchMaterias = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BaseURL}/materiasxDocente/?ClvDocente=${CLV_DOCENTE}`);
        setMaterias(response.data.data);
        console.log('Materias:', response.data.data); // Depuración
      } catch (err) {
        setError('No se pudieron cargar las materias. Verifique la conexión con el servidor.');
        console.error('Error fetching materias:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, []);

  // Obtener grupos cuando se selecciona una materia
  useEffect(() => {
    if (materia) {
      const fetchGrupos = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${BaseURL}/gruposxMateria/?ClvMateria=${materia}&ClvDocente=${CLV_DOCENTE}`
          );
          setGrupos(response.data.data);
          console.log('Grupos:', response.data.data); // Depuración
        } catch (err) {
          setError('No se pudieron cargar los grupos. Verifique la materia seleccionada.');
          setGrupos([]);
          console.error('Error fetching grupos:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchGrupos();
      setEstudiantes([]);
    } else {
      setGrupos([]);
      setEstudiantes([]);
    }
  }, [materia]);

  // Obtener estudiantes de todos los grupos cuando se selecciona una materia
  useEffect(() => {
    if (materia && grupos.length > 0) {
      const fetchEstudiantes = async () => {
        setLoading(true);
        setError(null);
        try {
          const clvCuatrimestre = grupos[0]?.ClvCuatrimestre || '5';
          console.log('Fetching estudiantes with:', { ClvMateria: materia, ClvCuatrimestre: clvCuatrimestre }); // Depuración
          const response = await axios.get(
            `${BaseURL}/CalificacionesXMateriaGrupo?ClvMateria=${materia}&ClvCuatrimestre=${clvCuatrimestre}`
          );
          console.log('Estudiantes Response:', response.data.data); // Depuración
          if (response.data.data.length === 0) {
            setError('No hay calificaciones disponibles para esta materia.');
            setEstudiantes([]);
          } else {
            const estudiantesConEfectivas = response.data.data.map((estudiante) => ({
              ...estudiante,
              Parcial1Efectiva: Math.max(
                estudiante.Parcial1 || 0,
                estudiante.Parcial1E1 || 0,
                estudiante.Parcial1E2 || 0,
                estudiante.Parcial1E3 || 0
              ),
              Parcial2Efectiva: Math.max(
                estudiante.Parcial2 || 0,
                estudiante.Parcial2E1 || 0,
                estudiante.Parcial2E2 || 0,
                estudiante.Parcial2E3 || 0
              ),
              Parcial3Efectiva: Math.max(
                estudiante.Parcial3 || 0,
                estudiante.Parcial3E1 || 0,
                estudiante.Parcial3E2 || 0,
                estudiante.Parcial3E3 || 0
              ),
            }));
            // Filtrar estudiantes con calificaciones menores a 7 en al menos un parcial que haya pasado
            const estudiantesEnRiesgo = estudiantesConEfectivas
              .filter((estudiante) => {
                const periodo = estudiante.Periodo;
                console.log('Estudiante:', estudiante.Matricula, 'Periodo:', periodo, {
                  Parcial1Efectiva: estudiante.Parcial1Efectiva,
                  Parcial2Efectiva: estudiante.Parcial2Efectiva,
                  Parcial3Efectiva: estudiante.Parcial3Efectiva,
                  Parcial1Passed: hasParcialPassed(1, periodo),
                  Parcial2Passed: hasParcialPassed(2, periodo),
                  Parcial3Passed: hasParcialPassed(3, periodo),
                }); // Depuración
                return (
                  (hasParcialPassed(1, periodo) && estudiante.Parcial1Efectiva < 7 && estudiante.Parcial1Efectiva >= 0) ||
                  (hasParcialPassed(2, periodo) && estudiante.Parcial2Efectiva < 7 && estudiante.Parcial2Efectiva >= 0) ||
                  (hasParcialPassed(3, periodo) && estudiante.Parcial3Efectiva < 7 && estudiante.Parcial3Efectiva >= 0)
                );
              })
              // Ordenar por grupo y luego por nombre completo
              .sort((a, b) => {
                const grupoA = a.Grupo || '';
                const grupoB = b.Grupo || '';
                if (grupoA !== grupoB) {
                  return grupoA.localeCompare(grupoB);
                }
                const nombreCompletoA = `${a.Nombre} ${a.APaterno} ${a.AMaterno}`.toLowerCase();
                const nombreCompletoB = `${b.Nombre} ${b.APaterno} ${b.AMaterno}`.toLowerCase();
                return nombreCompletoA.localeCompare(nombreCompletoB);
              });
            console.log('Estudiantes en riesgo:', estudiantesEnRiesgo); // Depuración
            setEstudiantes(estudiantesEnRiesgo);
          }
        } catch (err) {
          console.error('Error en fetchEstudiantes:', err);
          setError(
            err.response?.status === 404
              ? 'No se encontraron calificaciones para esta materia. Verifique los datos.'
              : 'Error al cargar las calificaciones. Intente de nuevo.'
          );
          setEstudiantes([]);
        } finally {
          setLoading(false);
        }
      };
      fetchEstudiantes();
    } else {
      setEstudiantes([]);
    }
  }, [materia, grupos, docenteInfo.PeriodoMasReciente]);

  const handleMateriaChange = (event) => {
    setMateria(event.target.value);
  };

  // Función auxiliar para determinar la fuente de la calificación parcial efectiva
  const getParcialSource = (estudiante, parcial) => {
    const effectiveGrade = estudiante[`Parcial${parcial}Efectiva`];
    if (effectiveGrade === 0) return 'N/A';
    const sources = [
      { key: `Parcial${parcial}`, source: 'OR' },
      { key: `Parcial${parcial}E1`, source: 'E1' },
      { key: `Parcial${parcial}E2`, source: 'E2' },
      { key: `Parcial${parcial}E3`, source: 'E3' },
    ];
    for (const { key, source } of sources) {
      if (estudiante[key] === effectiveGrade && estudiante[key] !== undefined && estudiante[key] !== null) {
        return source;
      }
    }
    return 'N/A';
  };

  return (
    <Card sx={{ maxWidth: '95%', margin: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h4" fontWeight="bold" align="center" color="#921F45" gutterBottom>
          Alumnos en Riesgo
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Docente: {docenteInfo.Nombre}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Período: {docenteInfo.PeriodoMasReciente}
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

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography variant="body2" fontWeight="bold" gutterBottom color="#921F45">
                Seleccionar Materia
              </Typography>
              <Select value={materia} onChange={handleMateriaChange} displayEmpty sx={{ color: 'text.primary' }}>
                <MenuItem sx={{ color: 'text.primary' }} value="" disabled>
                  -- Seleccionar --
                </MenuItem>
                {materias.map((m) => (
                  <MenuItem sx={{ color: 'text.primary' }} key={m.ClvMateria} value={m.ClvMateria}>
                    {m.NomMateria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {materia && (
          <>
            <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
              {materias.find((m) => m.ClvMateria === materia)?.NomMateria}
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
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Grupo</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                        Parcial 1
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                        Parcial 2
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                        Parcial 3
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {estudiantes.map((e, index) => (
                      <TableRow key={e.Matricula} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white' }}>
                        <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.Matricula}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.Nombre}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.APaterno}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.AMaterno}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.Grupo}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            py: 1.5,
                            color:
                              hasParcialPassed(1, docenteInfo.PeriodoMasReciente) &&
                              e.Parcial1Efectiva < 7 &&
                              e.Parcial1Efectiva >= 0
                                ? 'red'
                                : 'inherit',
                          }}
                        >
                          {e.Parcial1Efectiva === 0 ? 'N/A' : `${e.Parcial1Efectiva} ${getParcialSource(e, 1)}`}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            py: 1.5,
                            color:
                              hasParcialPassed(2, docenteInfo.PeriodoMasReciente) &&
                              e.Parcial2Efectiva < 7 &&
                              e.Parcial2Efectiva >= 0
                                ? 'red'
                                : 'inherit',
                          }}
                        >
                          {e.Parcial2Efectiva === 0 ? 'N/A' : `${e.Parcial2Efectiva} ${getParcialSource(e, 2)}`}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            py: 1.5,
                            color:
                              hasParcialPassed(3, docenteInfo.PeriodoMasReciente) &&
                              e.Parcial3Efectiva < 7 &&
                              e.Parcial3Efectiva >= 0
                                ? 'red'
                                : 'inherit',
                          }}
                        >
                          {e.Parcial3Efectiva === 0 ? 'N/A' : `${e.Parcial3Efectiva} ${getParcialSource(e, 3)}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ mt: 3 }}>
                No hay estudiantes en riesgo (calificaciones menores a 7) en esta materia.
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MateriasImpartidasNaView;