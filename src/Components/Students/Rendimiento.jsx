import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import DynamicHistory from "./Graphs/DynamicHistory";
import AnimatedGraph from "./Graphs/AnimatedGraph";
import axios from "axios";
import { useState, useEffect } from "react";
import { obtenerMatricula } from "../Access/SessionService";
import MEDALLA_PLATA from "../../assets/MEDALLA_PLATA.png";
import MEDALLA_MORADO from "../../assets/MEDALLA_MORADO.png";
import MEDALLA_ROJA from "../../assets/MEDALLA_ROJA.png";
import MEDALLA_VERDE from "../../assets/MEDALLA_VERDE.png";

const BaseURL = import.meta.env.VITE_URL_BASE_API;

export default function RendimientoAlumnos() {
  const theme = useTheme();
  const matricula = obtenerMatricula();
  const [data, setData] = useState([]);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // 🔌 Detectar conexión/desconexión en tiempo real
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 🧠 Procesar datos del historial
  const processHistorialData = (data) => {
    const groupedData = {};
    let totalGeneral = 0;
    let totalMaterias = 0;
    let ultimoCuatrimestre = null;

    data.forEach(({ Cuatrimestre, PromedioFinal }) => {
      if (Cuatrimestre && PromedioFinal != null) {
        if (!groupedData[Cuatrimestre]) {
          groupedData[Cuatrimestre] = { total: 0, count: 0 };
        }
        groupedData[Cuatrimestre].total += PromedioFinal;
        groupedData[Cuatrimestre].count += 1;
      }
    });

    const cuatrimestres = Object.keys(groupedData)
      .map(Number)
      .sort((a, b) => a - b);
    ultimoCuatrimestre = cuatrimestres[cuatrimestres.length - 1];

    if (
      groupedData[ultimoCuatrimestre] &&
      groupedData[ultimoCuatrimestre].count !== 3
    ) {
      delete groupedData[ultimoCuatrimestre];
    }

    const result = [["Cuatrimestre", "Promedio"]];
    Object.keys(groupedData).forEach((cuatri) => {
      const promedio = groupedData[cuatri].total / groupedData[cuatri].count;
      result.push([cuatri, parseFloat(promedio.toFixed(2))]);

      totalGeneral += groupedData[cuatri].total;
      totalMaterias += groupedData[cuatri].count;
    });

    const promedioGeneral =
      totalMaterias > 0
        ? parseFloat((totalGeneral / totalMaterias).toFixed(2))
        : 0;

    return {
      chart: result,
      promedioGeneral: promedioGeneral,
    };
  };

  // 🏅 Determinar imagen según promedio
  const getEstatusImage = (promedioFinal) => {
    if (promedioFinal >= 9) return { src: MEDALLA_PLATA, alt: "Excelente" };
    if (promedioFinal >= 8) return { src: MEDALLA_MORADO, alt: "Bueno" };
    if (promedioFinal >= 7) return { src: MEDALLA_VERDE, alt: "Regular" };
    return { src: MEDALLA_ROJA, alt: "Necesita mejorar" };
  };

  const estatus = getEstatusImage(promedioGeneral);

  // 📊 Consultar datos de API o recuperar del almacenamiento
  const fetchDataEStatus = async () => {
    try {
      const response = await axios.get(`${BaseURL}historial`, {
        params: { matricula },
      });

      if (response.status === 200 && response.data.history) {
        const processedData = processHistorialData(response.data.history);
        setPromedioGeneral(processedData.promedioGeneral);

        // Guardar localmente
        localStorage.setItem(
          "historialData",
          JSON.stringify(response.data.history)
        );
        localStorage.setItem("promedioGeneral", processedData.promedioGeneral);
      }
    } catch (error) {
      console.warn("⚠️ Sin conexión, cargando historial guardado...");
      const localHistorial = localStorage.getItem("historialData");
      const localPromedio = localStorage.getItem("promedioGeneral");

      if (localHistorial) {
        const processedData = processHistorialData(
          JSON.parse(localHistorial)
        );
        setPromedioGeneral(localPromedio || processedData.promedioGeneral);
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BaseURL}data`, {
        params: { matricula },
      });

      if (response.status === 200 && response.data.data) {
        setData(response.data.data);

        // Guardar en localStorage
        localStorage.setItem("alumnoData", JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.warn("⚠️ Sin conexión, usando datos locales...");
      const localData = localStorage.getItem("alumnoData");
      if (localData) {
        setData(JSON.parse(localData));
      }
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
      <Box sx={{ p: 4 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
            backgroundColor: theme.palette.paper,
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Typography sx={{ color: "#000" }} variant="h6" gutterBottom>
            No hay datos disponibles.
          </Typography>
          <Typography sx={{ color: "#000" }} variant="body1">
            Cargando datos...
          </Typography>
          <CircularProgress />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      {/* 🔌 Indicador de conexión */}
      {isOffline && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: "12px" }}>
          ⚠️ Estás sin conexión. Se están mostrando los datos guardados.
        </Alert>
      )}

      {/* Tarjeta de información del alumno */}
      <Card
        sx={{
          mb: 4,
          borderRadius: "16px",
          background:
            "linear-gradient(to right, rgb(160, 12, 71), rgb(199, 22, 87))",
          color: "white",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "nowrap",
                  gap: 1,
                }}
              >
                <Box sx={{ minWidth: 0, flexShrink: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: { xs: "0.8rem", sm: "1.2rem" },
                    }}
                  >
                    {data[0].Nombre} {data[0].APaterno} {data[0].AMaterno}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: { xs: "0.6rem", sm: "1.2rem" },
                    }}
                  >
                    CUATRIMESTRE: {data[0].Cuatrimestre}º | GRUPO:{" "}
                    {data[0].Grupo}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginLeft: "auto",
                    flexShrink: 0,
                    gap: 0.5,
                    "& > img": {
                      width: { xs: 30, sm: 50 },
                      height: { xs: 30, sm: 50 },
                    },
                    "& > .MuiTypography-root": {
                      fontSize: { xs: "0.6rem", sm: "0.9rem" },
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    ESTATUS
                  </Typography>
                  <Box component="img" src={estatus.src} alt={estatus.alt} />
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {estatus.alt}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  fontSize: { xs: "0.7rem", sm: "1.2rem" },
                  wordBreak: "break-word",
                }}
              >
                {data[0].NombreCarrera}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
          backgroundColor: theme.palette.background.paper,
          p: { xs: 2, sm: 4 },
        }}
      >
        <DynamicHistory matricula={matricula} />
        <AnimatedGraph matricula={matricula} />
      </Card>
    </Box>
  );
}
