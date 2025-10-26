import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { obtenerMatricula } from '../Access/SessionService';

const BaseURL = import.meta.env.VITE_URL_BASE_API;

const StudentGrades = () => {
  const [student, setStudent] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [cuatrimestresData, setCuatrimestresData] = useState({});
  const [promedioCuatrimestre, setPromedioCuatrimestre] = useState({});
  const [periodos, setPeriodos] = useState({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const matricula = obtenerMatricula();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cuatrimestreMap = {
    '1': '1ro. CUATRIMESTRE',
    '2': '2do. CUATRIMESTRE',
    '3': '3ro. CUATRIMESTRE',
    '4': '4to. CUATRIMESTRE',
    '5': '5to. CUATRIMESTRE',
    '6': '6to. CUATRIMESTRE',
    '7': '7mo. CUATRIMESTRE',
    '8': '8vo. CUATRIMESTRE',
    '9': '9no. CUATRIMESTRE',
    '10': '10mo. CUATRIMESTRE',
    '11': '11vo. CUATRIMESTRE',
    '12': '12vo. CUATRIMESTRE',
  };

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

  // Cargar datos iniciales y selectedSemester desde localStorage
  useEffect(() => {
    if (matricula) {
      fetchData();
      fetchDataHistorial();
      // Cargar selectedSemester desde localStorage
      const savedSemester = localStorage.getItem('selectedSemester');
      if (savedSemester) {
        setSelectedSemester(savedSemester);
      }
    }
  }, [matricula, isOffline]);

  // Actualizar selectedSemester y guardarlo en localStorage
  useEffect(() => {
    if (Object.keys(cuatrimestresData).length > 0) {
      const cuatrimestres = Object.keys(cuatrimestresData);
      const mostRecentCuatrimestre = cuatrimestres[cuatrimestres.length - 1];
      setSelectedSemester((prev) => {
        const newSemester = prev || mostRecentCuatrimestre;
        localStorage.setItem('selectedSemester', newSemester);
        return newSemester;
      });
    }
  }, [cuatrimestresData]);

  const fetchData = async () => {
    try {
      if (!isOffline) {
        const response = await axios.get(`${BaseURL}data`, { params: { matricula } });
        if (response.status === 200 && response.data?.data) {
          const studentData = response.data.data[0];
          setStudent(studentData);
          // Guardar en localStorage solo si hay datos válidos
          localStorage.setItem('studentData', JSON.stringify(studentData));
        } else {
          console.warn('No se encontraron datos del estudiante.');
          const localData = localStorage.getItem('studentData');
          if (localData) {
            setStudent(JSON.parse(localData));
          }
        }
      } else {
        console.warn('⚠️ Sin conexión, cargando datos guardados...');
        const localData = localStorage.getItem('studentData');
        if (localData) {
          setStudent(JSON.parse(localData));
        }
      }
    } catch (error) {
      console.warn('⚠️ Error al cargar datos, intentando con datos locales...');
      const localData = localStorage.getItem('studentData');
      if (localData) {
        setStudent(JSON.parse(localData));
      } else {
        console.error('Error al obtener datos:', error);
      }
    }
  };

  const fetchDataHistorial = async () => {
    try {
      if (!isOffline) {
        const response = await axios.get(`${BaseURL}fullHistorial`, { params: { matricula } });
        if (response.status === 200 && response.data?.data) {
          const formattedData = formatData(response.data.data);
          setCuatrimestresData(formattedData);
          // Guardar en localStorage solo si hay datos válidos
          localStorage.setItem('cuatrimestresData', JSON.stringify(formattedData));
          localStorage.setItem('promedioCuatrimestre', JSON.stringify(promedioCuatrimestre));
          localStorage.setItem('periodos', JSON.stringify(periodos));
        } else {
          console.warn('No se encontraron datos de historial.');
          const localCuatrimestres = localStorage.getItem('cuatrimestresData');
          const localPromedio = localStorage.getItem('promedioCuatrimestre');
          const localPeriodos = localStorage.getItem('periodos');
          if (localCuatrimestres && localPromedio && localPeriodos) {
            setCuatrimestresData(JSON.parse(localCuatrimestres));
            setPromedioCuatrimestre(JSON.parse(localPromedio));
            setPeriodos(JSON.parse(localPeriodos));
          }
        }
      } else {
        console.warn('⚠️ Sin conexión, cargando historial guardado...');
        const localCuatrimestres = localStorage.getItem('cuatrimestresData');
        const localPromedio = localStorage.getItem('promedioCuatrimestre');
        const localPeriodos = localStorage.getItem('periodos');
        if (localCuatrimestres && localPromedio && localPeriodos) {
          setCuatrimestresData(JSON.parse(localCuatrimestres));
          setPromedioCuatrimestre(JSON.parse(localPromedio));
          setPeriodos(JSON.parse(localPeriodos));
        }
      }
    } catch (error) {
      console.warn('⚠️ Error al cargar historial, intentando con datos locales...');
      const localCuatrimestres = localStorage.getItem('cuatrimestresData');
      const localPromedio = localStorage.getItem('promedioCuatrimestre');
      const localPeriodos = localStorage.getItem('periodos');
      if (localCuatrimestres && localPromedio && localPeriodos) {
        setCuatrimestresData(JSON.parse(localCuatrimestres));
        setPromedioCuatrimestre(JSON.parse(localPromedio));
        setPeriodos(JSON.parse(localPeriodos));
      } else {
        console.error('Error al obtener historial:', error);
      }
    }
  };

  const formatData = (data) => {
    const formattedData = {};
    const promedioCuatrimestre = {};
    const periodos = {};

    data.forEach((item) => {
      const {
        Cuatrimestre,
        Materia,
        PromedioFinal,
        Parcial1,
        Parcial2,
        Parcial3,
        Parcial1E1,
        Parcial1E2,
        Parcial1E3,
        Parcial2E1,
        Parcial2E2,
        Parcial2E3,
        Parcial3E1,
        Parcial3E2,
        Parcial3E3,
        Periodo,
      } = item;

      const cuatrimestreNombre = cuatrimestreMap[Cuatrimestre] || Cuatrimestre;

      const getBestScore = (normal, E1, E2, E3) => {
        if (normal >= 6) return { tipo: 'OR', calificacion: normal };
        if (E1 >= 6) return { tipo: 'E1', calificacion: E1 };
        if (E2 >= 6) return { tipo: 'E2', calificacion: E2 };
        if (E3 >= 6) return { tipo: 'E3', calificacion: E3 };
        return { tipo: 'N/A', calificacion: normal };
      };

      const parcial1 = getBestScore(Parcial1, Parcial1E1, Parcial1E2, Parcial1E3);
      const parcial2 = getBestScore(Parcial2, Parcial2E1, Parcial2E2, Parcial2E3);
      const parcial3 = getBestScore(Parcial3, Parcial3E1, Parcial3E2, Parcial3E3);

      if (!formattedData[cuatrimestreNombre]) {
        formattedData[cuatrimestreNombre] = { materias: [], promedioFinal: 0, count: 0 };
        periodos[cuatrimestreNombre] = Periodo || '';
      }

      formattedData[cuatrimestreNombre].materias.push({
        materia: Materia,
        parcial1,
        parcial2,
        parcial3,
        promedioFinal: PromedioFinal,
      });

      formattedData[cuatrimestreNombre].promedioFinal += PromedioFinal;
      formattedData[cuatrimestreNombre].count += 1;
    });

    Object.keys(formattedData).forEach((cuatrimestre) => {
      const cuatrimestreData = formattedData[cuatrimestre];
      const promedio = cuatrimestreData.promedioFinal / cuatrimestreData.count;
      promedioCuatrimestre[cuatrimestre] = promedio;
      delete cuatrimestreData.count;
      delete cuatrimestreData.promedioFinal;
    });

    setPromedioCuatrimestre(promedioCuatrimestre);
    setPeriodos(periodos);
    localStorage.setItem('promedioCuatrimestre', JSON.stringify(promedioCuatrimestre));
    localStorage.setItem('periodos', JSON.stringify(periodos));
    return formattedData;
  };

  const addHeader = (doc, title, cuatrimestre) => {
    let yOffset = 40;

    doc.setFontSize(12);
    doc.setFont('Times New Roman', 'normal');
    doc.setTextColor(0, 0, 0);
    const uniText = 'UNIVERSIDAD TECNOLÓGICA DE LA HUASTECA HIDALGUENSE';
    const uniTextWidth = doc.getTextWidth(uniText);
    const uniXPosition = (doc.internal.pageSize.getWidth() - uniTextWidth) / 2;
    doc.text(uniText, uniXPosition, yOffset);
    yOffset += 10;

    const imgLeft = '/src/assets/LOGO_TI.png';
    const imgRight = '/src/assets/uthh.png';
    const imgWidth = 20;
    const imgHeight = 20;
    const margin = 10;
    try {
      doc.addImage(imgLeft, 'PNG', margin, yOffset - 10, imgWidth - 5, imgHeight - 5);
      doc.addImage(imgRight, 'PNG', doc.internal.pageSize.width - imgWidth - margin, yOffset - 10, imgWidth, imgHeight);
    } catch (error) {
      console.warn('⚠️ Imágenes no disponibles offline, generando PDF sin logos:', error);
    }
    yOffset += 10;

    const subtitle = title;
    const subtitleWidth = doc.getTextWidth(subtitle);
    const subtitleXPosition = (doc.internal.pageSize.getWidth() - subtitleWidth) / 2;
    doc.text(subtitle, subtitleXPosition, yOffset);
    yOffset += 10;

    doc.setFontSize(10);
    const pageWidth = doc.internal.pageSize.getWidth();
    const carreraText = `CARRERA: ${student?.NombreCarrera || ''}`;
    const grupoText = `GRUPO: ${student?.Grupo || ''}`;
    const periodoText = `PERIODO: ${periodos[cuatrimestre] || ''}`;
    const alumnoText = `ALUMNO: ${student?.Nombre || ''} ${student?.APaterno || ''} ${student?.AMaterno || ''}`;
    const matriculaText = `MATRÍCULA: ${matricula || ''}`;

    let carreraWidth = doc.getTextWidth(carreraText);
    if (carreraWidth > pageWidth - 20) {
      const splitCarreraText = doc.splitTextToSize(carreraText, pageWidth - 20);
      doc.text(splitCarreraText, 10, yOffset);
      yOffset += splitCarreraText.length * 5;
    } else {
      doc.text(carreraText, 10, yOffset);
      yOffset += 7;
    }

    doc.text(alumnoText, 10, yOffset);
    doc.text(matriculaText, pageWidth - doc.getTextWidth(matriculaText) - 10, yOffset);
    yOffset += 7;

    doc.text(grupoText, 10, yOffset);
    doc.text(periodoText, pageWidth - doc.getTextWidth(periodoText) - 10, yOffset);
    yOffset += 2;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, yOffset, pageWidth - 10, yOffset);
    yOffset += 5;

    return yOffset;
  };

  const generatePDF = () => {
    if (!student || Object.keys(cuatrimestresData).length === 0) {
      alert('No hay datos para generar el PDF.');
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxTableHeight = pageHeight - 40;

    let yOffset = 0;
    let tableCount = 0;

    Object.keys(cuatrimestresData).forEach((cuatrimestre, index) => {
      const estimatedTableHeight = 10 + (cuatrimestresData[cuatrimestre].materias.length * 6) + 10;
      if (yOffset + estimatedTableHeight > maxTableHeight || tableCount >= 2) {
        doc.addPage();
        yOffset = addHeader(doc, 'HISTORIAL ACADÉMICO', cuatrimestre);
        tableCount = 0;
      } else if (index === 0) {
        yOffset = addHeader(doc, 'HISTORIAL ACADÉMICO', cuatrimestre);
      }

      doc.setFont('Times New Roman', 'bold');
      doc.setFontSize(8);
      doc.text(`Cuatrimestre: ${cuatrimestre} (Periodo: ${periodos[cuatrimestre] || ''})`, 10, yOffset);
      yOffset += 6;

      doc.setFontSize(7);
      doc.autoTable({
        startY: yOffset,
        head: [['Materia', 'Parcial 1', 'Parcial 2', 'Parcial 3', 'Promedio Final']],
        body: cuatrimestresData[cuatrimestre].materias.map((subject) => [
          subject.materia,
          `${subject.parcial1.calificacion} ${subject.parcial1.tipo}`,
          `${subject.parcial2.calificacion} ${subject.parcial2.tipo}`,
          `${subject.parcial3.calificacion} ${subject.parcial3.tipo}`,
          subject.promedioFinal,
        ]),
        headStyles: {
          fillColor: '#921F45',
          textColor: '#FFFFFF',
          fontSize: 7,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 0.5,
        },
        styles: {
          fontSize: 6,
          halign: 'center',
          cellPadding: 0.5,
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
        },
        margin: { left: 40 },
      });

      yOffset = doc.lastAutoTable.finalY + 6;
      const promedioFinal = promedioCuatrimestre[cuatrimestre]?.toFixed(2) || '';
      doc.text(`Promedio Final del ${cuatrimestre}: ${promedioFinal}`, 10, yOffset);
      yOffset += 10;
      tableCount++;
    });

    // Descarga robusta para offline y PWAs
    const pdfOutput = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfOutput);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'Historial.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const generatePDFCuatrimestreActual = () => {
    if (!student || Object.keys(cuatrimestresData).length === 0) {
      alert('No hay datos para generar el PDF.');
      return;
    }

    const doc = new jsPDF();
    let yOffset = addHeader(doc, 'BOLETA DE CALIFICACIONES', selectedSemester);

    doc.setFontSize(8);
    doc.text(`CUATRIMESTRE: ${selectedSemester}`, 10, yOffset);
    yOffset += 2;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, yOffset, doc.internal.pageSize.getWidth() - 10, yOffset);
    yOffset += 5;

    doc.autoTable({
      startY: yOffset,
      head: [['Materias', 'Parcial 1', 'Parcial 2', 'Parcial 3', 'Promedio Final']],
      body: cuatrimestresData[selectedSemester].materias.map((subject) => [
        subject.materia,
        `${subject.parcial1.calificacion} ${subject.parcial1.tipo}`,
        `${subject.parcial2.calificacion} ${subject.parcial2.tipo}`,
        `${subject.parcial3.calificacion} ${subject.parcial3.tipo}`,
        subject.promedioFinal,
      ]),
      headStyles: {
        fillColor: '#921F45',
        textColor: '#FFFFFF',
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 0.5,
      },
      styles: {
        fontSize: 6,
        halign: 'center',
        cellPadding: 0.5,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
      },
      margin: { left: 40 },
    });

    yOffset = doc.lastAutoTable.finalY + 6;
    const promedioFinal = promedioCuatrimestre[selectedSemester]?.toFixed(2) || '';
    doc.text(`Promedio Final del ${selectedSemester}: ${promedioFinal}`, 10, yOffset);

    // Descarga robusta para offline y PWAs
    const pdfOutput = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfOutput);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'Boleta.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  // Mostrar mensaje de carga si no hay datos
  if (!student && !localStorage.getItem('studentData')) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: '100vh' }}>
      {/* 🔌 Indicador de conexión */}
      {isOffline && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
          ⚠️ Estás sin conexión. Se están mostrando los datos guardados.
        </Alert>
      )}

      <Card
        sx={{
          maxWidth: '100%',
          margin: 'auto',
          mt: { xs: 2, sm: 4 },
          boxShadow: 3,
          padding: { xs: 1, sm: 2 },
          borderRadius: '1%',
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary',
              fontSize: { xs: 14, sm: 16 },
              mb: 1,
            }}
          >
            ALUMNO: {student?.Nombre || ''} {student?.APaterno || ''} {student?.AMaterno || ''}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary',
              fontSize: { xs: 14, sm: 16 },
              mb: 1,
            }}
          >
            CARRERA: {student?.NombreCarrera || ''}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary',
              fontSize: { xs: 14, sm: 16 },
              mb: 1,
            }}
          >
            GRUPO: {student?.Grupo || ''}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary',
              fontSize: { xs: 14, sm: 16 },
              mb: 1,
            }}
          >
            PERIODO: {periodos[selectedSemester] || ''}
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontSize: { xs: 12, sm: 14 }, mb: 1 }}
          >
            <strong>CUATRIMESTRE:</strong>
            <Select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                localStorage.setItem('selectedSemester', e.target.value);
              }}
              sx={{ ml: 1, fontSize: { xs: 12, sm: 14 }, width: { xs: '80%', sm: 'auto' } }}
            >
              {Object.keys(cuatrimestresData).map((cuatri, index) => (
                <MenuItem
                  sx={{
                    fontSize: { xs: 12, sm: 14 },
                    color: 'black',
                  }}
                  key={index}
                  value={cuatri}
                >
                  {cuatri} (Periodo: {periodos[cuatri] || ''})
                </MenuItem>
              ))}
            </Select>
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-around',
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, fontSize: { xs: 12, sm: 14 } }}
              onClick={generatePDF}
              disabled={!student || Object.keys(cuatrimestresData).length === 0}
            >
              Generar PDF De Historial
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, fontSize: { xs: 12, sm: 14 } }}
              onClick={generatePDFCuatrimestreActual}
              disabled={!student || Object.keys(cuatrimestresData).length === 0}
            >
              Generar PDF Del Cuatrimestre Actual
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              mt: 3,
              border: '1px solid #921F45',
              overflowX: 'auto',
            }}
          >
            <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#921F45' }}>
                  <TableCell
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 0.3,
                      fontSize: { xs: 10, sm: 14 },
                      width: { xs: '60%', sm: 'auto' },
                    }}
                  >
                    Materia
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 0.3,
                      fontSize: { xs: 8, sm: 14 },
                      width: { xs: '15%', sm: 'auto' },
                    }}
                  >
                    {isMobile ? 'P1' : 'Parcial 1'}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 0.3,
                      fontSize: { xs: 8, sm: 14 },
                      width: { xs: '15%', sm: 'auto' },
                    }}
                  >
                    {isMobile ? 'P2' : 'Parcial 2'}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 0.3,
                      fontSize: { xs: 8, sm: 14 },
                      width: { xs: '15%', sm: 'auto' },
                    }}
                  >
                    {isMobile ? 'P3' : 'Parcial 3'}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 0.3,
                      fontSize: { xs: 8, sm: 14 },
                      width: { xs: '15%', sm: 'auto' },
                    }}
                  >
                    {isMobile ? 'PF' : 'Promedio Final'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cuatrimestresData[selectedSemester]?.materias?.map((subject, index) => (
                  <TableRow
                    key={index}
                    sx={{ backgroundColor: index % 2 === 0 ? '#D9D9D9' : 'white' }}
                  >
                    <TableCell
                      sx={{
                        color: '#000000',
                        fontWeight: 'bold',
                        py: 0.3,
                        fontSize: { xs: 8, sm: 15 },
                      }}
                    >
                      {subject.materia}
                    </TableCell>
                    {[subject.parcial1, subject.parcial2, subject.parcial3].map((parcial, idx) => (
                      <TableCell
                        key={idx}
                        sx={{
                          color: parcial.calificacion < 7 ? 'red' : '#000000',
                          fontWeight: 'bold',
                          py: 0.3,
                          fontSize: { xs: 7, sm: 12 },
                        }}
                        align="center"
                      >
                        {parcial.calificacion} {parcial.tipo}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        color: subject.promedioFinal < 7 ? 'red' : '#000000',
                        fontWeight: 'bold',
                        py: 0.3,
                        fontSize: { xs: 7, sm: 12 },
                      }}
                      align="center"
                    >
                      {subject.promedioFinal}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentGrades;