// src/components/Perfil/QRScanner.js
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({
  scannerActive,
  setScannerActive,
  scanError,
  setScanError,
  attendanceRecords,
  setAttendanceRecords,
  setScanSuccess,
}) => {
  const readerContainer = useRef(null);
  const html5QrcodeRef = useRef(null);
  const [lastScannedCode, setLastScannedCode] = useState(null); // Controlar el último código escaneado
  const [isProcessing, setIsProcessing] = useState(false); // Evitar escaneos simultáneos

  // 🧩 Iniciar y detener escáner
  useEffect(() => {
    if (!scannerActive) return;

    let canceled = false;
    const start = async () => {
      try {
        // Crear contenedor dinámico para el escáner
        const el = document.createElement("div");
        el.id = "qr-reader";
        el.style.width = "100%";
        el.style.height = "100%";
        readerContainer.current.appendChild(el);

        const html5Qrcode = new Html5Qrcode(el.id, {
          verbose: false, // Reducir logs innecesarios
        });
        html5QrcodeRef.current = html5Qrcode;

        // Asegurar dimensiones mínimas del contenedor
        const container = readerContainer.current;
        container.style.width = "100%";
        container.style.height = "300px"; // Dimensiones explícitas
        container.style.minWidth = "250px"; // Evitar ancho 0
        container.style.minHeight = "250px";

        await html5Qrcode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
          (decodedText) => handleScan(decodedText),
          handleError
        );
      } catch (err) {
        if (!canceled) {
        
          setScanError("No se pudo acceder a la cámara. Verifica permisos.");
        }
      }
    };

    start();

    // 🔹 Limpieza al desmontar o cuando scannerActive cambia
    return () => {
      canceled = true;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerActive]);

  const stopScanner = async () => {
    const instance = html5QrcodeRef.current;
    if (!instance) return;

    try {
      if (instance.isScanning) {
        await instance.stop();
      }
      await instance.clear();
    } catch (err) {
    
    } finally {
      // 🔹 Limpiar contenedor DOM
      if (readerContainer.current) {
        readerContainer.current.innerHTML = "";
      }
      html5QrcodeRef.current = null;
      setScannerActive(false);
      setIsProcessing(false);
    }
  };

  const handleScan = async (decodedText) => {
    if (isProcessing || decodedText === lastScannedCode) return; // Evitar escaneos simultáneos o repetidos
    setIsProcessing(true);

    try {
      const valid = ["Entrada_26/10/2025_asdf", "Salida_26/10/2025_asdr"];
      if (!valid.includes(decodedText)) {
        setScanError("Código QR no válido.");
        setIsProcessing(false);
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

      const last = attendanceRecords[0];
      if (last && last.type === type) {
        setScanError(`No se puede registrar ${type} consecutivamente.`);
        setIsProcessing(false);
        return;
      }

      const newRecord = { date: now, type };
      const updated = [newRecord, ...attendanceRecords];
      localStorage.setItem("attendanceRecords", JSON.stringify(updated));
      setAttendanceRecords(updated);
      setLastScannedCode(decodedText); // Guardar el último código escaneado
      setScanSuccess(true);
     

      // Detener y reactivar después de un retraso
      await stopScanner();
      setTimeout(() => {
        setScannerActive(true);
        setLastScannedCode(null); // Resetear para permitir nuevo escaneo del mismo código
      }, 1000); // Aumentar retraso para estabilidad
    } catch (err) {
     
      setScanError("Error al procesar el código QR.");
      setIsProcessing(false);
    }
  };

  const handleError = (err) => {
    // Ignorar errores comunes de lectura fallida
    if (
      !err.includes("No MultiFormat Readers were able to detect the code") &&
      !err.includes("QR code decode failed") &&
      !err.includes("IndexSizeError")
    ) {
     
    }
  };

  return (
    <Card
      sx={{
        flex: 1,
        width: { xs: "100%", md: "35%" },
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: "#fff",
        p: { xs: 2, sm: 3 },
      }}
    >
      <CardContent sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#921F45",
            mb: 2,
          }}
        >
          Escaneo para Registro
        </Typography>

        {!scannerActive ? (
          <Button
            variant="contained"
            sx={{
              bgcolor: "#921F45",
              color: "#fff",
              "&:hover": { bgcolor: "#7a1a38" },
              mb: 2,
            }}
            onClick={() => setScannerActive(true)}
          >
            Iniciar Escaneo
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{
              bgcolor: "#921F45",
              color: "#fff",
              "&:hover": { bgcolor: "#7a1a38" },
              mb: 2,
            }}
            onClick={stopScanner}
          >
            Detener Escaneo
          </Button>
        )}

        {/* contenedor DOM aislado */}
        <Box
          ref={readerContainer}
          sx={{
            width: "100%",
            maxWidth: 360,
            height: 300,
            minWidth: 250, // Asegurar dimensiones mínimas
            minHeight: 250,
            borderRadius: 3,
            overflow: "hidden",
            border: "3px solid #921F45",
            background: "#000",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            margin: "0 auto",
          }}
        />

        {scanError && (
          <Alert
            severity="error"
            sx={{ mt: 2, borderRadius: 1 }}
            onClose={() => setScanError(null)}
          >
            {scanError}
          </Alert>
        )}

        {/* registros */}
        <Box sx={{ width: "100%", mt: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#921F45", mb: 2 }}
          >
            Registro de Entrada y Salida
          </Typography>
          <Box
            sx={{
              maxHeight: 250,
              overflowY: "auto",
              bgcolor: "#f9f9f9",
              borderRadius: 1,
              p: 1,
            }}
          >
            <List>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((r, i) => (
                  <ListItem key={i} sx={{ bgcolor: "#fff", mb: 1 }}>
                    <ListItemText
                      primary={r.date}
                      secondary={`Tipo: ${r.type}`}
                      primaryTypographyProps={{ sx: { color: "#000" } }} // Texto primario en negro
                      secondaryTypographyProps={{ sx: { color: "#000" } }} // Texto secundario en negro
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", color: "#000" }}>
                  No hay registros.
                </Typography>
              )}
            </List>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QRScanner;