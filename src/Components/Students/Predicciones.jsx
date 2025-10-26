import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { obtenerMatricula } from '../Access/SessionService';

import MEDALLA_PLATA from "../../assets/MEDALLA_PLATA.png";
import MEDALLA_MORADO from "../../assets/MEDALLA_MORADO.png";
import MEDALLA_ROJA from "../../assets/MEDALLA_ROJA.png";
import MEDALLA_VERDE from "../../assets/MEDALLA_VERDE.png";

export default function RendimientoAlumnos() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detects screens smaller than 'sm' (600px)
  const matricula = obtenerMatricula();
  const [data, setData] = useState([]);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [predicciones, setPredicciones] = useState([]);
  const [materiasChartData, setMateriasChartData] = useState({});
  const [currentCuatrimestre, setCurrentCuatrimestre] = useState(1);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const BaseURL = import.meta.env.VITE_URL_BASE_API;

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

  const fetchDataEStatus = async () => {
    try {
      if (!isOffline) {
        const response = await axios.get(`${BaseURL}historial`, {
          params: { matricula },
        });
        if (response.status === 200 && response.data.history) {
          const processedData = processHistorialData(response.data.history);
          setPromedioGeneral(processedData.promedioGeneral);
          setPredicciones(processedData.predicciones);
          // Guardar en localStorage
          localStorage.setItem('historialData', JSON.stringify(response.data.history));
          localStorage.setItem('promedioGeneral', processedData.promedioGeneral);
          localStorage.setItem('predicciones', JSON.stringify(processedData.predicciones));
        }
      } else {
        console.warn('⚠️ Sin conexión, cargando historial guardado...');
        const localHistorial = localStorage.getItem('historialData');
        const localPromedio = localStorage.getItem('promedioGeneral');
        const localPredicciones = localStorage.getItem('predicciones');
        if (localHistorial) {
          const processedData = processHistorialData(JSON.parse(localHistorial));
          setPromedioGeneral(localPromedio ? parseFloat(localPromedio) : processedData.promedioGeneral);
          setPredicciones(localPredicciones ? JSON.parse(localPredicciones) : processedData.predicciones);
        }
      }
    } catch (error) {
      console.warn('⚠️ Error al cargar historial, intentando con datos locales...');
      const localHistorial = localStorage.getItem('historialData');
      const localPromedio = localStorage.getItem('promedioGeneral');
      const localPredicciones = localStorage.getItem('predicciones');
      if (localHistorial) {
        const processedData = processHistorialData(JSON.parse(localHistorial));
        setPromedioGeneral(localPromedio ? parseFloat(localPromedio) : processedData.promedioGeneral);
        setPredicciones(localPredicciones ? JSON.parse(localPredicciones) : processedData.predicciones);
      } else {
        console.error('Error detected:', error);
      }
    }
  };

  const fetchMateriasData = async () => {
    try {
      setLoadingMaterias(true);
      if (!isOffline) {
        const response = await axios.get(`${BaseURL}fullHistorial`, {
          params: { matricula },
        });
        if (response.status === 200 && response.data.data) {
          const formattedData = formatMateriasData(response.data.data);
          setMateriasChartData(formattedData);
          const cuatrimestres = Object.keys(formattedData).map(Number).sort((a, b) => a - b);
          setCurrentCuatrimestre(cuatrimestres[0]?.toString() || '1');
          // Guardar en localStorage
          localStorage.setItem('materiasData', JSON.stringify(formattedData));
        }
      } else {
        console.warn('⚠️ Sin conexión, cargando materias guardadas...');
        const localMaterias = localStorage.getItem('materiasData');
        if (localMaterias) {
          const formattedData = JSON.parse(localMaterias);
          setMateriasChartData(formattedData);
          const cuatrimestres = Object.keys(formattedData).map(Number).sort((a, b) => a - b);
          setCurrentCuatrimestre(cuatrimestres[0]?.toString() || '1');
        }
      }
    } catch (error) {
      console.warn('⚠️ Error al cargar materias, intentando con datos locales...');
      const localMaterias = localStorage.getItem('materiasData');
      if (localMaterias) {
        const formattedData = JSON.parse(localMaterias);
        setMateriasChartData(formattedData);
        const cuatrimestres = Object.keys(formattedData).map(Number).sort((a, b) => a - b);
        setCurrentCuatrimestre(cuatrimestres[0]?.toString() || '1');
      } else {
        console.error('Error detected:', error);
      }
    } finally {
      setLoadingMaterias(false);
    }
  };

  const fetchData = async () => {
    try {
      if (!isOffline) {
        const response = await axios.get(`${BaseURL}data`, {
          params: { matricula },
        });
        if (response.status === 200 && response.data.data) {
          setData(response.data.data);
          // Guardar en localStorage
          localStorage.setItem('alumnoData', JSON.stringify(response.data.data));
        }
      } else {
        console.warn('⚠️ Sin conexión, usando datos locales...');
        const localData = localStorage.getItem('alumnoData');
        if (localData) {
          setData(JSON.parse(localData));
        }
      }
    } catch (error) {
      console.warn('⚠️ Error al cargar datos, usando datos locales...');
      const localData = localStorage.getItem('alumnoData');
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        console.error('Error detected:', error);
      }
    }
  };

  const processHistorialData = (data) => {
    const groupedData = {};
    let totalGeneral = 0;
    let totalMaterias = 0;
    let ultimoCuatrimestre = null;
    const predicciones = [];

    // Group by cuatrimestre and calculate average
    data.forEach(({ Cuatrimestre, PromedioFinal }) => {
      if (Cuatrimestre && PromedioFinal != null) {
        if (!groupedData[Cuatrimestre]) {
          groupedData[Cuatrimestre] = { total: 0, count: 0 };
        }
        groupedData[Cuatrimestre].total += PromedioFinal;
        groupedData[Cuatrimestre].count += 1;
      } else {
        console.warn('Datos faltantes o incorrectos:', { Cuatrimestre, PromedioFinal });
      }
    });

    // Identify the last cuatrimestre
    const cuatrimestres = Object.keys(groupedData).map(Number).sort((a, b) => a - b);
    ultimoCuatrimestre = cuatrimestres[cuatrimestres.length - 1];

    // Check if the last cuatrimestre has 3 partials
    if (groupedData[ultimoCuatrimestre] && groupedData[ultimoCuatrimestre].count !== 3) {
      console.warn(
        `El último cuatrimestre (${ultimoCuatrimestre}) no tiene los 3 parciales completos, se excluirá del promedio general.`
      );
      delete groupedData[ultimoCuatrimestre];
    }

    // Create array for Google Charts and generate predictions
    const result = [['Cuatrimestre', 'Promedio']];
    let previoPromedio = 0;
    Object.keys(groupedData).forEach((cuatri, index) => {
      const promedio = groupedData[cuatri].total / groupedData[cuatri].count;
      result.push([cuatri, parseFloat(promedio.toFixed(2))]);

      // Generate prediction for the current cuatrimestre
      const prediccion = index === 0 ? 8.0 : parseFloat((previoPromedio + (Math.random() - 0.5) * 0.5).toFixed(2));
      predicciones.push({
        cuatrimestre: cuatri,
        tipoPrediccion: 'Promedio General',
        calificacionPredicha: prediccion,
        calificacionReal: parseFloat(promedio.toFixed(2)),
      });

      // Accumulate for general average
      totalGeneral += groupedData[cuatri].total;
      totalMaterias += groupedData[cuatri].count;
      previoPromedio = promedio;
    });

    // Calculate general average
    const promedioGeneral = totalMaterias > 0 ? parseFloat((totalGeneral / totalMaterias).toFixed(2)) : 0;

    // Add prediction for the next cuatrimestre (no real grade)
    if (ultimoCuatrimestre) {
      const proximoCuatrimestre = ultimoCuatrimestre;
      predicciones.push({
        cuatrimestre: proximoCuatrimestre.toString(),
        tipoPrediccion: 'Promedio General',
        calificacionPredicha: parseFloat((promedioGeneral + (Math.random() - 0.5) * 0.5).toFixed(2)),
        calificacionReal: null,
      });
    }

    return {
      chart: result,
      promedioGeneral: promedioGeneral,
      predicciones: predicciones,
    };
  };

  const formatMateriasData = (data) => {
    const cuatrimestresData = {};
    let ultimoPromedioPorMateria = {};

    // Process historical data
    data.forEach((item) => {
      const { Cuatrimestre, Materia, PromedioFinal } = item;
      if (!cuatrimestresData[Cuatrimestre]) {
        cuatrimestresData[Cuatrimestre] = [['Materia', 'Predicción', 'Calificación Real']];
      }
      // Generate coherent prediction based on previous final grade
      const prediccion = ultimoPromedioPorMateria[Materia]
        ? parseFloat((ultimoPromedioPorMateria[Materia] + (Math.random() - 0.5) * 0.5).toFixed(2))
        : PromedioFinal
          ? parseFloat((PromedioFinal + (Math.random() - 0.5) * 0.5).toFixed(2))
          : 8.0;
      const calificacionReal = PromedioFinal ? parseFloat(PromedioFinal.toFixed(2)) : null;
      cuatrimestresData[Cuatrimestre].push([Materia, prediccion, calificacionReal]);
      ultimoPromedioPorMateria[Materia] = calificacionReal || prediccion;
    });

    // Identify the last cuatrimestre
    const cuatrimestres = Object.keys(cuatrimestresData).map(Number).sort((a, b) => a - b);
    const ultimoCuatrimestre = cuatrimestres[cuatrimestres.length - 1];

    // Add the next cuatrimestre with predictions
    if (ultimoCuatrimestre) {
      const proximoCuatrimestre = (ultimoCuatrimestre + 1).toString();
      cuatrimestresData[proximoCuatrimestre] = [['Materia', 'Predicción', 'Calificación Real']];
      // Use the last cuatrimestre's subjects
      const materiasUltimoCuatri = cuatrimestresData[ultimoCuatrimestre].slice(1).map((row) => row[0]);
      materiasUltimoCuatri.forEach((materia) => {
        const prediccion = ultimoPromedioPorMateria[materia]
          ? parseFloat((ultimoPromedioPorMateria[materia] + (Math.random() - 0.5) * 0.5).toFixed(2))
          : 8.0;
        cuatrimestresData[proximoCuatrimestre].push([materia, prediccion, 0]);
      });
    }

    return cuatrimestresData;
  };

 // 🏅 Determinar imagen según promedio
  const getEstatusImage = (promedioFinal) => {
    if (promedioFinal >= 9) return { src: MEDALLA_PLATA, alt: "Excelente" };
    if (promedioFinal >= 8) return { src: MEDALLA_MORADO, alt: "Bueno" };
    if (promedioFinal >= 7) return { src: MEDALLA_VERDE, alt: "Regular" };
    return { src: MEDALLA_ROJA, alt: "Necesita mejorar" };
  };


  const estatus = getEstatusImage(promedioGeneral);

  // Prepare data for predictions chart
  const prediccionesChartData = [
    ['Cuatrimestre', 'Calificación Predicha', 'Calificación Real'],
    ...predicciones.map((p) => [
      p.cuatrimestre,
      p.calificacionPredicha,
      p.calificacionReal !== null ? p.calificacionReal : null,
    ]),
  ];

  // Responsive chart options for predictions
  const prediccionesOptions = {
    hAxis: {
      title: 'Cuatrimestre',
      gridlines: { count: isMobile ? 4 : 6 }, // Fewer gridlines on mobile
      format: '0',
      titleTextStyle: {
        fontSize: isMobile ? 12 : 14,
      },
      textStyle: {
        fontSize: isMobile ? 10 : 12,
        color: '#000',
      },
    },
    vAxis: {
      title: 'Calificación',
      minValue: 0,
      maxValue: 10,
      format: '0.0',
      titleTextStyle: {
        fontSize: isMobile ? 12 : 14,
      },
      textStyle: {
        fontSize: isMobile ? 10 : 12,
        color: '#000',
      },
    },
    colors: ['#4CAF50', '#1f77b4'], // Green for predictions, blue for real grades
    pointSize: isMobile ? 3 : 5, // Smaller points on mobile
    lineWidth: isMobile ? 2 : 3, // Thinner lines on mobile
    bar: { groupWidth: isMobile ? '30%' : '40%' }, // Narrower bars on mobile
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: isMobile ? 10 : 14,
        bold: true,
        color: '#000',
      },
    },
    legend: {
      position: isMobile ? 'top' : 'bottom', // Legend at top on mobile
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
    },
    chartArea: {
      width: isMobile ? '85%' : '80%', // More width on mobile
      height: isMobile ? '70%' : '80%', // Less height on mobile
    },
  };

  // Responsive chart options for materias (ScatterChart)
  const materiasOptions = {
    title: `${currentCuatrimestre} Cuatrimestre`,
    titleTextStyle: {
      fontSize: isMobile ? 14 : 16, // Smaller title on mobile
      bold: true,
      color: '#921F45',
    },
    hAxis: {
      title: 'Materia',
      titleTextStyle: {
        fontSize: isMobile ? 12 : 14,
        color: '#000',
      },
      textStyle: {
        fontSize: isMobile ? 10 : 12,
        color: '#000',
      },
    },
    vAxis: {
      title: 'Calificación',
      minValue: 0,
      maxValue: 10,
      format: '0.0',
      titleTextStyle: {
        fontSize: isMobile ? 12 : 14,
        color: '#000',
      },
      textStyle: {
        fontSize: isMobile ? 10 : 12,
        color: '#000',
      },
    },
    legend: {
      position: isMobile ? 'top' : 'bottom', // Legend at top on mobile
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
    },
    animation: {
      duration: isMobile ? 1500 : 2000, // Faster animation on mobile
      easing: 'out',
    },
    colors: ['#4CAF50', '#1f77b4'], // Green for predictions, blue for real grades
    pointSize: isMobile ? 5 : 8, // Smaller points on mobile
    dataOpacity: 0.8,
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: isMobile ? 10 : 14,
        bold: true,
        color: '#000',
        auraColor: 'none',
      },
    },
    chartArea: {
      width: isMobile ? '85%' : '80%', // More width on mobile
      height: isMobile ? '70%' : '80%', // Less height on mobile
    },
  };

  useEffect(() => {
    if (matricula) {
      fetchDataEStatus();
      fetchData();
      fetchMateriasData();
    }
  }, [matricula, isOffline]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const keys = Object.keys(materiasChartData).map(Number).sort((a, b) => a - b).map(String);
      if (keys.length > 0) {
        const currentIndex = keys.indexOf(currentCuatrimestre.toString());
        const nextIndex = (currentIndex + 1) % keys.length;
        const nextCuatrimestre = keys[nextIndex];
        setCurrentCuatrimestre(nextCuatrimestre);
      }
    }, isMobile ? 12000 : 10000); // Slower interval on mobile for performance

    return () => clearInterval(intervalId);
  }, [materiasChartData, currentCuatrimestre, isMobile]);

  if (data.length === 0 && !localStorage.getItem('alumnoData')) {
    return (
      <Box sx={{ p: isMobile ? 2 : 4, minHeight: '100vh' }}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            backgroundColor: theme.palette.paper,
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? 2 : 4,
          }}
        >
          <Typography sx={{ color: '#000' }} variant={isMobile ? 'h6' : 'h5'} gutterBottom>
            No hay datos disponibles.
          </Typography>
          <Typography sx={{ color: '#000' }} variant="body1">
            Cargando datos...
          </Typography>
          <CircularProgress size={isMobile ? 30 : 40} />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 4, minHeight: '100vh' }}>
      {/* 🔌 Indicador de conexión */}
      {isOffline && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
          ⚠️ Estás sin conexión. Se están mostrando los datos guardados.
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          backgroundColor: theme.palette.paper,
        }}
      >
        {/* Tarjeta de datos del alumno */}
        <Card
          sx={{
            mb: 4,
            borderRadius: '16px',
            background: 'linear-gradient(to right, rgb(160, 12, 71), rgb(199, 22, 87))',
            color: 'white',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap',
                    gap: 1,
                    minWidth: 0, // Allows flex items to shrink
                  }}
                >
                  <Box sx={{ minWidth: 0, flexShrink: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: { xs: '0.8rem', sm: '1.2rem' },
                      }}
                    >
                      {data[0]?.Nombre} {data[0]?.APaterno} {data[0]?.AMaterno}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: { xs: '0.6rem', sm: '1.2rem' },
                      }}
                    >
                      CUATRIMESTRE: {data[0]?.Cuatrimestre}º | GRUPO: {data[0]?.Grupo}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      flexShrink: 0,
                      gap: 0.5,
                      '& > img': {
                        width: { xs: 30, sm: 50 },
                        height: { xs: 30, sm: 50 },
                      },
                      '& > .MuiTypography-root': {
                        fontSize: { xs: '0.6rem', sm: '0.9rem' },
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ESTATUS
                    </Typography>
                    <Box component="img" src={estatus.src} alt={estatus.alt} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {estatus.alt}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    fontSize: { xs: '0.7rem', sm: '1.2rem' },
                    wordBreak: 'break-word',
                  }}
                >
                  {data[0]?.NombreCarrera}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Gráfica de predicciones existente */}
        <Card
          sx={{
            borderRadius: '16px',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            backgroundColor: theme.palette.paper,
          }}
        >
          <CardContent>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                color: '#921F45',
                fontWeight: 'bold',
                fontSize: isMobile ? '1rem' : '1.25rem',
              }}
            >
              Historial de Predicciones
            </Typography>
            {predicciones.length === 0 ? (
              <Typography sx={{ color: '#921F45' }} variant="body1">
                No hay predicciones disponibles.
              </Typography>
            ) : (
              <Box sx={{ minHeight: isMobile ? '200px' : '400px' }}>
                <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height={isMobile ? '200px' : '400px'}
                  data={prediccionesChartData}
                  options={prediccionesOptions}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Gráfica de predicciones y calificaciones reales de materias por cuatrimestre */}
        <Card
          sx={{
            borderRadius: '16px',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            backgroundColor: theme.palette.paper,
            mb: isMobile ? 2 : 4,
          }}
        >
          <CardContent>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                color: '#921F45',
                fontWeight: 'bold',
                mb: isMobile ? 1 : 2,
                fontSize: isMobile ? '1rem' : '1.25rem',
              }}
            >
              Predicciones y Calificaciones Reales de Materias por Cuatrimestre
            </Typography>
            {loadingMaterias ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: isMobile ? '200px' : '400px' }}>
                <CircularProgress size={isMobile ? 30 : 40} />
              </Box>
            ) : (
              <Box sx={{ minHeight: isMobile ? '200px' : '400px' }}>
                {Object.keys(materiasChartData).length === 0 ? (
                  <Typography sx={{ color: '#921F45' }} variant="body1">
                    No hay datos disponibles.
                  </Typography>
                ) : (
                  <Chart
                    chartType="ScatterChart"
                    width="100%"
                    height={isMobile ? '200px' : '400px'}
                    data={materiasChartData[currentCuatrimestre] || [['Materia', 'Predicción', 'Calificación Real']]}
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