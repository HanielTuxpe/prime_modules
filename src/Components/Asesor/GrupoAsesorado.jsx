import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import { Card, CardContent, Typography, FormControl, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ModuloAsesor = () => {
  const [estudiante, setEstudiante] = useState('');
  const estudiantes = [
    {
      nombre: 'Juan Pérez',
      calificaciones: [
        { materia: 'Matemáticas', m1: { nota: 8, tipo: 'OR' }, m2: { nota: 9, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Programación', m1: { nota: 9, tipo: 'OR' }, m2: { nota: 8, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Física', m1: { nota: 7, tipo: 'E1' }, m2: { nota: 8, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 8 },
        { materia: 'Química', m1: { nota: 8, tipo: 'OR' }, m2: { nota: 8, tipo: 'OR' }, m3: { nota: 7, tipo: 'E1' }, finalGrade: 8 },
        { materia: 'Historia', m1: { nota: 9, tipo: 'OR' }, m2: { nota: 9, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Inglés', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 9, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Arte', m1: { nota: 9, tipo: 'OR' }, m2: { nota: 8, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Deportes', m1: { nota: 8, tipo: 'OR' }, m2: { nota: 7, tipo: 'E1' }, m3: { nota: 8, tipo: 'OR' }, finalGrade: 8 },
      ],
      average: 8,
    },
    {
      nombre: 'María Gómez',
      calificaciones: [
        { materia: 'Matemáticas', m1: { nota: 7, tipo: 'OR' }, m2: { nota: 8, tipo: 'E1' }, m3: { nota: 7, tipo: 'OR' }, finalGrade: 7 },
        { materia: 'Programación', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 9, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Física', m1: { nota: 6, tipo: 'E1' }, m2: { nota: 7, tipo: 'OR' }, m3: { nota: 7, tipo: 'OR' }, finalGrade: 7 },
        { materia: 'Química', m1: { nota: 8, tipo: 'OR' }, m2: { nota: 8, tipo: 'OR' }, m3: { nota: 7, tipo: 'OR' }, finalGrade: 8 },
        { materia: 'Historia', m1: { nota: 9, tipo: 'OR' }, m2: { nota: 8, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Inglés', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 10, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Arte', m1: { nota: 8, tipo: 'E1' }, m2: { nota: 9, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 9 },
        { materia: 'Deportes', m1: { nota: 7, tipo: 'OR' }, m2: { nota: 8, tipo: 'OR' }, m3: { nota: 7, tipo: 'OR' }, finalGrade: 7 },
      ],
      average: 8,
    },
    {
      nombre: 'Luis Hernández',
      calificaciones: [
        { materia: 'Matemáticas', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 10, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Programación', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 10, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Física', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 10, tipo: 'OR' }, m3: { nota: 9, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Química', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 9, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Historia', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 10, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Inglés', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 10, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Arte', m1: { nota: 10, tipo: 'OR' }, m2: { nota: 9, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 10 },
        { materia: 'Deportes', m1: { nota: 9, tipo: 'OR' }, m2: { nota: 10, tipo: 'OR' }, m3: { nota: 10, tipo: 'OR' }, finalGrade: 10 },
      ],
      average: 9,
    },
    {
      nombre: 'Pedro Ramírez',
      calificaciones: [
        { materia: 'Matemáticas', m1: { nota: 5, tipo: 'E2' }, m2: { nota: 4, tipo: 'E3' }, m3: { nota: 6, tipo: 'E1' }, finalGrade: 5 },
        { materia: 'Programación', m1: { nota: 6, tipo: 'E1' }, m2: { nota: 5, tipo: 'E1' }, m3: { nota: 6, tipo: 'E1' }, finalGrade: 6 },
        { materia: 'Física', m1: { nota: 4, tipo: 'E3' }, m2: { nota: 5, tipo: 'E2' }, m3: { nota: 4, tipo: 'E3' }, finalGrade: 5 },
        { materia: 'Química', m1: { nota: 5, tipo: 'E2' }, m2: { nota: 5, tipo: 'E2' }, m3: { nota: 4, tipo: 'E3' }, finalGrade: 5 },
        { materia: 'Historia', m1: { nota: 6, tipo: 'E1' }, m2: { nota: 5, tipo: 'E1' }, m3: { nota: 6, tipo: 'E1' }, finalGrade: 6 },
        { materia: 'Inglés', m1: { nota: 7, tipo: 'E1' }, m2: { nota: 6, tipo: 'E1' }, m3: { nota: 6, tipo: 'E1' }, finalGrade: 6 },
        { materia: 'Arte', m1: { nota: 6, tipo: 'E1' }, m2: { nota: 5, tipo: 'E2' }, m3: { nota: 5, tipo: 'E3' }, finalGrade: 5 },
        { materia: 'Deportes', m1: { nota: 5, tipo: 'E3' }, m2: { nota: 4, tipo: 'E3' }, m3: { nota: 5, tipo: 'E3' }, finalGrade: 5 },
      ],
      average: 5,
    },
  ];

  const handleChange = (event) => {
    setEstudiante(event.target.value);
  };

  const estudianteSeleccionado = estudiantes.find((e) => e.nombre === estudiante);

  // Data for the existing student-specific chart (M1, M2, M3 per subject)
  const studentData = estudianteSeleccionado
    ? [
        ['Materia', 'M1', 'M2', 'M3'],
        ...estudianteSeleccionado.calificaciones.map((c) => [c.materia, c.m1.nota, c.m2.nota, c.m3.nota]),
      ]
    : [['Materia', 'M1', 'M2', 'M3'], ['', 0, 0, 0]];

  const studentChartOptions = {
    chart: {
      title: 'Calificaciones por Materia',
      subtitle: 'Comparación de M1, M2 y M3',
    },
    colors: ['#921F45', '#4caf50', '#ffca28'], // Theme color for M1, Green for M2, Yellow for M3
  };

  // Data for the overall group performance chart (grade distribution per subject)
  const groupGradeDistributionData = (() => {
    const subjects = estudiantes[0].calificaciones.map((c) => c.materia); // Get list of subjects
    const gradeRanges = [
      { range: '0-6', min: 0, max: 6 },
      { range: '7-8', min: 7, max: 8 },
      { range: '9-10', min: 9, max: 10 },
    ];

    const data = [['Materia', ...gradeRanges.map((r) => r.range)]];
    subjects.forEach((subject) => {
      const counts = gradeRanges.map((range) => {
        return estudiantes.reduce((sum, student) => {
          const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
          return sum + (grade >= range.min && grade <= range.max ? 1 : 0);
        }, 0);
      });
      data.push([subject, ...counts]);
    });

    return data;
  })();

  // Data for the pass/fail rate per subject chart
  const passFailData = (() => {
    const subjects = estudiantes[0].calificaciones.map((c) => c.materia);
    const data = [['Materia', 'Aprobados', 'Reprobados']];
    subjects.forEach((subject) => {
      const passed = estudiantes.filter((student) => {
        const grade = student.calificaciones.find((c) => c.materia === subject)?.finalGrade || 0;
        return grade >= 7;
      }).length;
      const failed = estudiantes.length - passed;
      data.push([subject, passed, failed]);
    });
    return data;
  })();

  const groupGradeDistributionOptions = {
    chart: {
      title: 'Distribución de Calificaciones por Materia',
      subtitle: 'Número de Estudiantes por Rango de Calificación Final',
    },
    isStacked: true,
    colors: ['#f44336', '#ffca28', '#4caf50'], // Red for 0-6, Yellow for 7-8, Green for 9-10
  };

  const passFailChartOptions = {
    chart: {
      title: 'Tasa de Aprobados y Reprobados por Materia',
      subtitle: 'Número de Estudiantes por Materia',
    },
    colors: ['#4caf50', '#f44336'], // Green for passed, Red for failed
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 4, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography display="flex" variant="h4" fontWeight="bold" justifyContent="center" gutterBottom>
          Grupo Asesorado
        </Typography>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Carrera: Tecnologías de la Información</Typography>
          <Typography variant="body2">Cuatrimestre: 8</Typography>
          <Typography variant="body2">Grupo: B</Typography>
          <Typography variant="body2" gutterBottom>Periodo: 20251</Typography>
        </Box>

        <FormControl fullWidth>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Lista de alumnos
          </Typography>
          <Select value={estudiante} onChange={handleChange}>
            {estudiantes.map((e, index) => (
              <MenuItem sx={{ color: 'text.primary' }} key={index} value={e.nombre}>
                {e.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {estudianteSeleccionado && (
          <>
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
                      <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>{c.materia}</TableCell>
                      <TableCell align="center" sx={{ py: 0.5 }}>
                        <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                          {c.m1.nota}
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                          {c.m1.tipo}
                        </TableCell>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 0.5 }}>
                        <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                          {c.m2.nota}
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                          {c.m2.tipo}
                        </TableCell>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 0.5 }}>
                        <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                          {c.m3.nota}
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                          {c.m3.tipo}
                        </TableCell>
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

            <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
              Desempeño del Estudiante: {estudianteSeleccionado.nombre}
            </Typography>
            <Chart chartType="Bar" width="100%" height="400px" data={studentData} options={studentChartOptions} />
          </>
        )}

        {/* Overall Group Performance Chart */}
        <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
          Distribución de Calificaciones del Grupo por Materia
        </Typography>
        <Chart chartType="Bar" width="100%" height="400px" data={groupGradeDistributionData} options={groupGradeDistributionOptions} />

        {/* Pass/Fail Rate per Subject Chart */}
        <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
          Tasa de Aprobados y Reprobados por Materia
        </Typography>
        <Chart chartType="ColumnChart" width="100%" height="400px" data={passFailData} options={passFailChartOptions} />
      </CardContent>
    </Card>
  );
};

export default ModuloAsesor;