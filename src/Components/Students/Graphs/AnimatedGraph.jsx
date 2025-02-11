import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { CircularProgress, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";


const AnimatedGraph = ({ matricula }) => {

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/fullHistorial', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data.data) {
                setChartData(response.data.data);
            }
        } catch (error) {
            console.error("Error detected:", error);  // Verificar el error exacto
        }
    };
    

    useEffect(() => {
        if (matricula) {
            setLoading(true);
            fetchData();
            setLoading(false);
        }
    }, [matricula]);

    const [Cuatrimestre7, setCuatrimestre7] = useState([
        ["Materia", "Ordinario", "Extras"],
        ["mate", 9, 0],
        ["poo", 10, 0],
        ["TI", 9, 0],
        ["EOS", 10, 0],
        ["HIstoria", 9, 0],
        ["Robotica", 0, 7],
    ]);

    const [Cuatrimestre8, setCuatrimestre8] = useState([
        ["Materia", "Ordinario", "Extras"],
        ["mate", 0, 7],
        ["poo", 0, 7],
        ["TI", 8, 0],
        ["EOS", 8, 0],
        ["HIstoria", 0, 7],
        ["Robotica", 0, 6],
    ]);

    
    // Estado para los datos de la gráfica
    const [chartData, setChartData] = useState(Cuatrimestre7);

    // Cambiar los datos de la gráfica cada 5 segundos
    useEffect(() => {
        const intervalId = setInterval(() => {
            setChartData(prevData => (prevData === Cuatrimestre7 ? Cuatrimestre8 : Cuatrimestre7));
        }, 5000); // Cambia cada 2 segundos

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box sx={{ p: 4, minHeight: '100vh', }}>
            <Typography variant="h4" gutterBottom>
                Gráfica de Historial de Calificaciones
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                {/* Gráfico de dispersión que alterna entre chartData y chartData2 */}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Chart
                        chartType="ScatterChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={{
                            title: "Calificaciones Por Cuatrimestre",
                            legend: { position: "bottom" },
                            animation: {
                                duration: 2000,
                                easing: "out",
                            },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

AnimatedGraph.propTypes = {
    matricula: PropTypes.string.isRequired,  // Cambiar a string en lugar de func
};


export default AnimatedGraph;