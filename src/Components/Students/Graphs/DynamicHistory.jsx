import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { CircularProgress, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const DynamicHistory = ({ matricula }) => {

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/historial', {
                params: { matricula: matricula }
            });
            if (response.status === 200 && response.data.history) {
                const processedData = processHistorialData(response.data.history);
                setChartData(processedData);
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

    const processHistorialData = (data) => {
        const groupedData = {};

    
        // Agrupar por cuatrimestre y calcular promedio
        data.forEach(({ Cuatrimestre, PromedioFinal }) => {
            if (Cuatrimestre && PromedioFinal != null) {  // Verificar que no sean nulos o indefinidos
                if (!groupedData[Cuatrimestre]) {
                    groupedData[Cuatrimestre] = { total: 0, count: 0 };
                }
                groupedData[Cuatrimestre].total += PromedioFinal;
                groupedData[Cuatrimestre].count += 1;
            } else {
                console.warn("Datos faltantes o incorrectos:", { Cuatrimestre, PromedioFinal });
            }
        });
    
        // Crear array en formato para Google Charts
        const result = [["Cuatrimestre", "Promedio"]];
        Object.keys(groupedData).forEach((cuatri) => {
            const promedio = groupedData[cuatri].total / groupedData[cuatri].count;
            result.push([cuatri, parseFloat(promedio.toFixed(2))]);
        });
    
        return result;
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
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={chartData}
                    options={options}  
                />
            )}
        </Box>
    );
    
};

DynamicHistory.propTypes = {
    matricula: PropTypes.string.isRequired,  // Cambiar a string en lugar de func
};


export default DynamicHistory;
