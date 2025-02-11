import { CircularProgress, Card, CardContent, Typography, Box, Grid, useTheme, } from '@mui/material';
import DynamicHistory from './Graphs/DynamicHistory';
import axios from "axios";
import { useState, useEffect } from "react";
import AnimatedGraph from './Graphs/AnimatedGraph';

export default function RendimientoAlumnos() {

    const theme = useTheme();
    const matricula = '20221269';
    const [data, setData] = useState([]);


    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/data', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error detected:", error);  // Verificar el error exacto
        }
    };

    useEffect(() => {
        if (matricula) {
            fetchData();
        }
    }, [matricula]);

    if (data.length === 0) {
        return (
            <Box sx={{ p: 4, minHeight: '100vh', }}>
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: theme.palette.paper,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                }}>
                    <Typography sx={{color: '#000'}} variant="h6" gutterBottom>
                        No hay datos disponibles.
                    </Typography>
                    <Typography sx={{color: '#000'}} variant="body1">Cargando datos.</Typography>
                    <CircularProgress />
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, minHeight: '100vh' }}>
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
                                    {data[0].Nombre}&nbsp;{data[0].APaterno}&nbsp;{data[0].AMaterno}
                                </Typography>
                                <Typography variant="body1">CUATRIMESTRE: {data[0].Cuatrimestre} º &nbsp; | &nbsp; GRUPO: {data[0].Grupo} </Typography>
                                <Typography variant="body1">{data[0].NombreCarrera}</Typography>
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

                   
                    {/* Gráfico de barras */}
                    <DynamicHistory matricula={matricula} />

                    {/* Gráfico Dinámico */}

                    <AnimatedGraph matricula={matricula} />

                </center>
            </Card>
        </Box>
    );
}
