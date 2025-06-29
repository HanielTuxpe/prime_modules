import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { Card, CardContent, Typography, Box, Table, TableContainer, TableCell, TableBody, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const CLV_DOCENTE = '0432'; // ID del docente
const URL_Base = 'http://localhost:3000';

const ModuloAsesor = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiante, setEstudiante] = useState('');
  const [showGrades, setShowGrades] = useState(false);
  const [tutorInfo, setTutorInfo] = useState({
    nombreTutor: '',
    grupo: '',
    cuatrimestre: '',
    periodo: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch the student list to get tutor info
        const studentsResponse = await axios.get(`${URL_Base}/studentsList?ClvTutor=${CLV_DOCENTE}`);
        const studentsData = studentsResponse.data.data;

        // Set tutor info from the first student
        let tutorData = {
          nombreTutor: '',
          grupo: '',
          cuatrimestre: '',
          periodo: ''
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

        // Then, fetch grades using tutor info
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

  const handleStudentClick = (nombre) => {
    setEstudiante(nombre);
    setShowGrades(true);
  };

  const handleBackClick = () => {
    setShowGrades(false);
    setEstudiante('');
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
            `<div style="padding: 8px; font-size: 14px;"><b>Materia:</b> ${c.materia}<br/><b>M1:</b> ${
              c.m1.nota > 0 ? c.m1.nota : 'N/A'
            }<br/><b>M2:</b> ${c.m2.nota > 0 ? c.m2.nota : 'N/A'}<br/><b>M3:</b> ${
              c.m3.nota > 0 ? c.m3.nota : 'N/A'
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

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 4, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography display="flex" variant="h6" fontWeight="bold" justifyContent="center" gutterBottom>
          Tutor: {tutorInfo.nombreTutor}
        </Typography>
        <Typography display="flex" variant="h6" fontWeight="bold" justifyContent="center" gutterBottom>
          Grupo Asesorado
        </Typography>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Carrera: Tecnologías de la Información</Typography>
          <Typography variant="body2">Grupo: {tutorInfo.grupo}</Typography>
          <Typography variant="body2">Cuatrimestre: {tutorInfo.cuatrimestre}</Typography>
          <Typography variant="body2" gutterBottom>Periodo: {tutorInfo.periodo}</Typography>
        </Box>

        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <motion.div
            animate={{ x: showGrades ? '-120%' : 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#921F45', height: '30px' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Matricula</TableCell>
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
                      onClick={() => handleStudentClick(e.nombre)}
                    >
                      <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>{e.matricula}</TableCell>
                      <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>{e.nombre.split(' ')[0]}</TableCell>
                      <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>{e.nombre.split(' ')[1]}</TableCell>
                      <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>{e.nombre.split(' ')[2]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {groupGradeDistributionData.length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Distribución de Calificaciones del Grupo por Materia (Final)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={groupGradeDistributionData} options={groupGradeDistributionOptions} />
              </>
            )}

            {passFailData.length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Tasa de Aprobados y Reprobados por Materia (Final)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={passFailData} options={passFailChartOptions} />
              </>
            )}

            {groupGradeDistributionDataByParcial('m1').length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Distribución de Calificaciones por Materia (M1)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={groupGradeDistributionDataByParcial('m1')} options={groupGradeDistributionOptionsByParcial('m1')} />
              </>
            )}

            {passFailDataByParcial('m1').length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Tasa de Aprobados y Reprobados por Materia (M1)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={passFailDataByParcial('m1')} options={passFailChartOptionsByParcial('m1')} />
              </>
            )}

            {groupGradeDistributionDataByParcial('m2').length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Distribución de Calificaciones por Materia (M2)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={groupGradeDistributionDataByParcial('m2')} options={groupGradeDistributionOptionsByParcial('m2')} />
              </>
            )}

            {passFailDataByParcial('m2').length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Tasa de Aprobados y Reprobados por Materia (M2)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={passFailDataByParcial('m2')} options={passFailChartOptionsByParcial('m2')} />
              </>
            )}

            {groupGradeDistributionDataByParcial('m3').length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Distribución de Calificaciones por Materia (M3)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={groupGradeDistributionDataByParcial('m3')} options={groupGradeDistributionOptionsByParcial('m3')} />
              </>
            )}

            {passFailDataByParcial('m3').length > 1 && (
              <>
                <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                  Tasa de Aprobados y Reprobados por Materia (M3)
                </Typography>
                <Chart chartType="Bar" width="100%" height="400px" data={passFailDataByParcial('m3')} options={passFailChartOptionsByParcial('m3')} />
              </>
            )}
          </motion.div>

          {estudianteSeleccionado && showGrades && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            >
              <IconButton onClick={handleBackClick} sx={{ mt: 2, color: '#921F45' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
                Desempeño del Estudiante: {estudianteSeleccionado.nombre}
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>
                              {c.m1.nota > 0 ? c.m1.nota : 'N/A'}
                            </Typography>
                            {c.m1.nota > 0 && (
                              <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>{c.m1.tipo}</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 0.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>
                              {c.m2.nota > 0 ? c.m2.nota : 'N/A'}
                            </Typography>
                            {c.m2.nota > 0 && (
                              <Typography sx={{ color: '#000000', fontWeight: 'bold' }}>{c.m2.tipo}</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 0.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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

              <Typography variant="h5" align="right" sx={{ mt: 3, fontWeight: 'bold', color: '#921F45' }}>
                PROMEDIO: {estudianteSeleccionado.average}
              </Typography>

              <Chart chartType="Bar" width="100%" height="400px" data={studentData} options={studentChartOptions} />
            </motion.div>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ModuloAsesor;