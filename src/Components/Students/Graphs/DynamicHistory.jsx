import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { CircularProgress, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";

const BaseURL = import.meta.env.VITE_URL_BASE_API;

const DynamicHistory = ({ matricula }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promedioGeneral, setPromedioGeneral] = useState(0);

  // Hook to detect screen size and theme
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detects screens smaller than 'sm' (600px)

  const fetchData = async () => {
    try {
      const response = await axios.get(BaseURL + "historial", {
        params: { matricula: matricula },
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

    // Group by cuatrimestre and calculate average
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

    // Identify the last cuatrimestre
    const cuatrimestres = Object.keys(groupedData)
      .map(Number)
      .sort((a, b) => a - b);
    ultimoCuatrimestre = cuatrimestres[cuatrimestres.length - 1];

    // Check if the last cuatrimestre has 3 partials
    if (groupedData[ultimoCuatrimestre] && groupedData[ultimoCuatrimestre].count !== 3) {
      console.warn(
        `El último cuatrimestre (${ultimoCuatrimestre}) no tiene los 3 parciales completos, se excluirá del promedio general.`
      );
      delete groupedData[ultimoCuatrimestre];
    }

    // Create array for Google Charts
    const result = [["Cuatrimestre", "Promedio"]];
    Object.keys(groupedData).forEach((cuatri) => {
      const promedio = groupedData[cuatri].total / groupedData[cuatri].count;
      result.push([cuatri, parseFloat(promedio.toFixed(2))]);

      // Accumulate for general average
      totalGeneral += groupedData[cuatri].total;
      totalMaterias += groupedData[cuatri].count;
    });

    // Calculate general average
    const promedioGeneral = totalMaterias > 0 ? parseFloat((totalGeneral / totalMaterias).toFixed(2)) : 0;

    return {
      chart: result,
      promedioGeneral: promedioGeneral,
    };
  };

  // Responsive chart options
  const options = {
    hAxis: {
      title: "Cuatrimestre",
      gridlines: { count: isMobile ? 4 : 6 }, // Fewer gridlines on mobile
      format: "0",
      titleTextStyle: {
        fontSize: isMobile ? 12 : 14, // Smaller font on mobile
      },
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
    },
    vAxis: {
      title: "Promedio Final",
      minValue: 0,
      maxValue: 10,
      format: "0.0",
      titleTextStyle: {
        fontSize: isMobile ? 12 : 14,
      },
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
    },
    colors: ["#1f77b4"],
    pointSize: isMobile ? 3 : 5, // Smaller points on mobile
    lineWidth: isMobile ? 2 : 3, // Thinner lines on mobile
    bar: { groupWidth: isMobile ? "60%" : "75%" }, // Narrower bars on mobile
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: isMobile ? 10 : 14,
        bold: true,
        color: "#000",
      },
    },
    legend: {
      position: isMobile ? "top" : "right", // Move legend to top on mobile
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
    },
    chartArea: {
      width: isMobile ? "85%" : "80%", // More space on mobile
      height: isMobile ? "70%" : "80%",
    },
  };

  return (
    <Box
      sx={{
        minHeight: isMobile ? "300px" : "400px", // Smaller height on mobile
        padding: isMobile ? 2 : 3, // Less padding on mobile
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h6"} // Smaller title on mobile
        gutterBottom
        sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
      >
        Historial de Promedios por Cuatrimestre
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={isMobile ? 30 : 40} /> {/* Smaller loader on mobile */}
        </Box>
      ) : (
        <>
          <Typography
            variant={isMobile ? "h6" : "h6"}
            sx={{ mt: isMobile ? 1 : 2, fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
            Promedio General: {promedioGeneral}
          </Typography>

          <Chart
            chartType="ColumnChart"
            width="100%"
            height={isMobile ? "200px" : "400px"} // Smaller chart height on mobile
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