import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { CircularProgress, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const AnimatedGraph = ({ matricula }) => {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [currentCuatrimestre, setCurrentCuatrimestre] = useState(1);
    const [cuatrimestres, setCuatrimestres] = useState({});


    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/fullHistorial', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data.data) {
                const formattedData = formatData(response.data.data);
                setCuatrimestres(formattedData);
                setCurrentCuatrimestre(Object.keys(formattedData)[0]);
                setChartData(formattedData[Object.keys(formattedData)[0]]);
            }
        } catch (error) {
            console.error("Error detected:", error);
        }
    };

    const formatData = (data) => {
        const cuatrimestresData = {};
        data.forEach(item => {
            const { Cuatrimestre, Materia, PromedioFinal, Parcial1, Parcial2, Parcial3, Parcial1E1, Parcial2E1, Parcial3E1, Parcial1E2, Parcial2E2, Parcial3E2, Parcial1E3, Parcial2E3, Parcial3E3 } = item;

            let extras = 0;
            // Procesar Parcial1
            if (Parcial1 === 0 || Parcial1 < 6) {
                [Parcial1E1, Parcial1E2, Parcial1E3].forEach((score, index) => {
                    if (score > 6) extras += (index + 1);  // Sumar el extra basado en la posición (1, 2 o 3)
                });
            }

            // Procesar Parcial2
            if (Parcial2 === 0 || Parcial2 < 6) {
                [Parcial2E1, Parcial2E2, Parcial2E3].forEach((score, index) => {
                    if (score > 6) extras += (index + 1);  // Sumar el extra basado en la posición (1, 2 o 3)
                });
            }

            // Procesar Parcial3
            if (Parcial3 === 0 || Parcial3 < 6) {
                [Parcial3E1, Parcial3E2, Parcial3E3].forEach((score, index) => {
                    if (score > 6) extras += (index + 1);  // Sumar el extra basado en la posición (1, 2 o 3)
                });
            }

            if (!cuatrimestresData[Cuatrimestre]) {
                cuatrimestresData[Cuatrimestre] = [["Materia", "Promedio Final", "Cantidad de Extras"]];
            }
            cuatrimestresData[Cuatrimestre].push([Materia, PromedioFinal, extras]);
        });
        return cuatrimestresData;
    };

    useEffect(() => {
        if (matricula) {
            setLoading(true);
            fetchData();
            setLoading(false);
        }
    }, [matricula]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const keys = Object.keys(cuatrimestres);
            const currentIndex = keys.indexOf(currentCuatrimestre.toString());
            const nextIndex = (currentIndex + 1) % keys.length;
            const nextCuatrimestre = keys[nextIndex];
            setCurrentCuatrimestre(nextCuatrimestre);
            setChartData(cuatrimestres[nextCuatrimestre]);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [cuatrimestres, currentCuatrimestre]);

    return (
        <Box sx={{ p: 4, minHeight: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Calificaciones Por Cuatrimestre
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , minHeight: '100%'}}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Chart
                        chartType="ScatterChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={{
                            title: `Calificaciones de ${currentCuatrimestre} Cuatrimestre`,
                            legend: { position: "bottom" },
                            animation: {
                                duration: 2000,
                                easing: "out",
                            },
                            colors: ['#0000ff', '#ff0000'], // Puntos o barras de color azul y rojo
                            //backgroundColor: '#ff6347', 
                    
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

AnimatedGraph.propTypes = {
    matricula: PropTypes.string.isRequired,
};

export default AnimatedGraph;
