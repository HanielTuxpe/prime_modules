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
  Modal,
  Box,
} from '@mui/material';
import axios from 'axios';
import Chart from 'react-google-charts';
import { obtenerMatricula } from '../Access/SessionService';

const CLV_DOCENTE = obtenerMatricula(); // ID del docente
const BaseURL = import.meta.env.VITE_URL_BASE_API;

const MateriasImpartidasView = () => {
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesAllGroups, setEstudiantesAllGroups] = useState([]);
  const [materia, setMateria] = useState('');
  const [grupo, setGrupo] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [error, setError] = useState(null);
  const [docenteInfo, setDocenteInfo] = useState({ Nombre: '', PeriodoMasReciente: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
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

  // Restaurar modal y selecciones previas en carga inicial
  useEffect(() => {
    const savedMateria = localStorage.getItem('selectedMateria');
    const savedGrupo = localStorage.getItem('selectedGrupo');
    const savedModalData = localStorage.getItem('modalData');
    const savedModalTitle = localStorage.getItem('modalTitle');
    const savedModalOpen = localStorage.getItem('modalOpen');

    if (savedMateria) setMateria(savedMateria);
    if (savedGrupo) setGrupo(savedGrupo);
    if (savedModalData) setModalData(JSON.parse(savedModalData));
    if (savedModalTitle) setModalTitle(savedModalTitle);
    if (savedModalOpen) setModalOpen(JSON.parse(savedModalOpen));
  }, []);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData([]);
    setModalTitle('');
    localStorage.setItem('modalOpen', JSON.stringify(false));
    localStorage.setItem('modalData', JSON.stringify([]));
    localStorage.setItem('modalTitle', JSON.stringify(''));
  };

  // Función para manejar el clic en las barras
  const handleChartClick = (chartData, category, range, type, isAllGroups = false) => {
    let filteredStudents = [];
    const sourceData = isAllGroups ? estudiantesAllGroups : estudiantes;

    if (type === 'reprobacion') {
      if (category.includes('Parcial')) {
        const parcialKey = `Parcial${category.split(' ')[1]}Efectiva`;
        filteredStudents = sourceData.filter(
          (e) => e[parcialKey] < 7 && e[parcialKey] > 0 && (isAllGroups || e.Grupo === grupo)
        );
        setModalTitle(`Estudiantes Reprobados - ${category} ${isAllGroups ? '' : `(Grupo ${grupo})`}`);
      } else if (category === 'Grupo') {
        filteredStudents = sourceData.filter(
          (e) => e.Grupo === range && e.PromedioFinal < 7 && e.PromedioFinal > 0
        );
        setModalTitle(`Estudiantes Reprobados - Grupo ${range}`);
      }
    } else if (type === 'distribucion') {
      const [min, max] = range.split('-').map(Number);
      if (category.includes('Parcial')) {
        const parcialKey = `Parcial${category.split(' ')[1]}Efectiva`;
        filteredStudents = sourceData.filter(
          (e) =>
            e[parcialKey] >= min &&
            e[parcialKey] <= max &&
            e[parcialKey] > 0 &&
            (isAllGroups || e.Grupo === grupo)
        );
        setModalTitle(`Estudiantes en Rango ${range} - ${category} ${isAllGroups ? '' : `(Grupo ${grupo})`}`);
      } else {
        filteredStudents = sourceData.filter(
          (e) => e.Grupo === category && e.PromedioFinal >= min && e.PromedioFinal <= max && e.PromedioFinal > 0
        );
        setModalTitle(`Estudiantes en Rango ${range} - Grupo ${category}`);
      }
    }

    setModalData(filteredStudents);
    setModalOpen(true);
    // Guardar en localStorage
    localStorage.setItem('modalData', JSON.stringify(filteredStudents));
    localStorage.setItem('modalTitle', JSON.stringify(modalTitle));
    localStorage.setItem('modalOpen', JSON.stringify(true));
  };

  // Obtener datos del docente
  useEffect(() => {
    const fetchDocenteInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!isOffline) {
          const response = await axios.get(`${BaseURL}DatosDocente?ClvDocente=${CLV_DOCENTE}`);
          const docenteData = response.data.data[0] || { Nombre: 'Desconocido', PeriodoMasReciente: 'Desconocido' };
          const formattedDocenteInfo = {
            Nombre: docenteData.Nombre.trim(),
            PeriodoMasReciente: formatPeriodo(docenteData.PeriodoMasReciente),
          };
          setDocenteInfo(formattedDocenteInfo);
          // Guardar en localStorage
          localStorage.setItem('docenteInfoData', JSON.stringify(formattedDocenteInfo));
        } else {
          console.warn('⚠️ Sin conexión, cargando datos del docente guardados...');
          const localData = localStorage.getItem('docenteInfoData');
          if (localData) {
            setDocenteInfo(JSON.parse(localData));
          } else {
            setError('No hay datos disponibles offline. Conéctate para cargar los datos.');
            setDocenteInfo({ Nombre: 'Desconocido', PeriodoMasReciente: 'Desconocido' });
          }
        }
      } catch (err) {
        setError('No se pudieron cargar los datos del docente. Verifique la conexión con el servidor.');
        setDocenteInfo({ Nombre: 'Desconocido', PeriodoMasReciente: 'Desconocido' });
        console.error('Error fetching docente info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocenteInfo();
  }, [isOffline]);

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
        if (!isOffline) {
          const response = await axios.get(`${BaseURL}materiasxDocente/?ClvDocente=${CLV_DOCENTE}`);
          setMaterias(response.data.data);
          // Guardar en localStorage
          localStorage.setItem('materiasData', JSON.stringify(response.data.data));
          // Restaurar materia seleccionada
          const savedMateria = localStorage.getItem('selectedMateria');
          if (savedMateria && response.data.data.some((m) => m.ClvMateria === savedMateria)) {
            setMateria(savedMateria);
          }
        } else {
          console.warn('⚠️ Sin conexión, cargando materias guardadas...');
          const localData = localStorage.getItem('materiasData');
          if (localData) {
            setMaterias(JSON.parse(localData));
            const savedMateria = localStorage.getItem('selectedMateria');
            if (savedMateria && JSON.parse(localData).some((m) => m.ClvMateria === savedMateria)) {
              setMateria(savedMateria);
            }
          } else {
            setError('No hay datos disponibles offline. Conéctate para cargar los datos.');
            setMaterias([]);
          }
        }
      } catch (err) {
        setError('No se pudieron cargar las materias. Verifique la conexión con el servidor.');
        setMaterias([]);
        console.error('Error fetching materias:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, [isOffline]);

  // Obtener grupos cuando se selecciona una materia
  useEffect(() => {
    if (materia) {
      const fetchGrupos = async () => {
        setLoading(true);
        setError(null);
        try {
          if (!isOffline) {
            const response = await axios.get(
              `${BaseURL}gruposxMateria/?ClvMateria=${materia}&ClvDocente=${CLV_DOCENTE}`
            );
            setGrupos(response.data.data);
            // Guardar en localStorage
            localStorage.setItem('gruposData', JSON.stringify(response.data.data));
            // Restaurar grupo seleccionado
            const savedGrupo = localStorage.getItem('selectedGrupo');
            if (savedGrupo && response.data.data.some((g) => g.Grupo === savedGrupo)) {
              setGrupo(savedGrupo);
            }
          } else {
            console.warn('⚠️ Sin conexión, cargando grupos guardados...');
            const localData = localStorage.getItem('gruposData');
            if (localData) {
              setGrupos(JSON.parse(localData));
              const savedGrupo = localStorage.getItem('selectedGrupo');
              if (savedGrupo && JSON.parse(localData).some((g) => g.Grupo === savedGrupo)) {
                setGrupo(savedGrupo);
              }
            } else {
              setError('No hay datos disponibles offline. Conéctate para cargar los datos.');
              setGrupos([]);
            }
          }
        } catch (err) {
          setError('No se pudieron cargar los grupos. Verifique la materia seleccionada.');
          setGrupos([]);
          console.error('Error fetching grupos:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchGrupos();
      setGrupo('');
      setEstudiantes([]);
      setEstudiantesAllGroups([]);
    } else {
      setGrupos([]);
      setEstudiantes([]);
      setEstudiantesAllGroups([]);
    }
  }, [materia, isOffline]);

  // Obtener estudiantes de todos los grupos
  useEffect(() => {
    if (materia && grupos.length > 0 && docenteInfo.PeriodoMasReciente) {
      const fetchEstudiantesAllGroups = async () => {
        setLoadingCharts(true);
        setError(null);
        try {
          if (!isOffline) {
            const clvCuatrimestre = grupos[0]?.ClvCuatrimestre || '5';
            const periodo = docenteInfo.PeriodoMasReciente
              ? docenteInfo.PeriodoMasReciente.split(' ')[2] +
                (docenteInfo.PeriodoMasReciente.includes('Enero')
                  ? '1'
                  : docenteInfo.PeriodoMasReciente.includes('Mayo')
                    ? '2'
                    : '3')
              : '';
            if (!periodo) {
              setError('Período no disponible. Seleccione una materia válida.');
              setEstudiantesAllGroups([]);
              setLoadingCharts(false);
              return;
            }
            const response = await axios.get(
              `${BaseURL}CalificacionesXMateriaGrupo?ClvMateria=${materia}&ClvCuatrimestre=${clvCuatrimestre}`
            );
            if (response.data.data.length === 0) {
              setEstudiantesAllGroups([]);
              setError('No hay calificaciones disponibles para esta materia.');
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
                PromedioFinal: estudiante.PromedioFinal || 0,
              }));
              setEstudiantesAllGroups(estudiantesConEfectivas);
              // Guardar en localStorage
              localStorage.setItem('estudiantesAllGroupsData', JSON.stringify(estudiantesConEfectivas));
            }
          } else {
            console.warn('⚠️ Sin conexión, cargando estudiantes de todos los grupos guardados...');
            const localData = localStorage.getItem('estudiantesAllGroupsData');
            if (localData) {
              setEstudiantesAllGroups(JSON.parse(localData));
            } else {
              setError('No hay datos disponibles offline. Conéctate para cargar los datos.');
              setEstudiantesAllGroups([]);
            }
          }
        } catch (err) {
          console.error('Error en fetchEstudiantesAllGroups:', err);
          setError(
            err.response?.status === 404
              ? 'No se encontraron calificaciones para esta materia. Verifique los datos.'
              : 'Error al cargar las calificaciones de todos los grupos.'
          );
          setEstudiantesAllGroups([]);
        } finally {
          setLoadingCharts(false);
        }
      };
      fetchEstudiantesAllGroups();
    } else {
      setEstudiantesAllGroups([]);
    }
  }, [materia, grupos, docenteInfo.PeriodoMasReciente, isOffline]);

  // Obtener estudiantes cuando se selecciona un grupo
  useEffect(() => {
    if (materia && grupo) {
      const fetchEstudiantes = async () => {
        setLoading(true);
        setError(null);
        try {
          if (!isOffline) {
            const grupoData = grupos.find((g) => g.Grupo === grupo);
            const clvCuatrimestre = grupoData ? grupoData.ClvCuatrimestre : '5';
            const response = await axios.get(
              `${BaseURL}CalificacionesXMateriaGrupo?ClvMateria=${materia}&ClvCuatrimestre=${clvCuatrimestre}&Grupo=${grupo}`
            );
            if (response.data.data.length === 0) {
              setError('No hay calificaciones disponibles para este grupo y materia.');
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
                PromedioFinal: estudiante.PromedioFinal || 0,
              }));
              setEstudiantes(estudiantesConEfectivas);
              // Guardar en localStorage
              localStorage.setItem('estudiantesData', JSON.stringify(estudiantesConEfectivas));
            }
          } else {
            console.warn('⚠️ Sin conexión, cargando estudiantes guardados...');
            const localData = localStorage.getItem('estudiantesData');
            if (localData) {
              setEstudiantes(JSON.parse(localData));
            } else {
              setError('No hay datos disponibles offline. Conéctate para cargar los datos.');
              setEstudiantes([]);
            }
          }
        } catch (err) {
          console.error('Error en fetchEstudiantes:', err);
          setError(
            err.response?.status === 404
              ? 'No se encontraron calificaciones para esta materia y grupo. Verifique los datos.'
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
  }, [materia, grupo, grupos, isOffline]);

  const handleMateriaChange = (event) => {
    const newMateria = event.target.value;
    setMateria(newMateria);
    localStorage.setItem('selectedMateria', newMateria);
  };

  const handleGrupoChange = (event) => {
    const newGrupo = event.target.value;
    setGrupo(newGrupo);
    localStorage.setItem('selectedGrupo', newGrupo);
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

  // Datos para la gráfica de desempeño del grupo específico
  const groupPerformanceData = estudiantes.length
    ? [
        ['Evaluación', 'Promedio'],
        ...[
          ['Parcial 1', estudiantes.filter((e) => e.Parcial1Efectiva > 0).length
            ? estudiantes
                .filter((e) => e.Parcial1Efectiva > 0)
                .reduce((sum, e) => sum + e.Parcial1Efectiva, 0) /
              estudiantes.filter((e) => e.Parcial1Efectiva > 0).length
            : 0],
          ['Parcial 2', estudiantes.filter((e) => e.Parcial2Efectiva > 0).length
            ? estudiantes
                .filter((e) => e.Parcial2Efectiva > 0)
                .reduce((sum, e) => sum + e.Parcial2Efectiva, 0) /
              estudiantes.filter((e) => e.Parcial2Efectiva > 0).length
            : 0],
          ['Parcial 3', estudiantes.filter((e) => e.Parcial3Efectiva > 0).length
            ? estudiantes
                .filter((e) => e.Parcial3Efectiva > 0)
                .reduce((sum, e) => sum + e.Parcial3Efectiva, 0) /
              estudiantes.filter((e) => e.Parcial3Efectiva > 0).length
            : 0],
          ['Final', estudiantes.filter((e) => typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0).length
            ? estudiantes
                .filter((e) => typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0)
                .reduce((sum, e) => sum + e.PromedioFinal, 0) /
              estudiantes.filter((e) => typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0).length
            : 0],
        ].map(([label, value]) => [label, parseFloat(value.toFixed(2))]),
      ]
    : [
        ['Evaluación', 'Promedio'],
        ['Parcial 1', 0],
        ['Parcial 2', 0],
        ['Parcial 3', 0],
        ['Final', 0],
      ];

  // Datos para la gráfica de tasa de reprobación por grupo
  const reprobacionData = estudiantesAllGroups.length
    ? [
        ['Grupo', 'Tasa de Reprobación (%)'],
        ...[...new Set(estudiantesAllGroups.map((e) => e.Grupo))].map((group) => {
          const validStudents = estudiantesAllGroups.filter(
            (e) => e.Grupo === group && typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0
          );
          const tasa = validStudents.length
            ? (validStudents.filter((e) => e.PromedioFinal < 7).length / validStudents.length) * 100
            : 0;
          return [group, parseFloat(tasa.toFixed(1))];
        }),
      ]
    : [['Grupo', 'Tasa de Reprobación (%)'], ['', 0]];

  // Datos para la gráfica de distribución de calificaciones por grupo
  const distribucionData = estudiantesAllGroups.length
    ? (() => {
        const uniqueGroups = [...new Set(estudiantesAllGroups.map((e) => e.Grupo))];
        const gradeRanges = [
          { range: '0-6', min: 0, max: 6 },
          { range: '7-8', min: 7, max: 8 },
          { range: '9-10', min: 9, max: 10 },
        ];
        return [
          ['Grupo', ...gradeRanges.map((r) => r.range)],
          ...uniqueGroups.map((group) => [
            group,
            ...gradeRanges.map((range) => {
              const validStudents = estudiantesAllGroups.filter(
                (e) => e.Grupo === group && typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0
              );
              return validStudents.filter((e) => e.PromedioFinal >= range.min && e.PromedioFinal <= range.max).length;
            }),
          ]),
        ];
      })()
    : [['Grupo', '0-6', '7-8', '9-10'], ['', 0, 0, 0]];

  // Datos para la gráfica de promedio general por grupo
  const promedioGeneralData = estudiantesAllGroups.length
    ? (() => {
        const uniqueGroups = [...new Set(estudiantesAllGroups.map((e) => e.Grupo))];
        const validStudents = estudiantesAllGroups.filter(
          (e) => typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0
        );
        const promedioMateria = validStudents.length
          ? validStudents.reduce((sum, e) => sum + e.PromedioFinal, 0) / validStudents.length
          : 0;
        return [
          ['Grupo', 'Promedio'],
          ...uniqueGroups.map((group) => {
            const groupStudents = validStudents.filter((e) => e.Grupo === group);
            const promedio = groupStudents.length
              ? groupStudents.reduce((sum, e) => sum + e.PromedioFinal, 0) / groupStudents.length
              : 0;
            return [group, parseFloat(promedio.toFixed(1))];
          }),
          ['Promedio Materia', parseFloat(promedioMateria.toFixed(2))],
        ];
      })()
    : [['Grupo', 'Promedio'], ['', 0], ['Promedio Materia', 0]];

  // Datos para la gráfica de promedio por parcial
  const promedioParcialesData = estudiantesAllGroups.length
    ? (() => {
        const uniqueGroups = [...new Set(estudiantesAllGroups.map((e) => e.Grupo))];
        return [
          ['Grupo', 'Parcial 1', 'Parcial 2', 'Parcial 3'],
          ...uniqueGroups.map((group) => {
            const groupStudents = estudiantesAllGroups.filter((e) => e.Grupo === group);
            const validParcial1 = groupStudents.filter((e) => e.Parcial1Efectiva > 0);
            const validParcial2 = groupStudents.filter((e) => e.Parcial2Efectiva > 0);
            const validParcial3 = groupStudents.filter((e) => e.Parcial3Efectiva > 0);
            return [
              group,
              validParcial1.length
                ? parseFloat(
                    (validParcial1.reduce((sum, e) => sum + e.Parcial1Efectiva, 0) / validParcial1.length).toFixed(1)
                  )
                : 0,
              validParcial2.length
                ? parseFloat(
                    (validParcial2.reduce((sum, e) => sum + e.Parcial2Efectiva, 0) / validParcial2.length).toFixed(1)
                  )
                : 0,
              validParcial3.length
                ? parseFloat(
                    (validParcial3.reduce((sum, e) => sum + e.Parcial3Efectiva, 0) / validParcial3.length).toFixed(1)
                  )
                : 0,
            ];
          }),
        ];
      })()
    : [['Grupo', 'Parcial 1', 'Parcial 2', 'Parcial 3'], ['', 0, 0, 0]];

  // Datos para la gráfica de tasa de reprobación por parcial (grupo seleccionado)
  const reprobacionParcialesData = estudiantes.length
    ? (() => {
        const validParcial1 = estudiantes.filter((e) => e.Parcial1Efectiva > 0);
        const validParcial2 = estudiantes.filter((e) => e.Parcial2Efectiva > 0);
        const validParcial3 = estudiantes.filter((e) => e.Parcial3Efectiva > 0);

        const reprobadosParcial1 = validParcial1.filter((e) => e.Parcial1Efectiva < 7).length;
        const reprobadosParcial2 = validParcial2.filter((e) => e.Parcial2Efectiva < 7).length;
        const reprobadosParcial3 = validParcial3.filter((e) => e.Parcial3Efectiva < 7).length;

        const tasaParcial1 = validParcial1.length
          ? ((reprobadosParcial1 / validParcial1.length) * 100).toFixed(1)
          : 0;
        const tasaParcial2 = validParcial2.length
          ? ((reprobadosParcial2 / validParcial2.length) * 100).toFixed(1)
          : 0;
        const tasaParcial3 = validParcial3.length
          ? ((reprobadosParcial3 / validParcial3.length) * 100).toFixed(1)
          : 0;

        return [
          ['Parcial', 'Tasa de Reprobación (%)'],
          ['Parcial 1', parseFloat(tasaParcial1)],
          ['Parcial 2', parseFloat(tasaParcial2)],
          ['Parcial 3', parseFloat(tasaParcial3)],
        ];
      })()
    : [['Parcial', 'Tasa de Reprobación (%)'], ['Parcial 1', 0], ['Parcial 2', 0], ['Parcial 3', 0]];

  // Datos para la gráfica de distribución de calificaciones por parcial (grupo seleccionado)
  const distribucionParcialesData = estudiantes.length
    ? (() => {
        const gradeRanges = [
          { range: '0-6', min: 0, max: 6 },
          { range: '7-8', min: 7, max: 8 },
          { range: '9-10', min: 9, max: 10 },
        ];
        const parciales = [
          { name: 'Parcial 1', key: 'Parcial1Efectiva' },
          { name: 'Parcial 2', key: 'Parcial2Efectiva' },
          { name: 'Parcial 3', key: 'Parcial3Efectiva' },
        ];
        return [
          ['Parcial', ...gradeRanges.map((r) => r.range)],
          ...parciales.map((parcial) => [
            parcial.name,
            ...gradeRanges.map((range) => {
              const validStudents = estudiantes.filter((e) => e[parcial.key] > 0);
              return validStudents.filter((e) => e[parcial.key] >= range.min && e[parcial.key] <= range.max).length;
            }),
          ]),
        ];
      })()
    : [['Parcial', '0-6', '7-8', '9-10'], ['Parcial 1', 0, 0, 0], ['Parcial 2', 0, 0, 0], ['Parcial 3', 0, 0, 0]];

  // Datos para la gráfica de tasa de reprobación por parcial (todos los grupos)
  const reprobacionParcialesAllGroupsData = estudiantesAllGroups.length
    ? (() => {
        const validParcial1 = estudiantesAllGroups.filter((e) => e.Parcial1Efectiva > 0);
        const validParcial2 = estudiantesAllGroups.filter((e) => e.Parcial2Efectiva > 0);
        const validParcial3 = estudiantesAllGroups.filter((e) => e.Parcial3Efectiva > 0);

        const reprobadosParcial1 = validParcial1.filter((e) => e.Parcial1Efectiva < 7).length;
        const reprobadosParcial2 = validParcial2.filter((e) => e.Parcial2Efectiva < 7).length;
        const reprobadosParcial3 = validParcial3.filter((e) => e.Parcial3Efectiva < 7).length;

        const tasaParcial1 = validParcial1.length
          ? ((reprobadosParcial1 / validParcial1.length) * 100).toFixed(1)
          : 0;
        const tasaParcial2 = validParcial2.length
          ? ((reprobadosParcial2 / validParcial2.length) * 100).toFixed(1)
          : 0;
        const tasaParcial3 = validParcial3.length
          ? ((reprobadosParcial3 / validParcial3.length) * 100).toFixed(1)
          : 0;

        return [
          ['Parcial', 'Tasa de Reprobación (%)'],
          ['Parcial 1', parseFloat(tasaParcial1)],
          ['Parcial 2', parseFloat(tasaParcial2)],
          ['Parcial 3', parseFloat(tasaParcial3)],
        ];
      })()
    : [['Parcial', 'Tasa de Reprobación (%)'], ['Parcial 1', 0], ['Parcial 2', 0], ['Parcial 3', 0]];

  // Datos para la gráfica de distribución de calificaciones por parcial (todos los grupos)
  const distribucionParcialesAllGroupsData = estudiantesAllGroups.length
    ? (() => {
        const gradeRanges = [
          { range: '0-6', min: 0, max: 6 },
          { range: '7-8', min: 7, max: 8 },
          { range: '9-10', min: 9, max: 10 },
        ];
        const parciales = [
          { name: 'Parcial 1', key: 'Parcial1Efectiva' },
          { name: 'Parcial 2', key: 'Parcial2Efectiva' },
          { name: 'Parcial 3', key: 'Parcial3Efectiva' },
        ];
        return [
          ['Parcial', ...gradeRanges.map((r) => r.range)],
          ...parciales.map((parcial) => [
            parcial.name,
            ...gradeRanges.map((range) => {
              const validStudents = estudiantesAllGroups.filter((e) => e[parcial.key] > 0);
              return validStudents.filter((e) => e[parcial.key] >= range.min && e[parcial.key] <= range.max).length;
            }),
          ]),
        ];
      })()
    : [['Parcial', '0-6', '7-8', '9-10'], ['Parcial 1', 0, 0, 0], ['Parcial 2', 0, 0, 0], ['Parcial 3', 0, 0, 0]];

  // Opciones para las gráficas
  const groupChartOptions = {
    title: `Tendencia de Desempeño del Grupo ${grupo} en ${materias.find((m) => m.ClvMateria === materia)?.NomMateria || ''}`,
    subtitle: 'Promedio de Calificaciones por Parcial y Final',
    hAxis: { title: 'Evaluación', textStyle: { color: '#333' } },
    vAxis: { title: 'Promedio', minValue: 0, maxValue: 10, textStyle: { color: '#333' } },
    legend: { position: 'top' },
    colors: ['#921F45'],
    height: 400,
  };

  const reprobacionChartOptions = {
    title: 'Tasa de Reprobación por Grupo',
    subtitle: 'Porcentaje de Estudiantes con Promedio Final < 7',
    hAxis: { title: 'Grupo', textStyle: { color: '#333' } },
    vAxis: { title: 'Tasa de Reprobación (%)', minValue: 0, maxValue: 100, format: '#.#' },
    legend: { position: 'none' },
    colors: ['#f44336'],
    height: 300,
  };

  const distribucionChartOptions = {
    title: 'Distribución de Calificaciones por Grupo',
    subtitle: 'Número de Estudiantes por Rango de Calificación Final',
    hAxis: { title: 'Grupo', textStyle: { color: '#333' } },
    vAxis: { title: 'Número de Estudiantes', minValue: 0, textStyle: { color: '#333' } },
    legend: { position: 'top' },
    colors: ['#f44336', '#ffca28', '#4caf50'],
    isStacked: true,
    height: 300,
  };

  const promedioGeneralChartOptions = {
    title: 'Promedio General por Grupo',
    subtitle: 'Comparación con el Promedio de la Materia',
    hAxis: { title: 'Grupo', textStyle: { color: '#333' } },
    vAxis: { title: 'Promedio', minValue: 0, maxValue: 10, textStyle: { color: '#333' } },
    legend: { position: 'none' },
    colors: ['#921F45'],
    height: 300,
  };

  const promedioParcialesChartOptions = {
    title: 'Promedio por Parcial en Cada Grupo',
    subtitle: 'Desempeño en Parciales Efectivos',
    hAxis: { title: 'Grupo', textStyle: { color: '#333' } },
    vAxis: { title: 'Promedio', minValue: 0, maxValue: 10, textStyle: { color: '#333' } },
    legend: { position: 'top' },
    colors: ['#921F45', '#ffca28', '#4caf50'],
    height: 300,
  };

  const reprobacionParcialesChartOptions = {
    title: `Tasa de Reprobación por Parcial (Grupo ${grupo})`,
    subtitle: 'Porcentaje de Estudiantes con Calificación < 7',
    hAxis: { title: 'Parcial', textStyle: { color: '#333' } },
    vAxis: { title: 'Tasa de Reprobación (%)', minValue: 0, maxValue: 100, format: '#.#' },
    legend: { position: 'none' },
    colors: ['#d81b60'],
    height: 300,
  };

  const distribucionParcialesChartOptions = {
    title: `Distribución de Calificaciones por Parcial (Grupo ${grupo})`,
    subtitle: 'Número de Estudiantes por Rango de Calificación',
    hAxis: { title: 'Parcial', textStyle: { color: '#333' } },
    vAxis: { title: 'Número de Estudiantes', minValue: 0, textStyle: { color: '#333' } },
    legend: { position: 'top' },
    colors: ['#ef5350', '#ff9800', '#4caf50'],
    isStacked: true,
    height: 300,
  };

  const reprobacionParcialesAllGroupsChartOptions = {
    title: 'Tasa de Reprobación por Parcial (Todos los Grupos)',
    subtitle: 'Porcentaje de Estudiantes con Calificación < 7',
    hAxis: { title: 'Parcial', textStyle: { color: '#333' } },
    vAxis: { title: 'Tasa de Reprobación (%)', minValue: 0, maxValue: 100, format: '#.#' },
    legend: { position: 'none' },
    colors: ['#d81b60'],
    height: 300,
  };

  const distribucionParcialesAllGroupsChartOptions = {
    title: 'Distribución de Calificaciones por Parcial (Todos los Grupos)',
    subtitle: 'Número de Estudiantes por Rango de Calificación',
    hAxis: { title: 'Parcial', textStyle: { color: '#333' } },
    vAxis: { title: 'Número de Estudiantes', minValue: 0, textStyle: { color: '#333' } },
    legend: { position: 'top' },
    colors: ['#ef5350', '#ff9800', '#4caf50'],
    isStacked: true,
    height: 300,
  };

  return (
    <Card sx={{ maxWidth: '95%', margin: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h4" fontWeight="bold" align="center" color="#921F45" gutterBottom>
          Materias Impartidas
        </Typography>

        {/* 🔌 Indicador de conexión */}
        {isOffline && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
            ⚠️ Estás sin conexión. Se están mostrando los datos guardados.
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Docente: {docenteInfo.Nombre || 'Cargando...'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Período: {docenteInfo.PeriodoMasReciente || 'Cargando...'}
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography variant="body2" fontWeight="bold" gutterBottom color="#921F45">
                Seleccionar Materia
              </Typography>
              <Select
                value={materia}
                onChange={handleMateriaChange}
                displayEmpty
                sx={{ color: 'text.primary' }}
                disabled={materias.length === 0}
              >
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!materia || grupos.length === 0}>
              <Typography variant="body2" fontWeight="bold" gutterBottom color="#921F45">
                Seleccionar Grupo
              </Typography>
              <Select
                value={grupo}
                onChange={handleGrupoChange}
                displayEmpty
                sx={{ color: 'text.primary' }}
              >
                <MenuItem sx={{ color: 'text.primary' }} value="" disabled>
                  -- Seleccionar --
                </MenuItem>
                {grupos.map((g) => (
                  <MenuItem sx={{ color: 'text.primary' }} key={`${g.ClvCuatrimestre}-${g.Grupo}`} value={g.Grupo}>
                    {g.Grupo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Modal para mostrar estudiantes */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '80%', md: '60%' },
              maxHeight: '80vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#921F45' }}>
              {modalTitle}
            </Typography>
            {modalData.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#921F45' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido Paterno</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido Materno</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grupo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modalData.map((estudiante, index) => (
                      <TableRow key={estudiante.Matricula} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white' }}>
                        <TableCell>{estudiante.Nombre}</TableCell>
                        <TableCell>{estudiante.APaterno}</TableCell>
                        <TableCell>{estudiante.AMaterno}</TableCell>
                        <TableCell>{estudiante.Grupo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No hay estudiantes en esta categoría.</Typography>
            )}
          </Box>
        </Modal>

        {materia && (
          <>
            <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
              Análisis de {materias.find((m) => m.ClvMateria === materia)?.NomMateria || 'Cargando...'}
            </Typography>
            {loadingCharts && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
            {!loadingCharts && estudiantesAllGroups.length === 0 && !loadingCharts && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No hay datos disponibles para generar las gráficas de esta materia.
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                  Distribución de Calificaciones por Parcial (Todos los Grupos)
                </Typography>
                {loadingCharts ? (
                  <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />
                ) : (
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height={{ xs: '250px', sm: '300px', md: '350px' }}
                    data={distribucionParcialesAllGroupsData}
                    options={distribucionParcialesAllGroupsChartOptions}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => {
                          const chart = chartWrapper.getChart();
                          const selection = chart.getSelection();
                          if (selection.length > 0) {
                            const { row, column } = selection[0];
                            const parcial = distribucionParcialesAllGroupsData[row + 1][0];
                            const range = distribucionParcialesAllGroupsData[0][column];
                            handleChartClick(distribucionParcialesAllGroupsData, parcial, range, 'distribucion', true);
                          }
                        },
                      },
                    ]}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                  Tasa de Reprobación por Parcial (Todos los Grupos)
                </Typography>
                {loadingCharts ? (
                  <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />
                ) : (
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height={{ xs: '250px', sm: '300px', md: '350px' }}
                    data={reprobacionParcialesAllGroupsData}
                    options={reprobacionParcialesAllGroupsChartOptions}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => {
                          const chart = chartWrapper.getChart();
                          const selection = chart.getSelection();
                          if (selection.length > 0) {
                            const { row } = selection[0];
                            const parcial = reprobacionParcialesAllGroupsData[row + 1][0];
                            handleChartClick(reprobacionParcialesAllGroupsData, parcial, '', 'reprobacion', true);
                          }
                        },
                      },
                    ]}
                  />
                )}
              </Grid>
              {estudiantesAllGroups.length > 0 && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                      Tasa de Reprobación por Grupo
                    </Typography>
                    <Chart
                      chartType="Bar"
                      width="100%"
                      height={{ xs: '250px', sm: '300px', md: '350px' }}
                      data={reprobacionData}
                      options={reprobacionChartOptions}
                      chartEvents={[
                        {
                          eventName: 'select',
                          callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart();
                            const selection = chart.getSelection();
                            if (selection.length > 0) {
                              const { row } = selection[0];
                              const grupo = reprobacionData[row + 1][0];
                              handleChartClick(reprobacionData, 'Grupo', grupo, 'reprobacion', true);
                            }
                          },
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                      Distribución de Calificaciones por Grupo
                    </Typography>
                    <Chart
                      chartType="Bar"
                      width="100%"
                      height={{ xs: '250px', sm: '300px', md: '350px' }}
                      data={distribucionData}
                      options={distribucionChartOptions}
                      chartEvents={[
                        {
                          eventName: 'select',
                          callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart();
                            const selection = chart.getSelection();
                            if (selection.length > 0) {
                              const { row, column } = selection[0];
                              const grupo = distribucionData[row + 1][0];
                              const range = distribucionData[0][column];
                              handleChartClick(distribucionData, grupo, range, 'distribucion', true);
                            }
                          },
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                      Promedio General por Grupo
                    </Typography>
                    <Chart
                      chartType="ColumnChart"
                      width="100%"
                      height={{ xs: '250px', sm: '300px', md: '350px' }}
                      data={promedioGeneralData}
                      options={promedioGeneralChartOptions}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                      Promedio por Parcial
                    </Typography>
                    <Chart
                      chartType="LineChart"
                      width="100%"
                      height={{ xs: '250px', sm: '300px', md: '350px' }}
                      data={promedioParcialesData}
                      options={promedioParcialesChartOptions}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}

        {estudiantes.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#921F45' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Matrícula</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>Nombre del Estudiante</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                      Parcial 1
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                      Parcial 2
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                      Parcial 3
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 1.5 }}>
                      Promedio Final
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estudiantes.map((e, index) => (
                    <TableRow key={e.Matricula} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white' }}>
                      <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>{e.Matricula}</TableCell>
                      <TableCell sx={{ fontWeight: 'medium', py: 1.5 }}>
                        {`${e.Nombre} ${e.APaterno} ${e.AMaterno}`}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        {e.Parcial1Efectiva === 0 ? 'N/A' : `${e.Parcial1Efectiva} ${getParcialSource(e, 1)}`}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        {e.Parcial2Efectiva === 0 ? 'N/A' : `${e.Parcial2Efectiva} ${getParcialSource(e, 2)}`}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        {e.Parcial3Efectiva === 0 ? 'N/A' : `${e.Parcial3Efectiva} ${getParcialSource(e, 3)}`}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 'bold', color: e.PromedioFinal < 7 ? 'red' : 'green', py: 1.5 }}
                      >
                        {e.PromedioFinal === 0 ? 'N/A' : `${e.PromedioFinal}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" align="right" sx={{ mt: 3, fontWeight: 'bold', color: '#921F45' }}>
              PROMEDIO DEL GRUPO:{' '}
              {estudiantes.filter((e) => typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0).length
                ? (
                    estudiantes
                      .filter((e) => typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0)
                      .reduce((sum, e) => sum + e.PromedioFinal, 0) /
                    estudiantes.filter((e) => typeof e.PromedioFinal === 'number' && e.PromedioFinal > 0).length
                  ).toFixed(1)
                : 'N/A'}
            </Typography>

            <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
              Tendencia de Desempeño del Grupo {grupo} en{' '}
              {materias.find((m) => m.ClvMateria === materia)?.NomMateria || 'Cargando...'}
            </Typography>
            <Chart
              chartType="LineChart"
              width="100%"
              height={{ xs: '300px', sm: '350px', md: '400px' }}
              data={groupPerformanceData}
              options={groupChartOptions}
            />

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                  Tasa de Reprobación por Parcial (Grupo {grupo})
                </Typography>
                <Chart
                  chartType="Bar"
                  width="100%"
                  height={{ xs: '250px', sm: '300px', md: '350px' }}
                  data={reprobacionParcialesData}
                  options={reprobacionParcialesChartOptions}
                  chartEvents={[
                    {
                      eventName: 'select',
                      callback: ({ chartWrapper }) => {
                        const chart = chartWrapper.getChart();
                        const selection = chart.getSelection();
                        if (selection.length > 0) {
                          const { row } = selection[0];
                          const parcial = reprobacionParcialesData[row + 1][0];
                          handleChartClick(reprobacionParcialesData, parcial, grupo, 'reprobacion');
                        }
                      },
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: '#921F45' }}>
                  Distribución de Calificaciones por Parcial (Grupo {grupo})
                </Typography>
                <Chart
                  chartType="Bar"
                  width="100%"
                  height={{ xs: '250px', sm: '300px', md: '350px' }}
                  data={distribucionParcialesData}
                  options={distribucionParcialesChartOptions}
                  chartEvents={[
                    {
                      eventName: 'select',
                      callback: ({ chartWrapper }) => {
                        const chart = chartWrapper.getChart();
                        const selection = chart.getSelection();
                        if (selection.length > 0) {
                          const { row, column } = selection[0];
                          const parcial = distribucionParcialesData[row + 1][0];
                          const range = distribucionParcialesData[0][column];
                          handleChartClick(distribucionParcialesData, parcial, range, 'distribucion');
                        }
                      },
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MateriasImpartidasView;