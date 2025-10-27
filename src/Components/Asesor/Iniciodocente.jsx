import React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const InicioView = () => {
  const teacherSchedule = [
    {
      time: '13:20-14:10',
      lunes: { subject: 'Dirección de Equipos de Alto Rendimiento', room: '9A - Salón K9', group: '9A' },
      martes: { subject: 'Dirección de Equipos de Alto Rendimiento', room: '9B - Salón K9', group: '9B' },
      miercoles: { subject: 'Administración de Proyectos de TI', room: '9B - Salón K9', group: '9B' },
      jueves: { subject: 'Administración de Proyectos de TI', room: '9A - Salón K9', group: '9A' },
      viernes: { subject: 'Tutorías', room: '9B - Salón K6', group: '9B' },
    },
    {
      time: '14:10-15:00',
      lunes: { subject: 'Administración de Proyectos de TI', room: '9A - TI', group: '9A' },
      martes: { subject: '', room: '', group: '' },
      miercoles: { subject: '', room: '', group: '' },
      jueves: { subject: 'Tutorías', room: '9A - Salón K6', group: '9A' },
      viernes: { subject: '', room: '', group: '' },
    },
    {
      time: '15:00-15:50',
      lunes: { subject: 'Tutorías', room: '9A - Salón K6', group: '9A' },
      martes: { subject: 'Administración de Proyectos de TI', room: 'TI', group: '9B' },
      miercoles: { subject: '', room: '', group: '' },
      jueves: { subject: 'Dirección de Equipos de Alto Rendimiento', room: '9A - Salón K9', group: '9A' },
      viernes: { subject: '', room: '', group: '' },
    },
    {
      time: '15:50-16:40',
      lunes: { subject: '', room: '', group: '' },
      martes: { subject: '', room: '', group: '' },
      miercoles: { subject: '', room: '', group: '' },
      jueves: { subject: '', room: '', group: '' },
      viernes: { subject: '', room: '', group: '' },
    },
    {
      time: '16:40-17:30',
      lunes: { subject: '', room: '', group: '' },
      martes: { subject: 'Dirección de Equipos de Alto Rendimiento', room: '9B - Salón K9', group: '9B' },
      miercoles: { subject: 'Administración de Proyectos de TI', room: 'TI', group: '9B' },
      jueves: { subject: '', room: '', group: '' },
      viernes: { subject: '', room: '', group: '' },
    },
    {
      time: '17:30-18:20',
      lunes: { subject: '', room: '', group: '' },
      martes: { subject: 'Dirección de Equipos de Alto Rendimiento', room: '9B - Salón K9', group: '9B' },
      miercoles: { subject: 'Administración de Proyectos de TI', room: 'TI', group: '9B' },
      jueves: { subject: '', room: '', group: '' },
      viernes: { subject: '', room: '', group: '' },
    },
    {
      time: '18:20-19:10',
      lunes: { subject: '', room: '', group: '' },
      martes: { subject: '', room: '', group: '' },
      miercoles: { subject: '', room: '', group: '' },
      jueves: { subject: '', room: '', group: '' },
      viernes: { subject: '', room: '', group: '' },
    },
    {
      time: '19:10-20:00',
      lunes: { subject: '', room: '', group: '' },
      martes: { subject: '', room: '', group: '' },
      miercoles: { subject: '', room: '', group: '' },
      jueves: { subject: '', room: '', group: '' },
      viernes: { subject: '', room: '', group: '' },
    },
    {
      time: '20:00-20:50',
      lunes: { subject: '', room: '', group: '' },
      martes: { subject: '', room: '', group: '' },
      miercoles: { subject: '', room: '', group: '' },
      jueves: { subject: '', room: '', group: '' },
      viernes: { subject: '', room: '', group: '' },
    },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
          Universidad Tecnológica de la Huasteca Hidalguense
        </Typography>
        <Typography variant="h6" sx={{ color: '#333' }}>
          Dirección de Tecnologías de la Información
        </Typography>
        <Typography variant="h5" sx={{ color: '#d81b60', fontWeight: 'bold', mt: 1 }}>
          Horario del Docente
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
          Docente: Lic. Beatriz Hernández<br />
          Período: Mayo - Agosto 2025
        </Typography>
      </Box>
      <Paper elevation={6} sx={{ padding: 2, borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2e7d32', color: 'white' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '100px' }}>Hora</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lunes</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Martes</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Miércoles</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Jueves</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Viernes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teacherSchedule.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#e8f5e9',
                  '&:hover': { backgroundColor: '#c8e6c9' },
                }}
              >
                <TableCell sx={{ fontWeight: 'bold' }}>{row.time}</TableCell>
                <TableCell>
                  {row.lunes.subject && (
                    <>
                      {row.lunes.subject}<br />
                      {row.lunes.room && `${row.lunes.room}<br />`}
                      {row.lunes.group}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {row.martes.subject && (
                    <>
                      {row.martes.subject}<br />
                      {row.martes.room && `${row.martes.room}<br />`}
                      {row.martes.group}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {row.miercoles.subject && (
                    <>
                      {row.miercoles.subject}<br />
                      {row.miercoles.room && `${row.miercoles.room}<br />`}
                      {row.miercoles.group}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {row.jueves.subject && (
                    <>
                      {row.jueves.subject}<br />
                      {row.jueves.room && `${row.jueves.room}<br />`}
                      {row.jueves.group}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {row.viernes.subject && (
                    <>
                      {row.viernes.subject}<br />
                      {row.viernes.room && `${row.viernes.room}<br />`}
                      {row.viernes.group}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default InicioView;