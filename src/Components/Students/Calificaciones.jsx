import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button } from "@mui/material";
import { jsPDF } from "jspdf";  // Asegúrate de importar jsPDF correctamente
import "jspdf-autotable"; // Importar jsPDF autoTable si no lo has hecho aún

const StudentGrades = () => {
    const [student, setStudent] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState("1ro. CUATRIMESTRE");
    const matricula = '20221038';
    const [cuatrimestresData, setCuatrimestresData] = useState({});
    const [promedioCuatrimestre, setPromedioCuatrimestre] = useState({});

    // Mapeo de los números del cuatrimestre a sus nombres
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

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/data', { params: { matricula } });
            if (response.status === 200 && response.data) {
                setStudent(response.data.data[0]);
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const fetchDataHistorial = async () => {
        try {
            const response = await axios.get('http://localhost:3000/fullHistorial', { params: { matricula } });
            if (response.status === 200 && response.data.data) {
                setCuatrimestresData(formatData(response.data.data));
            }
        } catch (error) {
            console.error("Error al obtener historial:", error);
        }
    };

    const formatData = (data) => {
        const formattedData = {};
        const promedioCuatrimestre = {}; // Aquí guardaremos el promedio final por cuatrimestre

        data.forEach(item => {
            const { Cuatrimestre, Materia, PromedioFinal, Parcial1, Parcial2, Parcial3, Parcial1E1, Parcial1E2, Parcial1E3, Parcial2E1, Parcial2E2, Parcial2E3, Parcial3E1, Parcial3E2, Parcial3E3 } = item;

            // Convertir el cuatrimestre a su nombre correspondiente
            const cuatrimestreNombre = cuatrimestreMap[Cuatrimestre] || Cuatrimestre; // Si no se encuentra, se usa el valor original

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
                formattedData[cuatrimestreNombre] = { materias: [], promedioFinal: 0, count: 0 }; // Inicializar con promedio y contador
            }

            // Agregar materia y sus detalles
            formattedData[cuatrimestreNombre].materias.push({
                materia: Materia,
                parcial1, parcial2, parcial3,
                promedioFinal: PromedioFinal
            });

            // Sumar el promedio final para este cuatrimestre
            formattedData[cuatrimestreNombre].promedioFinal += PromedioFinal;
            formattedData[cuatrimestreNombre].count += 1;
        });

        // Calcular el promedio final por cuatrimestre
        Object.keys(formattedData).forEach(cuatrimestre => {
            const cuatrimestreData = formattedData[cuatrimestre];
            const promedio = cuatrimestreData.promedioFinal / cuatrimestreData.count;

            // Asignar el promedio calculado al cuatrimestre
            promedioCuatrimestre[cuatrimestre] = promedio;

            // Limpiar los datos intermedios
            delete cuatrimestreData.count;
            delete cuatrimestreData.promedioFinal;
        });

        setPromedioCuatrimestre(promedioCuatrimestre); // Actualiza el estado con los promedios calculados

        return formattedData;
    };
    const generatePDF = () => {
        // Verifica que haya datos del alumno y de los cuatrimestres
        if (!student || Object.keys(cuatrimestresData).length === 0) {
            alert("No hay datos para generar el PDF.");
            return;
        }

        // Crear un nuevo documento PDF
        const doc = new jsPDF();


        // Establecer el tamaño de la fuente general para el texto
        doc.setFontSize(12); // Tamaño de la fuente para los textos generales

        // Datos del alumno - con colores, sombras y mayor tamaño de fuente
        doc.setFontSize(14); // Mayor tamaño para los datos del alumno
        doc.setFont("helvetica", "normal"); // Fuente normal para los datos del alumno
        doc.setTextColor(0, 0, 0);  // Regresar a color negro para el texto real
        doc.text(`ALUMNO: ${student.Nombre} ${student.APaterno} ${student.AMaterno}`, 10, 10);  // Título real
        doc.setTextColor(0, 0, 0);  // Regresar a color negro para el texto real
        doc.text(`CARRERA: ${student.NombreCarrera}`, 10, 20);  // Título real
        doc.setTextColor(0, 0, 0);  // Regresar a color negro para el texto real
        doc.text(`GRUPO: ${student.Grupo}`, 10, 30);  // Título real

        // Agregar una línea decorativa después de los datos del alumno
        doc.setDrawColor(0, 0, 0);  // Color negro para la línea
        doc.setLineWidth(0.5);  // Grosor de la línea
        doc.line(10, 35, 200, 35); // Línea desde el margen izquierdo hasta el derecho

        // Variable para controlar la posición en el eje Y entre cada cuatrimestre
        let yOffset = 40; // Ajustar posición inicial para el primer cuatrimestre
        let tableCount = 0; // Contador para las tablas por página

        // Agregar los datos de cada cuatrimestre
        Object.keys(cuatrimestresData).forEach((cuatrimestre, index) => {
            // Si ya hay 2 tablas, añadir una nueva página
            if (tableCount === 2) {
                doc.addPage(); // Añadir nueva página
                tableCount = 0; // Resetear contador de tablas por página
                yOffset = 20; // Reiniciar posición Y
            }

            // Establecer el título del cuatrimestre
            doc.setFont("helvetica", "bold");
            doc.text(`Cuatrimestre: ${cuatrimestre}`, 10, yOffset);

            // Establecer el tamaño de la fuente para la tabla
            doc.setFontSize(10); // Cambiar el tamaño de la fuente de la tabla

            // Agregar la tabla de materias y calificaciones
            doc.autoTable({
                startY: yOffset + 10, // Establecer la posición de inicio para la tabla
                head: [["Materia", "Parcial 1", "Parcial 2", "Parcial 3", "Promedio Final"]],
                body: cuatrimestresData[cuatrimestre].materias.map((subject) => [
                    subject.materia,
                    `${subject.parcial1.calificacion} ${subject.parcial1.tipo}`,
                    `${subject.parcial2.calificacion} ${subject.parcial2.tipo}`,
                    `${subject.parcial3.calificacion} ${subject.parcial3.tipo}`,
                    subject.promedioFinal
                ]),
                headStyles: {
                    fillColor: "#921F45", // Establecer el color de fondo de la cabecera
                    textColor: "#FFFFFF", // Establecer el color del texto en la cabecera
                    fontSize: 12, // Tamaño de la fuente en la cabecera
                    fontStyle: "bold", // Estilo de la fuente en la cabecera
                },
                styles: {
                    fontSize: 10 // Tamaño de la fuente de la tabla
                },
            });

            // Agregar el promedio final del cuatrimestre debajo de la tabla
            const tableHeight = doc.lastAutoTable.finalY; // Obtener la altura de la última tabla
            doc.text(`Promedio Final del ${cuatrimestre}: ${promedioCuatrimestre[cuatrimestre]?.toFixed(2) || "N/A"}`, 10, tableHeight + 10);

            // Ajustar el espacio antes de la siguiente tabla
            const spaceAfterTable = 20;  // Definir el espacio que se dejará entre las tablas
            yOffset = tableHeight + spaceAfterTable; // Ajustar la posición Y para la siguiente tabla

            // Incrementar el contador de tablas por página
            tableCount++;
        });

        // Guardar el documento PDF
        doc.save("Historial.pdf");
    };

    const generatePDFCuatrimestreActual = () => {
        // Verifica que haya datos del alumno y de los cuatrimestres
        if (!student || Object.keys(cuatrimestresData).length === 0) {
            alert("No hay datos para generar el PDF.");
            return;
        }

        // Crear un nuevo documento PDF
        const doc = new jsPDF();

        // Establecer el tamaño de la fuente general para el texto
        doc.setFontSize(12); // Tamaño de la fuente para los textos generales

        // Datos del alumno - con colores, sombras y mayor tamaño de fuente
        doc.setFontSize(14); // Mayor tamaño para los datos del alumno
        doc.setFont("helvetica", "normal"); // Fuente normal para los datos del alumno
        doc.setTextColor(0, 0, 0);  // Regresar a color negro para el texto real
        doc.text(`ALUMNO: ${student.Nombre} ${student.APaterno} ${student.AMaterno}`, 10, 10);  // Título real
        doc.setTextColor(0, 0, 0);  // Regresar a color negro para el texto real
        doc.text(`CARRERA: ${student.NombreCarrera}`, 10, 20);  // Título real
        doc.setTextColor(0, 0, 0);  // Regresar a color negro para el texto real
        doc.text(`GRUPO: ${student.Grupo}`, 10, 30);  // Título real

        // Agregar una línea decorativa después de los datos del alumno
        doc.setDrawColor(0, 0, 0);  // Color negro para la línea
        doc.setLineWidth(0.5);  // Grosor de la línea
        doc.line(10, 35, 200, 35); // Línea desde el margen izquierdo hasta el derecho

        // Obtener el cuatrimestre más actual
        const cuatrimestres = Object.keys(cuatrimestresData);
        const cuatrimestreMasActual = cuatrimestres[cuatrimestres.length - 1]; // Suponiendo que los cuatrimestres están ordenados cronológicamente

        // Si necesitas un orden específico, puedes ordenarlo de esta manera:
        // const cuatrimestreMasActual = cuatrimestres.sort((a, b) => parseInt(b) - parseInt(a))[0];

        // Establecer el título del cuatrimestre
        let yOffset = 60; // Ajustar posición inicial para el cuatrimestre
        doc.setFont("helvetica", "bold");
        doc.text(`Cuatrimestre: ${cuatrimestreMasActual}`, 10, yOffset);

        // Establecer el tamaño de la fuente para la tabla
        doc.setFontSize(10); // Cambiar el tamaño de la fuente de la tabla

        // Agregar la tabla de materias y calificaciones del cuatrimestre más actual
        doc.autoTable({
            startY: yOffset + 10, // Establecer la posición de inicio para la tabla
            head: [["Materia", "Parcial 1", "Parcial 2", "Parcial 3", "Promedio Final"]],
            body: cuatrimestresData[cuatrimestreMasActual].materias.map((subject) => [
                subject.materia,
                `${subject.parcial1.calificacion} ${subject.parcial1.tipo}`,
                `${subject.parcial2.calificacion} ${subject.parcial2.tipo}`,
                `${subject.parcial3.calificacion} ${subject.parcial3.tipo}`,
                subject.promedioFinal
            ]),
            headStyles: {
                fillColor: "#921F45", // Establecer el color de fondo de la cabecera
                textColor: "#FFFFFF", // Establecer el color del texto en la cabecera
                fontSize: 12, // Tamaño de la fuente en la cabecera
                fontStyle: "bold", // Estilo de la fuente en la cabecera
            },
            styles: {
                fontSize: 10 // Tamaño de la fuente de la tabla
            },
        });

        // Agregar el promedio final del cuatrimestre debajo de la tabla
        const tableHeight = doc.lastAutoTable.finalY; // Obtener la altura de la última tabla
        doc.text(`Promedio Final del ${cuatrimestreMasActual}: ${promedioCuatrimestre[cuatrimestreMasActual]?.toFixed(2) || "N/A"}`, 10, tableHeight + 10);

        // Guardar el documento PDF
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
                    <strong>GRUPO:</strong> {student.Grupo}
                </Typography>

                <Typography variant="body2">
                    <strong>CUATRIMESTRE:</strong>
                    <Select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        sx={{ ml: 1 }}
                    >
                        {Object.keys(cuatrimestresData).map((cuatri, index) => (
                            <MenuItem sx={{ color: "text.primary" }} key={index} value={cuatri}>{cuatri}</MenuItem>
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
                                    <TableCell sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }} align="center">{subject.parcial1.calificacion}&nbsp;&nbsp;{subject.parcial1.tipo}</TableCell>
                                    <TableCell sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }} align="center">{subject.parcial2.calificacion}&nbsp;&nbsp;{subject.parcial2.tipo}</TableCell>
                                    <TableCell sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }} align="center">{subject.parcial3.calificacion}&nbsp;&nbsp;{subject.parcial3.tipo}</TableCell>
                                    <TableCell sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }} align="center">{subject.promedioFinal}</TableCell>
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
