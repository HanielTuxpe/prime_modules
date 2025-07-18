import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Chart } from 'react-google-charts';

// Componentes propios
import PerfilAlumno from './PerfilAlumosAsesorados/PerfilAlumno';
import HistorialAlumno from './PerfilAlumosAsesorados/HistorialAlumno';
import RendimientoAlumno from './PerfilAlumosAsesorados/RendimientoAlumno';
import PrediccionesAlumno from './PerfilAlumosAsesorados/Predicciones';

import { obtenerMatricula } from '../Access/SessionService'; 

// Material UI
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

// Íconos Material UI
import {
  ArrowBack,
  AccountCircle,
  AddCircle,
  BarChart,
  History,
} from '@mui/icons-material';

const CLV_DOCENTE = obtenerMatricula(); // ID del docente
const URL_Base = 'http://localhost:3000';

const ModuloAsesor = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiante, setEstudiante] = useState('');
  const [showGrades, setShowGrades] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState('');
  const [selectedOption, setSelectedOption] = useState('perfil');
  const [tutorInfo, setTutorInfo] = useState({
    nombreTutor: '',
    grupo: '',
    cuatrimestre: '',
    periodo: '',
  });
  // Estado para la ventana emergente
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: '',
    students: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get(`${URL_Base}/studentsList?ClvTutor=${CLV_DOCENTE}`);
        const studentsData = studentsResponse.data.data;

        let tutorData = {
          nombreTutor: '',
          grupo: '',
          cuatrimestre: '',
          periodo: '',
        };

        if (studentsData.length > 0) {
          const firstStudent = studentsData[0];
          tutorData = {
            nombreTutor: firstStudent.Nombre_Tutor,
            grupo: firstStudent.Grupo,
            cuatrimestre: firstStudent.Cuatri.trim(),
            periodo: firstStudent.Periodo,
          };
          setTutorInfo(tutorData);
        }

        const gradesResponse = await axios.get(
          `${URL_Base}/getCalificacionesPorGrupo/?grupo=${tutorData.grupo}&cuatrimestre=${tutorData.cuatrimestre}&periodo=${tutorData.periodo}`
        );
        const gradesData = gradesResponse.data.data;

        const students = studentsData.map((student) => {
          const studentGrades = gradesData.filter((grade) => grade.Matricula === student.Matricula);

          const calificaciones = studentGrades.map((grade) => {
            const parcial1Grades = [
              { nota: grade.Parcial1 || 0, tipo: 'OR' },
              { nota: grade.Parcial1E1 || 0, tipo: 'E1' },
              { nota: grade.Parcial1E2 || 0, tipo: 'E2' },
              { nota: grade.Parcial1E3 || 0, tipo: 'E3' },
            ];
            const m1 = parcial1Grades.reduce((max, curr) => (curr.nota > max.nota ? curr : max), parcial1Grades[0]);

            const parcial2Grades = [
              { nota: grade.Parcial2 || 0, tipo: 'OR' },
              { nota: grade.Parcial2E1 || 0, tipo: 'E1' },
              { nota: grade.Parcial2E2 || 0, tipo: 'E2' },
              { nota: grade.Parcial2E3 || 0, tipo: 'E3' },
            ];
            const m2 = parcial2Grades.reduce((max, curr) => (curr.nota > max.nota ? curr : max), parcial2Grades[0]);

            const parcial3Grades = [
              { nota: grade.Parcial3 || 0, tipo: 'OR' },
              { nota: grade.Parcial3E1 || 0, tipo: 'E1' },
              { nota: grade.Parcial3E2 || 0, tipo: 'E2' },
              { nota: grade.Parcial3E3 || 0, tipo: 'E3' },
            ];
            const m3 = parcial3Grades.reduce((max, curr) => (curr.nota > max.nota ? curr : max), parcial3Grades[0]);

            return {
              materia: grade.Materia,
              m1: { nota: m1.nota, tipo: m1.nota > 0 ? m1.tipo : '' },
              m2: { nota: m2.nota, tipo: m2.nota > 0 ? m2.tipo : '' },
              m3: { nota: m3.nota, tipo: m3.nota > 0 ? m3.tipo : '' },
              finalGrade: grade.PromedioFinal || 0,
            };
          });

          const average =
            calificaciones.length > 0
              ? calificaciones.reduce((sum, c) => sum + c.finalGrade, 0) / calificaciones.length
              : 0;

          return {
            matricula: student.Matricula,
            nombre: `${student.NomAlumno} ${student.APaterno} ${student.AMaterno}`,
            nombres: student.NomAlumno,
            Apaterno: student.APaterno,
            Amaterno: student.AMaterno,
            grupo: student.Grupo,
            calificaciones,
            average: parseFloat(average.toFixed(1)),
          };
        });

        setEstudiantes(students);
        if (studentsData.length > 0) {
          const firstStudent = studentsData[0];
          setTutorInfo({
            nombreTutor: firstStudent.Nombre_Tutor,
            grupo: firstStudent.Grupo,
            cuatrimestre: firstStudent.Cuatri.trim(),
            periodo: firstStudent.Periodo,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOptionClick = (opcion) => {
    setSelectedOption(opcion);
  };

  const handleStudentClick = (nombre) => {
    setEstudiante(nombre);
    setShowGrades(true);
    setShowProfile(false);
    setShowMore(false);
  };

  const handleViewProfile = (matricula, nombre) => {
    setSelectedMatricula(matricula);
    setEstudiante(nombre);
    setShowProfile(true);
    setShowGrades(false);
    setShowMore(false);
  };

  const handleMoreClick = (matricula, nombre) => {
    setSelectedMatricula(matricula);
    setEstudiante(nombre);
    setShowMore(true);
    setShowGrades(false);
    setShowProfile(false);
  };

  const handleBackClick = () => {
    setShowGrades(false);
    setShowProfile(false);
    setShowMore(false);
    setEstudiante('');
    setSelectedMatricula('');
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogData({ title: '', students: [] });
  };

  const estudianteSeleccionado = estudiantes.find((e) => e.nombre === estudiante);

  const studentData = estudianteSeleccionado
    ? [
        ['Materia', 'M1', 'M2', 'M3', { role: 'tooltip', type: 'string', p: { html: true } }],
        ...estudianteSeleccionado.calificaciones
          .map((c) => [
            c.materia,
            c.m1.nota > 0 ? c.m1.nota : null,
            c.m2.nota > 0 ? c.m2.nota : null,
            c.m3.nota > 0 ? c.m3.nota : null,
            `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${c.materia}<br/><b>M1:</b> ${c.m1.nota > 0 ? c.m1.nota : 'N/A'
            }<br/><b>M2:</b> ${c.m2.nota > 0 ? c.m2.nota : 'N/A'}<br/><b>M3:</b> ${c.m3.nota > 0 ? c.m3.nota : 'N/A'
            }</div>`,
          ])
          .filter((row) => row.slice(1, 4).some((grade) => grade !== null)),
      ]
    : [['Materia', 'M1', 'M2', 'M3', { role: 'tooltip', type: 'string', p: { html: true } }], ['', 0, 0, 0, '']];

  const studentChartOptions = {
    chart: {
      title: 'Calificaciones por Materia',
      subtitle: 'Comparación de M1, M2 y M3',
    },
    colors: ['#921F45', '#4caf50', '#ffca28'],
    vAxis: { format: '#' },
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    legend: { position: 'top' },
    tooltip: { isHtml: true, trigger: 'focus' },
  };

  const groupGradeDistributionData = (() => {
    const subjects = estudiantes[0]?.calificaciones.map((c) => c.materia) || [];
    const gradeRanges = [
      { range: '0-6', min: 0, max: 6 },
      { range: '7-8', min: 7, max: 8 },
      { range: '9-10', min: 9, max: 10 },
    ];

    const validSubjects = subjects.filter((subject) =>
      estudiantes.every((student) => {
        const calificacion = student.calificaciones.find((c) => c.materia === subject);
        return calificacion && calificacion.m1.nota > 0 && calificacion.m2.nota > 0 && calificacion.m3.nota > 0;
      })
    );

    const data = [['Materia', ...gradeRanges.map((r) => r.range), { role: 'tooltip', type: 'string', p: { html: true } }]];
    validSubjects.forEach((subject) => {
      const counts = gradeRanges.map((range) => {
        return estudiantes.reduce((sum, student) => {
          const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
          return sum + (grade >= range.min && grade <= range.max && grade > 0 ? 1 : 0);
        }, 0);
      });
      data.push([
        subject,
        ...counts,
        `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${subject}<br/><b>0-6:</b> ${counts[0]}<br/><b>7-8:</b> ${counts[1]}<br/><b>9-10:</b> ${counts[2]}</div>`,
      ]);
    });

    return data;
  })();

  const handleGroupGradeDistributionSelect = (chartWrapper) => {
    const selection = chartWrapper.getChart().getSelection();
    if (selection.length > 0) {
      const { row, column } = selection[0];
      if (row !== null && column !== null && column > 0) {
        const subject = groupGradeDistributionData[row + 1][0];
        const rangeIndex = column - 1;
        const gradeRanges = [
          { range: '0-6', min: 0, max: 6 },
          { range: '7-8', min: 7, max: 8 },
          { range: '9-10', min: 9, max: 10 },
        ];
        const selectedRange = gradeRanges[rangeIndex];
        const studentsInRange = estudiantes.filter((student) => {
          const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
          return grade >= selectedRange.min && grade <= selectedRange.max && grade > 0;
        });
        setDialogData({
          title: `Estudiantes en ${subject} (Rango ${selectedRange.range})`,
          students: studentsInRange,
        });
        setOpenDialog(true);
      }
    }
  };

  const passFailData = (() => {
    const subjects = estudiantes[0]?.calificaciones.map((c) => c.materia) || [];
    const validSubjects = subjects.filter((subject) =>
      estudiantes.every((student) => {
        const calificacion = student.calificaciones.find((c) => c.materia === subject);
        return calificacion && calificacion.m1.nota > 0 && calificacion.m2.nota > 0 && calificacion.m3.nota > 0;
      })
    );

    const data = [['Materia', 'Aprobados', 'Reprobados', { role: 'tooltip', type: 'string', p: { html: true } }]];
    validSubjects.forEach((subject) => {
      const passed = estudiantes.filter((student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
        return grade >= 7;
      }).length;
      const failed = estudiantes.filter((student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
        return grade > 0 && grade < 7;
      }).length;
      data.push([
        subject,
        passed,
        failed,
        `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${subject}<br/><b>Aprobados:</b> ${passed}<br/><b>Reprobados:</b> ${failed}</div>`,
      ]);
    });
    return data;
  })();

  const handlePassFailSelect = (chartWrapper) => {
    const selection = chartWrapper.getChart().getSelection();
    if (selection.length > 0) {
      const { row, column } = selection[0];
      if (row !== null && column !== null && column > 0) {
        const subject = passFailData[row + 1][0];
        const status = column === 1 ? 'Aprobados' : 'Reprobados';
        const studentsInStatus = estudiantes.filter((student) => {
          const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
          return column === 1 ? grade >= 7 : grade > 0 && grade < 7;
        });
        setDialogData({
          title: `Estudiantes en ${subject} (${status})`,
          students: studentsInStatus,
        });
        setOpenDialog(true);
      }
    }
  };

  const groupAverageData = (() => {
    const subjects = estudiantes[0]?.calificaciones.map((c) => c.materia) || [];
    const validSubjects = subjects.filter((subject) =>
      estudiantes.every((student) => {
        const calificacion = student.calificaciones.find((c) => c.materia === subject);
        return calificacion && calificacion.finalGrade > 0;
      })
    );

    const data = [['Materia', 'Promedio Final', { role: 'tooltip', type: 'string', p: { html: true } }]];
    validSubjects.forEach((subject) => {
      const average = estudiantes.reduce((sum, student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
        return sum + (grade > 0 ? grade : 0);
      }, 0) / estudiantes.filter((student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
        return grade > 0;
      }).length;
      data.push([
        subject,
        parseFloat(average.toFixed(1)),
        `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${subject}<br/><b>Promedio Final:</b> ${average.toFixed(1)}</div>`,
      ]);
    });

    return data;
  })();

  const groupAverageDataByParcial = (parcial) => {
    const subjects = estudiantes[0]?.calificaciones.map((c) => c.materia) || [];
    const validSubjects = subjects.filter((subject) =>
      estudiantes.some((student) => {
        const calificacion = student.calificaciones.find((c) => c.materia === subject);
        return calificacion && calificacion[parcial].nota > 0;
      })
    );

    const data = [['Materia', `Promedio ${parcial.toUpperCase()}`, { role: 'tooltip', type: 'string', p: { html: true } }]];
    validSubjects.forEach((subject) => {
      const average = estudiantes.reduce((sum, student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.[parcial].nota || 0;
        return sum + (grade > 0 ? grade : 0);
      }, 0) / estudiantes.filter((student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.[parcial].nota || 0;
        return grade > 0;
      }).length;
      data.push([
        subject,
        parseFloat(average.toFixed(1)),
        `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${subject}<br/><b>Promedio ${parcial.toUpperCase()}:</b> ${average.toFixed(1)}</div>`,
      ]);
    });

    return data;
  };

  const groupGradeDistributionDataByParcial = (parcial) => {
    const subjects = estudiantes[0]?.calificaciones.map((c) => c.materia) || [];
    const gradeRanges = [
      { range: '0-6', min: 0, max: 6 },
      { range: '7-8', min: 7, max: 8 },
      { range: '9-10', min: 9, max: 10 },
    ];

    const validSubjects = subjects.filter((subject) =>
      estudiantes.some((student) => {
        const calificacion = student.calificaciones.find((c) => c.materia === subject);
        return calificacion && calificacion[parcial].nota > 0;
      })
    );

    const data = [['Materia', ...gradeRanges.map((r) => r.range), { role: 'tooltip', type: 'string', p: { html: true } }]];
    validSubjects.forEach((subject) => {
      const counts = gradeRanges.map((range) => {
        return estudiantes.reduce((sum, student) => {
          const grade = student.calificaciones.find((c) => c.materia === subject)?.[parcial].nota || 0;
          return sum + (grade >= range.min && grade <= range.max && grade > 0 ? 1 : 0);
        }, 0);
      });
      data.push([
        subject,
        ...counts,
        `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${subject}<br/><b>0-6:</b> ${counts[0]}<br/><b>7-8:</b> ${counts[1]}<br/><b>9-10:</b> ${counts[2]}</div>`,
      ]);
    });

    return data;
  };

  const handleGroupGradeDistributionSelectByParcial = (parcial) => (chartWrapper) => {
    const selection = chartWrapper.getChart().getSelection();
    if (selection.length > 0) {
      const { row, column } = selection[0];
      if (row !== null && column !== null && column > 0) {
        const subject = groupGradeDistributionDataByParcial(parcial)[row + 1][0];
        const rangeIndex = column - 1;
        const gradeRanges = [
          { range: '0-6', min: 0, max: 6 },
          { range: '7-8', min: 7, max: 8 },
          { range: '9-10', min: 9, max: 10 },
        ];
        const selectedRange = gradeRanges[rangeIndex];
        const studentsInRange = estudiantes.filter((student) => {
          const grade = student.calificaciones.find((c) => c.materia === subject)?.[parcial].nota || 0;
          return grade >= selectedRange.min && grade <= selectedRange.max && grade > 0;
        });
        setDialogData({
          title: `Estudiantes en ${subject} (Rango ${selectedRange.range}, ${parcial.toUpperCase()})`,
          students: studentsInRange,
        });
        setOpenDialog(true);
      }
    }
  };

  const passFailDataByParcial = (parcial) => {
    const subjects = estudiantes[0]?.calificaciones.map((c) => c.materia) || [];
    const validSubjects = subjects.filter((subject) =>
      estudiantes.some((student) => {
        const calificacion = student.calificaciones.find((c) => c.materia === subject);
        return calificacion && calificacion[parcial].nota > 0;
      })
    );

    const data = [['Materia', 'Aprobados', 'Reprobados', { role: 'tooltip', type: 'string', p: { html: true } }]];
    validSubjects.forEach((subject) => {
      const passed = estudiantes.filter((student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.[parcial].nota || 0;
        return grade >= 7;
      }).length;
      const failed = estudiantes.filter((student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.[parcial].nota || 0;
        return grade > 0 && grade < 7;
      }).length;
      data.push([
        subject,
        passed,
        failed,
        `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${subject}<br/><b>Aprobados:</b> ${passed}<br/><b>Reprobados:</b> ${failed}</div>`,
      ]);
    });
    return data;
  };

  const handlePassFailSelectByParcial = (parcial) => (chartWrapper) => {
    const selection = chartWrapper.getChart().getSelection();
    if (selection.length > 0) {
      const { row, column } = selection[0];
      if (row !== null && column !== null && column > 0) {
        const subject = passFailDataByParcial(parcial)[row + 1][0];
        const status = column === 1 ? 'Aprobados' : 'Reprobados';
        const studentsInStatus = estudiantes.filter((student) => {
          const grade = student.calificaciones.find((c) => c.materia === subject)?.[parcial].nota || 0;
          return column === 1 ? grade >= 7 : grade > 0 && grade < 7;
        });
        setDialogData({
          title: `Estudiantes en ${subject} (${status}, ${parcial.toUpperCase()})`,
          students: studentsInStatus,
        });
        setOpenDialog(true);
      }
    }
  };

  const groupGradeDistributionOptions = {
    chart: {
      title: 'Distribución de Calificaciones por Materia (Final)',
      subtitle: 'Número de Estudiantes por Rango de Calificación Final',
    },
    isStacked: true,
    colors: ['#f44336', '#ffca28', '#4caf50'],
    vAxis: { format: '#' },
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    legend: { position: 'top' },
    tooltip: { isHtml: true, trigger: 'focus' },
  };

  const passFailChartOptions = {
    chart: {
      title: 'Tasa de Aprobados y Reprobados por Materia (Final)',
      subtitle: 'Número de Estudiantes por Materia',
    },
    colors: ['#4caf50', '#f44336'],
    vAxis: { format: '#' },
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    legend: { position: 'top' },
    tooltip: { isHtml: true, trigger: 'focus' },
  };

  const groupAverageOptions = {
    chart: {
      title: 'Promedio Final por Materia (Grupo)',
      subtitle: 'Promedio de Calificaciones Finales por Materia',
    },
    colors: ['#921F45'],
    vAxis: { format: '#.#', minValue: 0, maxValue: 10 },
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    legend: { position: 'none' },
    tooltip: { isHtml: true, trigger: 'focus' },
  };

  const groupGradeDistributionOptionsByParcial = (parcial) => ({
    chart: {
      title: `Distribución de Calificaciones por Materia (${parcial.toUpperCase()})`,
      subtitle: `Número de Estudiantes por Rango de Calificación en ${parcial.toUpperCase()}`,
    },
    isStacked: true,
    colors: ['#f44336', '#ffca28', '#4caf50'],
    vAxis: { format: '#' },
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    legend: { position: 'top' },
    tooltip: { isHtml: true, trigger: 'focus' },
  });

  const passFailChartOptionsByParcial = (parcial) => ({
    chart: {
      title: `Tasa de Aprobados y Reprobados por Materia (${parcial.toUpperCase()})`,
      subtitle: `Número de Estudiantes por Materia en ${parcial.toUpperCase()}`,
    },
    colors: ['#4caf50', '#f44336'],
    vAxis: { format: '#' },
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    legend: { position: 'top' },
    tooltip: { isHtml: true, trigger: 'focus' },
  });

  const groupAverageOptionsByParcial = (parcial) => ({
    chart: {
      title: `Promedio por Materia (${parcial.toUpperCase()})`,
      subtitle: `Promedio de Calificaciones en ${parcial.toUpperCase()} por Materia`,
    },
    colors: ['#921F45'],
    vAxis: { format: '#.#', minValue: 0, maxValue: 10 },
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    legend: { position: 'none' },
    tooltip: { isHtml: true, trigger: 'focus' },
  });

  return (
    <>
      <Card sx={{ maxWidth: '95%', margin: 'auto', mt: 4, p: 2, boxShadow: 3 }} className="w-full">
        <CardContent>
          <Typography display="flex" variant="h6" fontWeight="bold" justifyContent="center" gutterBottom className="text-center">
            Tutor: {tutorInfo.nombreTutor}
          </Typography>
          <Typography display="flex" variant="h6" fontWeight="bold" justifyContent="center" gutterBottom className="text-center">
            Grupo Asesorado
          </Typography>

          <Box display="flex" justifyContent="space-between" className="flex flex-wrap gap-4">
            <Typography variant="body2">Carrera: Tecnologías de la Información</Typography>
            <Typography variant="body2">Grupo: {tutorInfo.grupo}</Typography>
            <Typography variant="body2">Cuatrimestre: {tutorInfo.cuatrimestre}</Typography>
            <Typography variant="body2" gutterBottom>Periodo: {tutorInfo.periodo}</Typography>
          </Box>

          <Divider sx={{ mb: 3, borderColor: '#921F45' }} />

          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }} className="w-full">
            <motion.div
              animate={{ x: showGrades || showProfile || showMore ? '-120%' : 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#921F45', height: '30px' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Nº</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Matrícula</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Nombre</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Apellido Paterno</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Apellido Materno</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {estudiantes.map((e, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: e.nombre === estudiante ? '#4caf50' : index % 2 === 0 ? '#D9D9D9' : 'white',
                          height: '30px',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: e.nombre === estudiante ? '#4caf50' : '#4caf50',
                          },
                        }}
                      >
                        <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }} onClick={() => handleStudentClick(e.nombre)}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }} onClick={() => handleStudentClick(e.nombre)}>
                          {e.matricula}
                        </TableCell>
                        <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }} onClick={() => handleStudentClick(e.nombre)}>
                          {e.nombres}
                        </TableCell>
                        <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }} onClick={() => handleStudentClick(e.nombre)}>
                          {e.Apaterno}
                        </TableCell>
                        <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }} onClick={() => handleStudentClick(e.nombre)}>
                          {e.Amaterno}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {groupGradeDistributionData.length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Distribución de Calificaciones por Materia (Final)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupGradeDistributionData}
                    options={groupGradeDistributionOptions}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handleGroupGradeDistributionSelect(chartWrapper),
                      },
                    ]}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {passFailData.length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Tasa de Aprobados y Reprobados por Materia (Final)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={passFailData}
                    options={passFailChartOptions}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handlePassFailSelect(chartWrapper),
                      },
                    ]}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {groupAverageData.length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Promedio Final por Materia (Grupo)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupAverageData}
                    options={groupAverageOptions}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {groupGradeDistributionDataByParcial('m1').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Distribución de Calificaciones por Materia (M1)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupGradeDistributionDataByParcial('m1')}
                    options={groupGradeDistributionOptionsByParcial('m1')}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handleGroupGradeDistributionSelectByParcial('m1')(chartWrapper),
                      },
                    ]}
                    className="w-full h-[200px]"
                  />
                </>
              )}

              {passFailDataByParcial('m1').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Tasa de Aprobados y Reprobados por Materia (M1)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={passFailDataByParcial('m1')}
                    options={passFailChartOptionsByParcial('m1')}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handlePassFailSelectByParcial('m1')(chartWrapper),
                      },
                    ]}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {groupAverageDataByParcial('m1').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Promedio por Materia (M1)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupAverageDataByParcial('m1')}
                    options={groupAverageOptionsByParcial('m1')}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {groupGradeDistributionDataByParcial('m2').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Distribución de Calificaciones por Materia (M2)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupGradeDistributionDataByParcial('m2')}
                    options={groupGradeDistributionOptionsByParcial('m2')}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handlePassFailSelectByParcial('m2')(chartWrapper),
                      },
                    ]}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {passFailDataByParcial('m2').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Tasa de Aprobados y Reprobados por Materia (M2)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={passFailDataByParcial('m2')}
                    options={passFailChartOptionsByParcial('m2')}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handlePassFailSelectByParcial('m2')(chartWrapper),
                      },
                    ]}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {groupAverageDataByParcial('m2').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Promedio por Materia (M2)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupAverageDataByParcial('m2')}
                    options={groupAverageOptionsByParcial('m2')}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {groupGradeDistributionDataByParcial('m3').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Distribución de Calificaciones por Materia (M3)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupGradeDistributionDataByParcial('m3')}
                    options={groupGradeDistributionOptionsByParcial('m3')}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handleGroupGradeDistributionSelectByParcial('m3')(chartWrapper),
                      },
                    ]}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {passFailDataByParcial('m3').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Tasa de Aprobados y Reprobados por Materia (M3)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={passFailDataByParcial('m3')}
                    options={passFailChartOptionsByParcial('m3')}
                    chartEvents={[
                      {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => handlePassFailSelectByParcial('m3')(chartWrapper),
                      },
                    ]}
                    className="w-full h-[400px]"
                  />
                </>
              )}

              {groupAverageDataByParcial('m3').length > 1 && (
                <>
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                    Promedio por Materia (M3)
                  </Typography>
                  <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={groupAverageDataByParcial('m3')}
                    options={groupAverageOptionsByParcial('m3')}
                    className="w-full h-[400px]"
                  />
                </>
              )}
            </motion.div>

            {estudianteSeleccionado && showGrades && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: showMore ? '-120%' : 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    px: 2,
                  }}
                  className="flex items-center justify-between w-full px-2"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} className="flex items-center gap-2">
                    <IconButton
                      onClick={handleBackClick}
                      sx={{ color: '#921F45', mt: 2 }}
                      aria-label="Volver"
                    >
                      <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#921F45', mt: 2 }} className="text-[#921F45] font-bold mt-2">
                      Desempeño del Estudiante: {estudianteSeleccionado.nombre}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleMoreClick(estudianteSeleccionado.matricula, estudianteSeleccionado.nombre)}
                    sx={{ color: '#921F45', mt: 2 }}
                    aria-label="Ver más"
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#921F45', mr: 1 }} className="text-[#921F45] font-bold mr-1">
                      Perfil
                    </Typography>
                    <AccountCircle />
                  </IconButton>
                </Box>

                <TableContainer component={Paper} sx={{ mt: 3 }} className="mt-3">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#921F45', height: '30px' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Nombre de la materia</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>
                          M1
                        </TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>
                          M2
                        </TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>
                          M3
                        </TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>
                          Promedio Final
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {estudianteSeleccionado.calificaciones.map((c, index) => (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white', height: '30px' }}>
                          <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                            {c.materia}
                          </TableCell>
                          <TableCell align="center" sx={{ py: 0.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} className="flex justify-center gap-1">
                              <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>
                                {c.m1.nota > 0 ? c.m1.nota : 'N/A'}
                              </Typography>
                              {c.m1.nota > 0 && (
                                <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>{c.m1.tipo}</Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 0.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} className="flex justify-center gap-1">
                              <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>
                                {c.m2.nota > 0 ? c.m2.nota : 'N/A'}
                              </Typography>
                              {c.m2.nota > 0 && (
                                <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>{c.m2.tipo}</Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 0.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} className="flex justify-center gap-1">
                              <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>
                                {c.m3.nota > 0 ? c.m3.nota : 'N/A'}
                              </Typography>
                              {c.m3.nota > 0 && (
                                <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>{c.m3.tipo}</Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold', color: c.finalGrade < 7 ? 'red' : 'green', py: 0.5 }}>
                            {c.finalGrade}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h5" align="right" sx={{ mt: 3, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-3 text-right">
                  PROMEDIO: {estudianteSeleccionado.average}
                </Typography>

                <Chart
                  chartType="Bar"
                  width="100%"
                  height="400px"
                  data={studentData}
                  options={studentChartOptions}
                  className="w-full h-[400px]"
                />
              </motion.div>
            )}

            {showProfile && estudianteSeleccionado && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: showMore ? '-120%' : 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} className="flex items-center gap-1">
                  <IconButton onClick={handleBackClick} sx={{ mt: 2, color: '#921F45' }} aria-label="Volver">
                    <ArrowBack />
                  </IconButton>
                  <IconButton
                    onClick={() => handleMoreClick(estudianteSeleccionado.matricula, estudianteSeleccionado.nombre)}
                    sx={{ mt: 2, color: '#921F45' }}
                    aria-label="Ver más"
                  >
                    <AddCircle />
                  </IconButton>
                </Box>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold mt-4">
                  Perfil del Estudiante: {estudianteSeleccionado.nombre}
                </Typography>
                <PerfilAlumno matricula={selectedMatricula} />
              </motion.div>
            )}

            {showMore && estudianteSeleccionado && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="absolute top-0 left-0 w-full h-full flex flex-col"
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: { xs: 1, sm: 2 },
                    flexWrap: 'wrap',
                  }}
                  className="w-full flex items-center justify-between p-1 sm:p-2 flex-wrap"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} className="flex items-center gap-1">
                    <IconButton
                      onClick={handleBackClick}
                      sx={{ color: '#921F45' }}
                      aria-label="Volver a la lista de estudiantes"
                    >
                      <ArrowBack />
                    </IconButton>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: '#921F45', display: { xs: 'none', sm: 'block' } }}
                      className="text-[#921F45] font-bold hidden sm:block"
                    >
                      {estudianteSeleccionado.nombre}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }} className="flex gap-1 sm:gap-2">
                    {[
                      { key: 'perfil', label: 'Perfil', icon: <AccountCircle /> },
                      { key: 'rendimiento', label: 'Rendimiento', icon: <BarChart /> },
                      { key: 'predicciones', label: 'predicciones', icon: <BarChart /> },
                      { key: 'historial', label: 'Historial', icon: <History /> },
                      
                    ].map((option) => (
                      <Button
                        key={option.key}
                        onClick={() => handleOptionClick(option.key)}
                        sx={{
                          color: selectedOption === option.key ? '#fff' : '#000',
                          backgroundColor: selectedOption === option.key ? '#921F45' : 'transparent',
                          border: selectedOption === option.key ? 'none' : '2px solid #921F45',
                          '&:hover': {
                            backgroundColor: selectedOption === option.key ? '#7a1b38' : '#e0e0e0',
                            border: selectedOption === option.key ? 'none' : '2px solid #921F45',
                          },
                          borderRadius: 1,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          px: { xs: 1, sm: 2 },
                          py: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                        className={`flex items-center gap-1 px-1 sm:px-2 py-1 font-bold rounded text-sm sm:text-base ${selectedOption === option.key ? 'bg-[#921F45] text-white' : 'border-2 border-[#921F45] text-black hover:bg-gray-200'}`}
                        aria-label={`Ver ${option.label} de ${estudianteSeleccionado.nombre}`}
                      >
                        {option.icon}
                        <Typography
                          sx={{
                            display: { xs: 'none', sm: 'inline' },
                            color: selectedOption === option.key ? '#fff' : '#000',
                          }}
                          className={`hidden sm:inline ${selectedOption === option.key ? 'text-white' : 'text-black'}`}
                        >
                          {option.label}
                        </Typography>
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    overflowY: 'auto',
                  }}
                  className="flex-grow p-2 sm:p-3 overflow-y-auto"
                >
                  {selectedOption === 'perfil' && <PerfilAlumno matricula={selectedMatricula} />}
                  {selectedOption === 'rendimiento' && <RendimientoAlumno matricula={selectedMatricula} />}
                  {selectedOption === 'predicciones' && <PrediccionesAlumno matricula={selectedMatricula} />}
                  {selectedOption === 'historial' && <HistorialAlumno matricula={selectedMatricula} />}
                </Box>
              </motion.div>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width:'90%', overflowY: 'auto' } }}
        className="max-w-3xl"
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#921F45' }} className="text-[#921F45] font-bold">
          {dialogData.title}
        </DialogTitle>
        <DialogContent>
          {dialogData.students.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#921F45' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Matrícula</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido Paterno</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido Materno</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grupo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dialogData.students.map((student, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white' }}>
                      <TableCell>{student.matricula}</TableCell>
                      <TableCell>{student.nombres}</TableCell>
                      <TableCell>{student.Apaterno}</TableCell>
                      <TableCell>{student.Amaterno}</TableCell>
                      <TableCell>{student.grupo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No hay estudiantes en este rango o categoría.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: '#921F45' }} className="text-[#921F45]">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModuloAsesor;