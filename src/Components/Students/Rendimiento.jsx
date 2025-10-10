import { CircularProgress, Card, CardContent, Typography, Box, Grid, useTheme, } from '@mui/material';
import DynamicHistory from './Graphs/DynamicHistory';
import axios from "axios";
import { useState, useEffect } from "react";
import AnimatedGraph from './Graphs/AnimatedGraph';
import { obtenerMatricula } from '../Access/SessionService';

const BaseURL = import.meta.env.VITE_URL_BASE_API;

export default function RendimientoAlumnos() {

    const theme = useTheme();
    const matricula = obtenerMatricula();
    const [data, setData] = useState([]);
    const [promedioGeneral, setPromedioGeneral] = useState(0);

    const fetchDataEStatus = async () => {
        try {
            const response = await axios.get(BaseURL + 'historial', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data.history) {
                const processedData = processHistorialData(response.data.history);
                setPromedioGeneral(processedData.promedioGeneral);
            }
        } catch (error) {
            console.error("Error detected:", error);
        }
    };

    const processHistorialData = (data) => {
        const groupedData = {};
        let totalGeneral = 0;
        let totalMaterias = 0;
        let ultimoCuatrimestre = null;

        // Agrupar por cuatrimestre y calcular promedio
        data.forEach(({ Cuatrimestre, PromedioFinal }) => {
            if (Cuatrimestre && PromedioFinal != null) {
                if (!groupedData[Cuatrimestre]) {
                    groupedData[Cuatrimestre] = { total: 0, count: 0 };
                }
                groupedData[Cuatrimestre].total += PromedioFinal;
                groupedData[Cuatrimestre].count += 1;
            } else {
                console.warn("Datos faltantes o incorrectos:", { Cuatrimestre, PromedioFinal });
            }
        });

        // Identificar el último cuatrimestre
        const cuatrimestres = Object.keys(groupedData).map(Number).sort((a, b) => a - b);
        ultimoCuatrimestre = cuatrimestres[cuatrimestres.length - 1];

        // Verificar si el último cuatrimestre está completo con 3 parciales
        if (groupedData[ultimoCuatrimestre] && groupedData[ultimoCuatrimestre].count !== 3) {
            console.warn(`El último cuatrimestre (${ultimoCuatrimestre}) no tiene los 3 parciales completos, se excluirá del promedio general.`);
            delete groupedData[ultimoCuatrimestre];
        }

        // Crear array en formato para Google Charts
        const result = [["Cuatrimestre", "Promedio"]];
        Object.keys(groupedData).forEach((cuatri) => {
            const promedio = groupedData[cuatri].total / groupedData[cuatri].count;
            result.push([cuatri, parseFloat(promedio.toFixed(2))]);

            // Acumular para el promedio general
            totalGeneral += groupedData[cuatri].total;
            totalMaterias += groupedData[cuatri].count;
        });

        // Calcular el promedio general
        const promedioGeneral = totalMaterias > 0 ? parseFloat((totalGeneral / totalMaterias).toFixed(2)) : 0;

        return {
            chart: result,
            promedioGeneral: promedioGeneral
        };
    };

    // Función para determinar el estatus según el promedio
const getEstatusImage = (promedioFinal) => {
    if (promedioFinal >= 9) {
        // Excelente
        return {
            src: "/src/assets/MEDALLA_PLATA.png", // Reemplaza con la URL de tu imagen
            alt: "Excelente"
        };
    } else if (promedioFinal >= 8) {
        // Bueno
        return {
            src: "/src/assets/MEDALLA_MORADO.png",
            alt: "Bueno"
        };
    } else if (promedioFinal >= 7) {
        // Regular
        return {
            src: "/src/assets/MEDALLA_VERDE.png",
            alt: "Regular"
        };
    } else {
        // Necesita mejorar /src/assets/MEDALLA_VERDE.png
        return {
            src: "/src/assets/MEDALLA_ROJA.png",
            alt: "Necesita mejorar"
        };
    }
};


    const estatus = getEstatusImage(promedioGeneral);


    const fetchData = async () => {
        try {
            const response = await axios.get(BaseURL + 'data', {
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
            fetchDataEStatus();
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
                                <Box component="img" src={estatus.src} alt={estatus.alt} sx={{ width: 50, height: 50, mx: 'auto' }} />
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{estatus.alt}</Typography>
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
