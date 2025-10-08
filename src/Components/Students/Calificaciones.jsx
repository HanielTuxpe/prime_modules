import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { obtenerMatricula } from '../Access/SessionService'; 

const StudentGrades = () => {
    const [student, setStudent] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState("");
    const matricula = obtenerMatricula();
    const [cuatrimestresData, setCuatrimestresData] = useState({});
    const [promedioCuatrimestre, setPromedioCuatrimestre] = useState({});
    const [periodos, setPeriodos] = useState({}); // Store periods per cuatrimestre

    const cuatrimestreMap = {
        "1": "1ro. CUATRIMESTRE",
        "2": "2do. CUATRIMESTRE",
        "3": "3ro. CUATRIMESTRE",
        "4": "4to. CUATRIMESTRE",
        "5": "5to. CUATRIMESTRE",
        "6": "6to. CUATRIMESTRE",
        "7": "7mo. CUATRIMESTRE",
        "8": "8vo. CUATRIMESTRE",
        "9": "9no. CUATRIMESTRE",
        "10": "10mo. CUATRIMESTRE",
        "11": "11vo. CUATRIMESTRE",
        "12": "12vo. CUATRIMESTRE"
    };

    useEffect(() => {
        fetchData();
        fetchDataHistorial();
    }, []);

    useEffect(() => {
        if (Object.keys(cuatrimestresData).length > 0) {
            const cuatrimestres = Object.keys(cuatrimestresData);
            const mostRecentCuatrimestre = cuatrimestres[cuatrimestres.length - 1];
            setSelectedSemester(mostRecentCuatrimestre);
        }
    }, [cuatrimestresData]);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://prime-api-iawe.onrender.com/data', { params: { matricula } });
            if (response.status === 200 && response.data) {
                setStudent(response.data.data[0]);
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const fetchDataHistorial = async () => {
        try {
            const response = await axios.get('https://prime-api-iawe.onrender.com/fullHistorial', { params: { matricula } });
            if (response.status === 200 && response.data.data) {
                setCuatrimestresData(formatData(response.data.data));
            }
        } catch (error) {
            console.error("Error al obtener historial:", error);
        }
    };

    const formatData = (data) => {
        const formattedData = {};
        const promedioCuatrimestre = {};
        const periodos = {};

        data.forEach(item => {
            const { Cuatrimestre, Materia, PromedioFinal, Parcial1, Parcial2, Parcial3, Parcial1E1, Parcial1E2, Parcial1E3, Parcial2E1, Parcial2E2, Parcial2E3, Parcial3E1, Parcial3E2, Parcial3E3, Periodo } = item;

            const cuatrimestreNombre = cuatrimestreMap[Cuatrimestre] || Cuatrimestre;

            const getBestScore = (normal, E1, E2, E3) => {
                if (normal >= 6) return { tipo: "OR", calificacion: normal };
                if (E1 >= 6) return { tipo: "E1", calificacion: E1 };
                if (E2 >= 6) return { tipo: "E2", calificacion: E2 };
                if (E3 >= 6) return { tipo: "E3", calificacion: E3 };
                return { tipo: "N/A", calificacion: normal };
            };

            const parcial1 = getBestScore(Parcial1, Parcial1E1, Parcial1E2, Parcial1E3);
            const parcial2 = getBestScore(Parcial2, Parcial2E1, Parcial2E2, Parcial2E3);
            const parcial3 = getBestScore(Parcial3, Parcial3E1, Parcial3E2, Parcial3E3);

            if (!formattedData[cuatrimestreNombre]) {
                formattedData[cuatrimestreNombre] = { materias: [], promedioFinal: 0, count: 0 };
                periodos[cuatrimestreNombre] = Periodo; // Store the period for this cuatrimestre
            }

            formattedData[cuatrimestreNombre].materias.push({
                materia: Materia,
                parcial1, parcial2, parcial3,
                promedioFinal: PromedioFinal
            });

            formattedData[cuatrimestreNombre].promedioFinal += PromedioFinal;
            formattedData[cuatrimestreNombre].count += 1;
        });

        Object.keys(formattedData).forEach(cuatrimestre => {
            const cuatrimestreData = formattedData[cuatrimestre];
            const promedio = cuatrimestreData.promedioFinal / cuatrimestreData.count;
            promedioCuatrimestre[cuatrimestre] = promedio;
            delete cuatrimestreData.count;
            delete cuatrimestreData.promedioFinal;
        });

        setPromedioCuatrimestre(promedioCuatrimestre);
        setPeriodos(periodos);
        return formattedData;
    };

    const addHeader = (doc, title, cuatrimestre) => {
        let yOffset = 40;

        // Title
        doc.setFontSize(14);
        doc.setFont("Times New Roman", "normal");
        doc.setTextColor(0, 0, 0);
        const uniText = "UNIVERSIDAD TECNOLÓGICA DE LA HUASTECA HIDALGUENSE";
        const uniTextWidth = doc.getTextWidth(uniText);
        const uniXPosition = (doc.internal.pageSize.getWidth() - uniTextWidth) / 2;
        doc.text(uniText, uniXPosition, yOffset);
        yOffset += 15;

        // Images
        const imgLeft = "/src/assets/LOGO_TI.png";
        const imgRight = "/src/assets/uthh.png";
        const imgWidth = 30;
        const imgHeight = 30;
        const margin = 20;
        doc.addImage(imgLeft, "PNG", margin, yOffset - 13, imgWidth - 7, imgHeight - 7);
        doc.addImage(imgRight, "PNG", doc.internal.pageSize.width - imgWidth - margin, yOffset - 16, imgWidth, imgHeight);
        yOffset += 15;

        // Subtitle
        const subtitle = title;
        const subtitleWidth = doc.getTextWidth(subtitle);
        const subtitleXPosition = (doc.internal.pageSize.getWidth() - subtitleWidth) / 2;
        doc.text(subtitle, subtitleXPosition, yOffset);
        yOffset += 15;

        // Student Info
        doc.setFontSize(12);
        const pageWidth = doc.internal.pageSize.getWidth();
        const carreraText = `CARRERA: ${student.NombreCarrera}`;
        const grupoText = `GRUPO: ${student.Grupo}`;
        const periodoText = `PERIODO: ${periodos[cuatrimestre] || student.Periodo}`; // Use specific cuatrimestre period
        const alumnoText = `ALUMNO: ${student.Nombre} ${student.APaterno} ${student.AMaterno}`;
        const matriculaText = `MATRÍCULA: ${matricula}`;

        let carreraWidth = doc.getTextWidth(carreraText);
        if (carreraWidth > pageWidth - 20) {
            const splitCarreraText = doc.splitTextToSize(carreraText, pageWidth - 20);
            doc.text(splitCarreraText, 20, yOffset);
            yOffset += splitCarreraText.length * 7;
        } else {
            doc.text(carreraText, 20, yOffset);
            yOffset += 10;
        }

        doc.text(alumnoText, 20, yOffset);
        doc.text(matriculaText, 150, yOffset);
        yOffset += 10;

        doc.text(grupoText, 20, yOffset);
        doc.text(periodoText, pageWidth - doc.getTextWidth(periodoText) - 20, yOffset);
        yOffset += 2;

        // Divider Line
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(10, yOffset, 200, yOffset);
        yOffset += 5;

        return yOffset;
    };

    const generatePDF = () => {
        if (!student || Object.keys(cuatrimestresData).length === 0) {
            alert("No hay datos para generar el PDF.");
            return;
        }

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.getHeight();
        const maxTableHeight = pageHeight - 40; // Leave room for footer/margins

        let yOffset = 0;
        let tableCount = 0;

        Object.keys(cuatrimestresData).forEach((cuatrimestre, index) => {
            // Check if there's enough space for the table
            const estimatedTableHeight = 10 + (cuatrimestresData[cuatrimestre].materias.length * 10) + 20; // Approximate height
            if (yOffset + estimatedTableHeight > maxTableHeight || tableCount >= 2) {
                doc.addPage();
                yOffset = addHeader(doc, "HISTORIAL ACADÉMICO", cuatrimestre); // Pass cuatrimestre-specific period
                tableCount = 0;
            } else if (index === 0) {
                yOffset = addHeader(doc, "HISTORIAL ACADÉMICO", cuatrimestre); // Initial header
            }

            doc.setFont("Times New Roman", "bold");
            doc.setFontSize(12);
            doc.text(`Cuatrimestre: ${cuatrimestre} (Periodo: ${periodos[cuatrimestre] || 'N/A'})`, 20, yOffset);
            yOffset += 10;

            doc.setFontSize(10);
            doc.autoTable({
                startY: yOffset,
                head: [["Materia", "Parcial 1", "Parcial 2", "Parcial 3", "Promedio Final"]],
                body: cuatrimestresData[cuatrimestre].materias.map((subject) => [
                    subject.materia,
                    `${subject.parcial1.calificacion} ${subject.parcial1.tipo}`,
                    `${subject.parcial2.calificacion} ${subject.parcial2.tipo}`,
                    `${subject.parcial3.calificacion} ${subject.parcial3.tipo}`,
                    subject.promedioFinal
                ]),
                headStyles: {
                    fillColor: "#921F45",
                    textColor: "#FFFFFF",
                    fontSize: 12,
                    fontStyle: "bold",
                    halign: "center"
                },
                styles: {
                    fontSize: 10,
                    halign: "center"
                },
            });

            yOffset = doc.lastAutoTable.finalY + 10;
            const promedioFinal = promedioCuatrimestre[cuatrimestre]?.toFixed(2) || "N/A";
            doc.text(`Promedio Final del ${cuatrimestre}: ${promedioFinal}`, 20, yOffset);
            yOffset += 20;
            tableCount++;
        });

        doc.save("Historial.pdf");
    };

    const generatePDFCuatrimestreActual = () => {
        if (!student || Object.keys(cuatrimestresData).length === 0) {
            alert("No hay datos para generar el PDF.");
            return;
        }

        const doc = new jsPDF();
        let yOffset = addHeader(doc, "BOLETA DE CALIFICACIONES", selectedSemester); // Pass selectedSemester for period

        doc.setFontSize(12);
        doc.text(`CUATRIMESTRE: ${selectedSemester}`, 20, yOffset);
        yOffset += 2;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(10, yOffset, 200, yOffset);
        yOffset += 5;

        doc.autoTable({
            startY: yOffset,
            head: [["Materias", "Parcial 1", "Parcial 2", "Parcial 3", "Promedio Final"]],
            body: cuatrimestresData[selectedSemester].materias.map((subject) => [
                subject.materia,
                `${subject.parcial1.calificacion} ${subject.parcial1.tipo}`,
                `${subject.parcial2.calificacion} ${subject.parcial2.tipo}`,
                `${subject.parcial3.calificacion} ${subject.parcial3.tipo}`,
                subject.promedioFinal
            ]),
            headStyles: {
                fillColor: "#921F45",
                textColor: "#FFFFFF",
                fontSize: 12,
                fontStyle: "bold",
                halign: "center"
            },
            styles: {
                fontSize: 10,
                halign: "center"
            },
        });

        yOffset = doc.lastAutoTable.finalY + 10;
        const promedioFinal = promedioCuatrimestre[selectedSemester]?.toFixed(2) || "N/A";
        doc.text(`Promedio Final del ${selectedSemester}: ${promedioFinal}`, 20, yOffset);

        doc.save("Boleta.pdf");
    };

    if (!student) return <Typography align="center">Cargando datos...</Typography>;

    return (
        <Card sx={{ maxWidth: '100%', margin: "auto", mt: 4, boxShadow: 3, padding: 2, borderRadius: '1%' }}>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary" }}>
                    ALUMNO: {student.Nombre} {student.APaterno} {student.AMaterno}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary" }}>
                    CARRERA: {student.NombreCarrera}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary" }}>
                    GRUPO: {student.Grupo}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary" }}>
                    PERIODO: {periodos[selectedSemester] || 'N/A'} {/* Display period for selected cuatrimestre */}
                </Typography>

                <Typography variant="body2">
                    <strong>CUATRIMESTRE:</strong>
                    <Select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        sx={{ ml: 1 }}
                    >
                        {Object.keys(cuatrimestresData).map((cuatri, index) => (
                            <MenuItem sx={{ color: "text.primary" }} key={index} value={cuatri}>
                                {cuatri} (Periodo: {periodos[cuatri] || 'N/A'})
                            </MenuItem>
                        ))}
                    </Select>
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={generatePDF}
                    >
                        Generar PDF De Historial
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={generatePDFCuatrimestreActual}
                    >
                        Generar PDF Del Cuatrimestre Actual
                    </Button>
                </div>

                <TableContainer component={Paper} sx={{ mt: 3, border: "1px solid #921F45" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#921F45" }}>
                                <TableCell sx={{ color: "#ffffff", fontWeight: "bold", py: 0.5 }}>Materia</TableCell>
                                <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold", py: 0.5 }}>Parcial 1</TableCell>
                                <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold", py: 0.5 }}>Parcial 2</TableCell>
                                <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold", py: 0.5 }}>Parcial 3</TableCell>
                                <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold", py: 0.5 }}>Promedio Final</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cuatrimestresData[selectedSemester]?.materias?.map((subject, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#D9D9D9" : "white" }}>
                                    <TableCell sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{subject.materia}</TableCell>
                                    {[subject.parcial1, subject.parcial2, subject.parcial3].map((parcial, idx) => (
                                        <TableCell 
                                            key={idx} 
                                            sx={{ 
                                                color: parcial.calificacion < 7 ? "red" : "#000000", 
                                                fontWeight: "bold", 
                                                py: 0.5 
                                            }} 
                                            align="center"
                                        >
                                            {parcial.calificacion} {parcial.tipo}
                                        </TableCell>
                                    ))}
                                    <TableCell 
                                        sx={{ 
                                            color: subject.promedioFinal < 7 ? "red" : "#000000", 
                                            fontWeight: "bold", 
                                            py: 0.5 
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
    );
};

export default StudentGrades;