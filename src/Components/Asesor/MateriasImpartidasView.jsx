import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import { Card, CardContent, Typography, FormControl, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MateriasImpartidasView = () => {
  const [materia, setMateria] = useState('');
  const [grupo, setGrupo] = useState('');

  // Sample data for subjects, groups, and student grades
  const materiasData = [
    {
      nombre: 'Dirección de Equipos de Alto Rendimiento',
      grupos: [
        {
          nombre: '9A',
          estudiantes: [
            { nombre: 'Ana López', m1: 8, m2: 9, m3: 8, finalGrade: 8 },
            { nombre: 'Carlos Díaz', m1: 7, m2: 8, m3: 7, finalGrade: 7 },
            { nombre: 'Sofía Martínez', m1: 9, m2: 9, m3: 10, finalGrade: 9 },
          ],
        },
        {
          nombre: '9B',
          estudiantes: [
            { nombre: 'Juan Pérez', m1: 8, m2: 8, m3: 9, finalGrade: 8 },
            { nombre: 'María Gómez', m1: 7, m2: 7, m3: 8, finalGrade: 7 },
            { nombre: 'Luis Hernández', m1: 10, m2: 9, m3: 10, finalGrade: 10 },
          ],
        },
      ],
    },
    {
      nombre: 'Administración de Proyectos de TI',
      grupos: [
        {
          nombre: '9A',
          estudiantes: [
            { nombre: 'Ana López', m1: 9, m2: 8, m3: 9, finalGrade: 9 },
            { nombre: 'Carlos Díaz', m1: 6, m2: 7, m3: 6, finalGrade: 6 },
            { nombre: 'Sofía Martínez', m1: 8, m2: 8, m3: 9, finalGrade: 8 },
          ],
        },
        {
          nombre: '9B',
          estudiantes: [
            { nombre: 'Juan Pérez', m1: 9, m2: 9, m3: 8, finalGrade: 9 },
            { nombre: 'María Gómez', m1: 8, m2: 7, m3: 8, finalGrade: 8 },
            { nombre: 'Luis Hernández', m1: 10, m2: 10, m3: 10, finalGrade: 10 },
          ],
        },
      ],
    },
  ];

  const handleMateriaChange = (event) => {
    setMateria(event.target.value);
    setGrupo(''); // Reset group when subject changes
  };

  const handleGrupoChange = (event) => {
    setGrupo(event.target.value);
  };

  const materiaSeleccionada = materiasData.find((m) => m.nombre === materia);
  const grupoSeleccionado = materiaSeleccionada?.grupos.find((g) => g.nombre === grupo);

  // Data for the overall group performance chart (grade distribution per group)
  const overallGroupData = materiaSeleccionada
    ? (() => {
        const groups = materiaSeleccionada.grupos;
        const gradeRanges = [
          { range: '0-6', min: 0, max: 6 },
          { range: '7-8', min: 7, max: 8 },
          { range: '9-10', min: 9, max: 10 },
        ];

        const data = [['Grupo', ...gradeRanges.map(r => r.range)]];
        groups.forEach(group => {
          const counts = gradeRanges.map(range => {
            return group.estudiantes.filter(e => e.finalGrade >= range.min && e.finalGrade <= range.max).length;
          });
          data.push([group.nombre, ...counts]);
        });

        return data;
      })()
    : [['Grupo', '0-6', '7-8', '9-10'], ['', 0, 0, 0]];

  // Data for the group-specific performance chart (average M1, M2, M3, Final Grade)
  const groupPerformanceData = grupoSeleccionado
    ? (() => {
        const averages = {
          m1: (grupoSeleccionado.estudiantes.reduce((sum, e) => sum + e.m1, 0) / grupoSeleccionado.estudiantes.length).toFixed(1),
          m2: (grupoSeleccionado.estudiantes.reduce((sum, e) => sum + e.m2, 0) / grupoSeleccionado.estudiantes.length).toFixed(1),
          m3: (grupoSeleccionado.estudiantes.reduce((sum, e) => sum + e.m3, 0) / grupoSeleccionado.estudiantes.length).toFixed(1),
          finalGrade: (grupoSeleccionado.estudiantes.reduce((sum, e) => sum + e.finalGrade, 0) / grupoSeleccionado.estudiantes.length).toFixed(1),
        };

        return [
          ['Parcial', 'Promedio'],
          ['M1', parseFloat(averages.m1)],
          ['M2', parseFloat(averages.m2)],
          ['M3', parseFloat(averages.m3)],
          ['Final', parseFloat(averages.finalGrade)],
        ];
      })()
    : [['Parcial', 'Promedio'], ['M1', 0], ['M2', 0], ['M3', 0], ['Final', 0]];

  const overallChartOptions = {
    chart: {
      title: 'Distribución de Calificaciones por Grupo',
      subtitle: 'Número de Estudiantes por Rango de Calificación Final',
    },
    isStacked: true,
    colors: ['#f44336', '#ffca28', '#4caf50'], // Red for 0-6, Yellow for 7-8, Green for 9-10
  };

  const groupChartOptions = {
    chart: {
      title: `Tendencia de Desempeño del Grupo ${grupo || ''} en ${materia || ''}`,
      subtitle: 'Promedio de Calificaciones por Parcial y Final',
    },
    colors: ['#921F45'], // Use the theme color for the line
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', mt: 4, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography display="flex" variant="h4" fontWeight="bold" justifyContent="center" gutterBottom>
          Materias Impartidas
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body2">Docente: Lic. Beatriz Hernández</Typography>
          <Typography variant="body2">Período: Mayo - Agosto 2025</Typography>
        </Box>

        <Box display="flex" gap={2} mb={3}>
          <FormControl fullWidth>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Seleccionar Materia
            </Typography>
            <Select value={materia} onChange={handleMateriaChange}>
              <MenuItem sx={{ color: "text.primary" }} value="">-- Seleccionar --</MenuItem>
              {materiasData.map((m, index) => (
                <MenuItem sx={{ color: "text.primary" }} key={index} value={m.nombre}>
                  {m.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!materia}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Seleccionar Grupo
            </Typography>
            <Select value={grupo} onChange={handleGrupoChange}>
              <MenuItem sx={{ color: "text.primary" }} value="">-- Seleccionar --</MenuItem>
              {materiaSeleccionada?.grupos.map((g, index) => (
                <MenuItem sx={{ color: "text.primary" }} key={index} value={g.nombre}>
                  {g.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {grupoSeleccionado && (
          <>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#921F45', height: '30px' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 0.5 }}>Nombre del Estudiante</TableCell>
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
                  {grupoSeleccionado.estudiantes.map((e, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white', height: '30px' }}>
                      <TableCell sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>{e.nombre}</TableCell>
                      <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                        {e.m1}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                        {e.m2}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#000000', fontWeight: 'bold', py: 0.5 }}>
                        {e.m3}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: e.finalGrade < 7 ? 'red' : 'green', py: 0.5 }}>
                        {e.finalGrade}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" align="right" sx={{ mt: 3, fontWeight: 'bold', color: '#921F45' }}>
              PROMEDIO DEL GRUPO:{' '}
              {(grupoSeleccionado.estudiantes.reduce((sum, e) => sum + e.finalGrade, 0) / grupoSeleccionado.estudiantes.length).toFixed(1)}
            </Typography>
          </>
        )}

        {materiaSeleccionada && (
          <>
            <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
              Distribución de Calificaciones por Grupo
            </Typography>
            <Chart chartType="Bar" width="100%" height="300px" data={overallGroupData} options={overallChartOptions} />
          </>
        )}

        {grupoSeleccionado && (
          <>
            <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold', color: '#921F45' }}>
              Tendencia de Desempeño del Grupo {grupo} en {materia}
            </Typography>
            <Chart chartType="LineChart" width="100%" height="400px" data={groupPerformanceData} options={groupChartOptions} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MateriasImpartidasView;