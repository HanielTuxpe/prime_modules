import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { CircularProgress, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";

const BaseURL = import.meta.env.VITE_URL_BASE_API;

const AnimatedGraph = ({ matricula }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [currentCuatrimestre, setCurrentCuatrimestre] = useState(1);
  const [cuatrimestres, setCuatrimestres] = useState({});

  // Hook to detect screen size and theme
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detects screens smaller than 'sm' (600px)

  const fetchData = async () => {
    try {
      const response = await axios.get(BaseURL + "fullHistorial", {
        params: { matricula: matricula },
      });
      if (response.status === 200 && response.data.data) {
        const formattedData = formatData(response.data.data);
        setCuatrimestres(formattedData);
        setCurrentCuatrimestre(Object.keys(formattedData)[0]);
        setChartData(formattedData[Object.keys(formattedData)[0]]);
      }
    } catch (error) {
      console.error("Error detected:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (data) => {
    const cuatrimestresData = {};
    data.forEach((item) => {
      const {
        Cuatrimestre,
        Materia,
        PromedioFinal,
        Parcial1,
        Parcial2,
        Parcial3,
        Parcial1E1,
        Parcial2E1,
        Parcial3E1,
        Parcial1E2,
        Parcial2E2,
        Parcial3E2,
        Parcial1E3,
        Parcial2E3,
        Parcial3E3,
      } = item;

      let extras = 0;
      // Process Parcial1
      if (Parcial1 === 0 || Parcial1 < 6) {
        [Parcial1E1, Parcial1E2, Parcial1E3].forEach((score, index) => {
          if (score > 6) extras += index + 1; // Add extra based on position (1, 2, or 3)
        });
      }

      // Process Parcial2
      if (Parcial2 === 0 || Parcial2 < 6) {
        [Parcial2E1, Parcial2E2, Parcial2E3].forEach((score, index) => {
          if (score > 6) extras += index + 1; // Add extra based on position (1, 2, or 3)
        });
      }

      // Process Parcial3
      if (Parcial3 === 0 || Parcial3 < 6) {
        [Parcial3E1, Parcial3E2, Parcial3E3].forEach((score, index) => {
          if (score > 6) extras += index + 1; // Add extra based on position (1, 2, or 3)
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
    }, isMobile ? 12000 : 10000); // Slower animation interval on mobile for performance

    return () => clearInterval(intervalId);
  }, [cuatrimestres, currentCuatrimestre, isMobile]);

  // Responsive chart options
  const options = {
    title: `${currentCuatrimestre} Cuatrimestre`,
    titleTextStyle: {
      fontSize: isMobile ? 14 : 16, // Smaller title on mobile
      bold: true,
    },
    legend: {
      position: isMobile ? "top" : "bottom", // Legend at top on mobile to save space
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
    },
    animation: {
      duration: isMobile ? 1500 : 2000, // Faster animation on mobile
      easing: "out",
    },
    colors: ["#0000ff", "#ff0000"], // Blue and red for points
    hAxis: {
      title: "Materia",
      titleTextStyle: {
        fontSize: isMobile ? 12 : 14,
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
    pointSize: isMobile ? 5 : 7, // Smaller points on mobile
    chartArea: {
      width: isMobile ? "85%" : "80%", // More width on mobile
      height: isMobile ? "70%" : "80%", // Less height on mobile
    },
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4, // Less padding on mobile
        minHeight: isMobile ? "300px" : "400px", // Smaller height on mobile
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h5"} // Smaller title on mobile
        gutterBottom
        sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
      >
        Calificaciones Por Cuatrimestre
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: isMobile ? "250px" : "350px", // Adjust container height
        }}
      >
        {loading ? (
          <CircularProgress size={isMobile ? 30 : 40} /> // Smaller loader on mobile
        ) : (
          <Chart
            chartType="ScatterChart"
            width="100%"
            height={isMobile ? "200px" : "400px"} // Smaller chart height on mobile
            data={chartData}
            options={options}
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