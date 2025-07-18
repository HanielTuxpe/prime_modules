import { CircularProgress, Card, CardContent, Typography, Box, Grid, useTheme } from '@mui/material';
import { Chart } from "react-google-charts";
import axios from "axios";
import { useState, useEffect } from "react";


export default function RendimientoAlumnos({matricula}) {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [promedioGeneral, setPromedioGeneral] = useState(0);
    const [predicciones, setPredicciones] = useState([]);
    const [materiasChartData, setMateriasChartData] = useState({});
    const [currentCuatrimestre, setCurrentCuatrimestre] = useState(1);
    const [loadingMaterias, setLoadingMaterias] = useState(true);

    const fetchDataEStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3000/historial', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data.history) {
                const processedData = processHistorialData(response.data.history);
                setPromedioGeneral(processedData.promedioGeneral);
                setPredicciones(processedData.predicciones);
            }
        } catch (error) {
            console.error("Error detected:", error);
        }
    };

    const fetchMateriasData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/fullHistorial', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data.data) {
                const formattedData = formatMateriasData(response.data.data);
                setMateriasChartData(formattedData);
                const cuatrimestres = Object.keys(formattedData).map(Number).sort((a, b) => a - b);
                setCurrentCuatrimestre(cuatrimestres[0]?.toString() || '1');
                setLoadingMaterias(false);
            }
        } catch (error) {
            console.error("Error detected:", error);
            setLoadingMaterias(false);
        }
    };

    const processHistorialData = (data) => {
        const groupedData = {};
        let totalGeneral = 0;
        let totalMaterias = 0;
        let ultimoCuatrimestre = null;
        const predicciones = [];

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

        // Crear array en formato para Google Charts y generar predicciones
        const result = [["Cuatrimestre", "Promedio"]];
        let previoPromedio = 0;
        Object.keys(groupedData).forEach((cuatri, index) => {
            const promedio = groupedData[cuatri].total / groupedData[cuatri].count;
            result.push([cuatri, parseFloat(promedio.toFixed(2))]);

            // Generar predicción para el cuatrimestre actual
            const prediccion = index === 0 ? 8.0 : parseFloat((previoPromedio + (Math.random() - 0.5) * 0.5).toFixed(2));
            predicciones.push({
                cuatrimestre: cuatri,
                tipoPrediccion: "Promedio General",
                calificacionPredicha: prediccion,
                calificacionReal: parseFloat(promedio.toFixed(2))
            });

            // Acumular para el promedio general
            totalGeneral += groupedData[cuatri].total;
            totalMaterias += groupedData[cuatri].count;
            previoPromedio = promedio;
        });

        // Calcular el promedio general
        const promedioGeneral = totalMaterias > 0 ? parseFloat((totalGeneral / totalMaterias).toFixed(2)) : 0;

        // Agregar predicción para el próximo cuatrimestre (sin calificación real)
        if (ultimoCuatrimestre) {
            const proximoCuatrimestre = ultimoCuatrimestre ;
            predicciones.push({
                cuatrimestre: proximoCuatrimestre.toString(),
                tipoPrediccion: "Promedio General",
                calificacionPredicha: parseFloat((promedioGeneral + (Math.random() - 0.5) * 0.5).toFixed(2)),
                calificacionReal: null
            });
        }

        return {
            chart: result,
            promedioGeneral: promedioGeneral,
            predicciones: predicciones
        };
    };

    const formatMateriasData = (data) => {
        const cuatrimestresData = {};
        let ultimoPromedioPorMateria = {};

        // Procesar datos históricos
        data.forEach(item => {
            const { Cuatrimestre, Materia, PromedioFinal } = item;
            if (!cuatrimestresData[Cuatrimestre]) {
                cuatrimestresData[Cuatrimestre] = [["Materia", "Predicción", "Calificación Real"]];
            }
            // Generar predicción coherente basada en el promedio final anterior
            const prediccion = ultimoPromedioPorMateria[Materia] 
                ? parseFloat((ultimoPromedioPorMateria[Materia] + (Math.random() - 0.5) * 0.5).toFixed(2))
                : PromedioFinal ? parseFloat((PromedioFinal + (Math.random() - 0.5) * 0.5).toFixed(2)) : 8.0;
            const calificacionReal = PromedioFinal ? parseFloat(PromedioFinal.toFixed(2)) : null;
            cuatrimestresData[Cuatrimestre].push([Materia, prediccion, calificacionReal]);
            ultimoPromedioPorMateria[Materia] = calificacionReal || prediccion;
        });

        // Identificar el último cuatrimestre
        const cuatrimestres = Object.keys(cuatrimestresData).map(Number).sort((a, b) => a - b);
        const ultimoCuatrimestre = cuatrimestres[cuatrimestres.length - 1];

        // Agregar el próximo cuatrimestre con predicciones
        if (ultimoCuatrimestre) {
            const proximoCuatrimestre = (ultimoCuatrimestre + 1).toString();
            cuatrimestresData[proximoCuatrimestre] = [["Materia", "Predicción", "Calificación Real"]];
            // Usar las últimas materias del cuatrimestre anterior
            const materiasUltimoCuatri = cuatrimestresData[ultimoCuatrimestre].slice(1).map(row => row[0]);
            materiasUltimoCuatri.forEach(materia => {
                const prediccion = ultimoPromedioPorMateria[materia]
                    ? parseFloat((ultimoPromedioPorMateria[materia] + (Math.random() - 0.5) * 0.5).toFixed(2))
                    : 8.0;
                cuatrimestresData[proximoCuatrimestre].push([materia, prediccion, 0]);
            });
        }

        return cuatrimestresData;
    };

    // Función para determinar el estatus según el promedio
    const getEstatusImage = (promedioFinal) => {
        if (promedioFinal >= 9) {
            return {
                src: "/src/assets/MEDALLA_PLATA.png",
                alt: "Excelente"
            };
        } else if (promedioFinal >= 8) {
            return {
                src: "/src/assets/MEDALLA_MORADO.png",
                alt: "Bueno"
            };
        } else if (promedioFinal >= 7) {
            return {
                src: "/src/assets/MEDALLA_VERDE.png",
                alt: "Regular"
            };
        } else {
            return {
                src: "/src/assets/MEDALLA_ROJA.png",
                alt: "Necesita mejorar"
            };
        }
    };

    const estatus = getEstatusImage(promedioGeneral);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/data', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error detected:", error);
        }
    };

    // Preparar datos para la gráfica de predicciones
    const prediccionesChartData = [
        ["Cuatrimestre", "Calificación Predicha", "Calificación Real"],
        ...predicciones.map(p => [
            p.cuatrimestre,
            p.calificacionPredicha,
            p.calificacionReal !== null ? p.calificacionReal : null
        ])
    ];

    const prediccionesOptions = {
        hAxis: {
            title: "Cuatrimestre",
            gridlines: { count: 6 },
            format: '0',
            textStyle: { color: '#000' }
        },
        vAxis: {
            title: "Calificación",
            minValue: 0,
            maxValue: 10,
            format: '0.0',
            textStyle: { color: '#000' }
        },
        colors: ["#4CAF50", "#1f77b4"], // Verde para predicciones, azul para reales
        pointSize: 5,
        lineWidth: 3,
        bar: { groupWidth: "40%" },
        annotations: {
            alwaysOutside: true,
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#000',
            }
        }
    };

    // Opciones para la gráfica de predicciones de materias por cuatrimestre (ScatterChart)
    const materiasOptions = {
        title: `Predicciones y Calificaciones Reales - ${currentCuatrimestre} Cuatrimestre`,
        hAxis: {
            title: "Materia",
            textStyle: { color: '#000' }
        },
        vAxis: {
            title: "Calificación",
            minValue: 0,
            maxValue: 10,
            format: '0.0',
            textStyle: { color: '#000' }
        },
        legend: { position: "bottom" },
        animation: {
            duration: 2000,
            easing: "out",
        },
        colors: ['#4CAF50', '#1f77b4'], // Verde para predicciones, azul para reales
        pointSize: 8,
        dataOpacity: 0.8,
        annotations: {
            alwaysOutside: true,
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#000',
                auraColor: 'none'
            }
        }
    };

    useEffect(() => {
        if (matricula) {
            fetchDataEStatus();
            fetchData();
            fetchMateriasData();
        }
    }, [matricula]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const keys = Object.keys(materiasChartData).map(Number).sort((a, b) => a - b).map(String);
            if (keys.length > 0) {
                const currentIndex = keys.indexOf(currentCuatrimestre.toString());
                const nextIndex = (currentIndex + 1) % keys.length;
                const nextCuatrimestre = keys[nextIndex];
                setCurrentCuatrimestre(nextCuatrimestre);
            }
        }, 10000);

        return () => clearInterval(intervalId);
    }, [materiasChartData, currentCuatrimestre]);

    if (data.length === 0) {
        return (
            <Box sx={{ p: 4, minHeight: '100vh' }}>
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
                    <Typography sx={{ color: '#000' }} variant="h6" gutterBottom>
                        No hay datos disponibles.
                    </Typography>
                    <Typography sx={{ color: '#000' }} variant="body1">Cargando datos.</Typography>
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
                mb: 4
            }}>
                {/* Encabezado */}
                <Card sx={{ background: 'linear-gradient(to right, #921F45, #C71657)', color: 'white', borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                    {data[0].Nombre} {data[0].APaterno} {data[0].AMaterno}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#fff' }}>
                                    CUATRIMESTRE: {data[0].Cuatrimestre} º | GRUPO: {data[0].Grupo}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#fff' }}>{data[0].NombreCarrera}</Typography>
                            </Grid>
                            <Grid item textAlign="center">
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff' }}>ESTATUS</Typography>
                                <Box component="img" src={estatus.src} alt={estatus.alt} sx={{ width: 50, height: 50, mx: 'auto' }} />
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff' }}>{estatus.alt}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Gráfica de predicciones existente */}
                <Card sx={{
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: theme.palette.paper,
                    mb: 4
                }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ color: '#921F45', fontWeight: 'bold', mb: 2 }}>
                            Historial de Predicciones
                        </Typography>
                        {predicciones.length === 0 ? (
                            <Typography sx={{ color: '#921F45' }} variant="body1">
                                No hay predicciones disponibles.
                            </Typography>
                        ) : (
                            <Box sx={{ minHeight: "400px" }}>
                                <Chart
                                    chartType="ColumnChart"
                                    width="100%"
                                    height="400px"
                                    data={prediccionesChartData}
                                    options={prediccionesOptions}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Gráfica de predicciones y calificaciones reales de materias por cuatrimestre (ScatterChart animado) */}
                <Card sx={{
                    borderRadius: '16px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: theme.palette.paper,
                    mb: 4
                }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ color: '#921F45', fontWeight: 'bold', mb: 2 }}>
                            Predicciones y Calificaciones Reales de Materias por Cuatrimestre
                        </Typography>
                        {loadingMaterias ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box sx={{ minHeight: "400px" }}>
                                {Object.keys(materiasChartData).length === 0 ? (
                                    <Typography sx={{ color: '#921F45' }} variant="body1">
                                        No hay datos disponibles.
                                    </Typography>
                                ) : (
                                    <Chart
                                        chartType="ScatterChart"
                                        width="100%"
                                        height="400px"
                                        data={materiasChartData[currentCuatrimestre] || [["Materia", "Predicción", "Calificación Real"]]}
                                        options={materiasOptions}
                                    />
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>

            </Card>
        </Box>
    );
}