import React from 'react';
import { Chart } from 'react-google-charts';
import { Card, CardContent, Typography, Box, Grid, useTheme, } from '@mui/material';



export default function RendimientoAlumnos() {

    const theme = useTheme();
    // Datos para el gráfico de rendimiento (gráfico de área apilada)
    const datosRendimiento = [
        ['Cuatrimestre', 'Ordinario', 'Extras'],
        ['1', 7, 3],
        ['2', 8, 2],
        ['3', 8, 1],
        ['4', 9, 0],
        ['5', 10, 0],
        ['6', 7, 4],
        ['7', 9, 1],
    ];

    const opcionesRendimiento = {
        title: 'Rendimiento del Alumno',
        hAxis: { title: 'Cuatrimestre' },
        vAxis: { title: 'Calificación' },
        isStacked: true,
        areaOpacity: 0.4,
        colors: ['#1f77b4', '#ff7f0e'],
        legend: { position: 'top' },
        //backgroundColor: { fill: 'transparent' }, // Fondo transparente
    };

    // Datos para el gráfico de barras (longitud de exámenes)
    const datosExamenes = [
        ['Duración (minutos)', 'Cantidad de Exámenes'],
        ['10', 15],
        ['20', 5],
        ['30', 4],
        ['40', 2],
        ['50', 1],
    ];

    const opcionesExamenes = {
        title: 'Duración de Exámenes, en minutos',
        hAxis: { title: 'Duración (minutos)' },
        vAxis: { title: 'Cantidad' },
        colors: ['#6a1b9a'],
        legend: 'none',
        //backgroundColor: { fill: 'transparent' }, // Fondo transparente
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', }}>
            <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: theme.palette.paper,
            }}>


                {/* Encabezado */}
                <Card sx={{ background: 'linear-gradient(to right,rgb(160, 12, 71),rgb(199, 22, 87))', color: 'white', borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    NOMBRE COMPLETO DEL ALUMNO
                                </Typography>
                                <Typography variant="body1">CUATRIMESTRE: 7º &nbsp; | &nbsp; GRUPO: B</Typography>
                                <Typography variant="body1">Ingeniería en Desarrollo y Gestión de Software</Typography>
                            </Grid>
                            <Grid item textAlign="center">
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>ESTATUS</Typography>
                                <Box component="img" src="/src/assets/MEDALLA_VERDE.png" alt="Excelencia" sx={{ width: 50, height: 50, mx: 'auto' }} />
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>EXCELENCIA</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <center>

                    {/* Gráfico de área apilada */}
                    <Chart
                        chartType="AreaChart"
                        width="100%"
                        height="400px"
                        data={datosRendimiento}
                        options={opcionesRendimiento}
                    />

                    {/* Gráfico de barras */}
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="400px"
                        data={datosExamenes}
                        options={opcionesExamenes}
                    />


                </center>
            </Card>
        </Box>
    );
}
