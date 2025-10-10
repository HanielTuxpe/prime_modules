import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { CircularProgress, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const BaseURL = import.meta.env.VITE_URL_BASE_API;

const DynamicHistory = ({ matricula }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promedioGeneral, setPromedioGeneral] = useState(0);

    const fetchData = async () => {
        try {
            const response = await axios.get(BaseURL + 'historial', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data.history) {
                const processedData = processHistorialData(response.data.history);
                setChartData(processedData.chart);
                setPromedioGeneral(processedData.promedioGeneral);
            }
        } catch (error) {
            console.error("Error detected:", error);
        }
    };

    useEffect(() => {
        if (matricula) {
            setLoading(true);
            fetchData().finally(() => setLoading(false));
        }
    }, [matricula]);

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

    const options = {
        hAxis: {
            title: "Cuatrimestre",
            gridlines: { count: 6 },
            format: '0',
        },
        vAxis: {
            title: "Promedio Final",
            minValue: 0,
            maxValue: 10,
            format: '0.0',
        },
        colors: ["#1f77b4"],
        pointSize: 5,
        lineWidth: 3,
        bar: { groupWidth: "75%" },
        annotations: {
            alwaysOutside: true,
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#000',
            }
        }
    };

    return (
        <Box sx={{ minHeight: "400px" }}>
            <Typography variant="h6" gutterBottom>
                Historial de Promedios por Cuatrimestre
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Promedio General: {promedioGeneral}
                    </Typography>

                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={options}
                    />

                </>
            )}
        </Box>
    );
};

DynamicHistory.propTypes = {
    matricula: PropTypes.string.isRequired,
};

export default DynamicHistory;
