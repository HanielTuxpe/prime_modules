// src/components/Profile.js
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Fade,
  Alert,
  Button,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { obtenerMatricula } from "../Access/SessionService";
import MedicalConsultations from "./Perfil/MedicalConsultations";
import PsychologicalConsultations from "./Perfil/PsychologicalConsultations";
import UserData from "./Perfil/UserData";
import QRScanner from "./Perfil/QRScanner";

// ✅ Agregar URL base
const BaseURL = import.meta.env.VITE_URL_BASE_API;

const Profile = () => {
  const matricula = obtenerMatricula();
  const [studentData, setStudentData] = useState({
    matricula: "",
    nombre: "",
    apaterno: "",
    amaterno: "",
    cuatrimestre: "",
    grupo: "",
    nombreCarrera: "",
    email: "",
    periodo: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [expandedMedical, setExpandedMedical] = useState(null);
  const [expandedPsychological, setExpandedPsychological] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanError, setScanError] = useState(null);

  // 🔌 Control de conexión/desconexión
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

  // 🔹 Cargar datos del alumno y registros guardados
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!isOffline) {
          const response = await axios.get(`${BaseURL}Fulldata/?matricula=${matricula}`);
          if (response.status === 200 && response.data.data) {
            const data = response.data.data[0];
            const newStudentData = {
              matricula: data.Matricula,
              nombre: data.Nombre,
              apaterno: data.APaterno,
              amaterno: data.AMaterno,
              cuatrimestre: data.Cuatrimestre,
              grupo: data.Grupo,
              nombreCarrera: data.NombreCarrera,
              email: data.Email,
              periodo: data.Periodo,
            };
            setStudentData(newStudentData);
            localStorage.setItem("studentData", JSON.stringify(newStudentData));
          } else {
            throw new Error("Datos no válidos recibidos de la API");
          }
        } else {
          console.warn("⚠️ Sin conexión, cargando datos locales...");
          const localData = localStorage.getItem("studentData");
          if (localData) setStudentData(JSON.parse(localData));
          else setError("No hay datos guardados y no hay conexión a internet.");
        }
      } catch (error) {
        console.warn("⚠️ Error al cargar datos, usando respaldo local...");
        const localData = localStorage.getItem("studentData");
        if (localData) setStudentData(JSON.parse(localData));
        else setError("No se pudieron cargar los datos del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    // Cargar registros de asistencia previos
    const savedAttendance = localStorage.getItem("attendanceRecords");
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance));

    // Asignar rendimiento aleatorio (simulado)
    const performances = [
      "Muy Alto Rendimiento",
      "Alto Rendimiento",
      "Rendimiento Medio",
      "Rendimiento Bajo",
    ];
    setSelectedPerformance(performances[Math.floor(Math.random() * performances.length)]);

    if (matricula) fetchStudentData();
  }, [matricula, isOffline]);

  // 🔹 Formateadores
  const formatCuatrimestre = (num) => {
    const n = parseInt(num, 10);
    const nombres = [
      "Primero",
      "Segundo",
      "Tercero",
      "Cuarto",
      "Quinto",
      "Sexto",
      "Séptimo",
      "Octavo",
      "Noveno",
      "Décimo",
    ];
    return isNaN(n) ? num : `${nombres[n - 1]} (${num}°)`;
  };

  const toTitleCase = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const formatPeriodo = (periodo) => {
    if (!periodo) return "N/A";
    const year = periodo.slice(0, 4);
    const term = periodo.slice(4);
    return `${year}-${term}`;
  };

  // 🔹 Expandir / contraer secciones
  const handleMedicalToggle = (index) =>
    setExpandedMedical(expandedMedical === index ? null : index);
  const handlePsychologicalToggle = (index) =>
    setExpandedPsychological(expandedPsychological === index ? null : index);

  // 🔹 Cerrar alertas
  const handleCloseSuccess = () => setScanSuccess(false);
  const handleCloseError = () => setScanError(null);

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, md: 4 },
      }}
      disableGutters
    >
      {/* Alerta Offline */}
      {isOffline && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: "12px", width: "100%" }}>
          ⚠️ Estás sin conexión. Se están mostrando los datos guardados.
        </Alert>
      )}

      {/* Estado de carga */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress sx={{ color: "#921F45" }} />
        </Box>
      ) : error ? (
        <Typography
          color="error"
          variant="h6"
          sx={{ textAlign: "center", color: "#000", fontSize: { xs: 16, sm: 20 } }}
        >
          {error}
        </Typography>
      ) : (
        <Fade in={!loading} timeout={600}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
            {/* Datos y escáner */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
              <QRScanner
                active={scannerActive}
                onScan={(decodedText) => {
                  const validQRCodes = ["Entrada_26/10/2025_asdf", "Salida_26/10/2025_asdr"];
                  if (!validQRCodes.includes(decodedText)) {
                    setScanError("Código QR no válido. Usa un código QR autorizado.");
                    return;
                  }

                  const now = new Date().toLocaleString("es-MX", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                  const type = decodedText.includes("Entrada") ? "Entrada" : "Salida";

                  const lastRecord = attendanceRecords[0];
                  if (lastRecord && lastRecord.type === type) {
                    setScanError(`No se puede registrar ${type} consecutivamente.`);
                    return;
                  }

                  const newRecord = { date: now, type };
                  setAttendanceRecords((prev) => {
                    const updated = [newRecord, ...prev];
                    localStorage.setItem("attendanceRecords", JSON.stringify(updated));
                    return updated;
                  });

                  setScanSuccess(true);

                  // 🔧 Esperar a limpiar cámara
                  setTimeout(() => setScannerActive(false), 400);
                }}
                onError={(error) => {
                  if (!error.includes("No MultiFormat Readers were able to detect the code")) {
                    console.warn("Error al escanear QR:", error);
                  }
                }}
                onStop={() => console.log("Escáner detenido correctamente")}
                scannerActive={scannerActive}
                setScannerActive={setScannerActive}
                scanError={scanError}
                setScanError={setScanError}
                attendanceRecords={attendanceRecords}
                setAttendanceRecords={setAttendanceRecords}
                setScanSuccess={setScanSuccess}
              />

              <UserData
                studentData={studentData}
                toTitleCase={toTitleCase}
                formatCuatrimestre={formatCuatrimestre}
                formatPeriodo={formatPeriodo}
              />
            </Box>

            {/* Consultas médicas y psicológicas */}
            <MedicalConsultations
              selectedPerformance={selectedPerformance}
              expandedMedical={expandedMedical}
              handleMedicalToggle={handleMedicalToggle}
            />

            <PsychologicalConsultations
              selectedPerformance={selectedPerformance}
              expandedPsychological={expandedPsychological}
              handlePsychologicalToggle={handlePsychologicalToggle}
            />
          </Box>
        </Fade>
      )}

      {/* Snackbar de éxito */}
      <Snackbar
        open={scanSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        message={`Registro ${
          attendanceRecords[0]?.type || "Entrada"
        } realizado a las ${
          attendanceRecords[0]?.date ||
          new Date().toLocaleString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        }`}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSuccess}>
            Cerrar
          </Button>
        }
      />

      {/* Snackbar de error */}
      <Snackbar
        open={!!scanError}
        autoHideDuration={3000}
        onClose={handleCloseError}
        message={scanError}
        action={
          <Button color="inherit" size="small" onClick={handleCloseError}>
            Cerrar
          </Button>
        }
      />
    </Container>
  );
};

export default Profile;
