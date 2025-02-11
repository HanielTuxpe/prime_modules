import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card, CardContent, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Select, MenuItem
} from "@mui/material";

const StudentGrades = () => {
    const [student, setStudent] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState("1ro. CUATRIMESTRE");
    const matricula = '20221269';
    const [cuatrimestresData, setCuatrimestresData] = useState({});

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
                formattedData[cuatrimestreNombre] = [];
            }
            formattedData[cuatrimestreNombre].push({
                materia: Materia,
                parcial1, parcial2, parcial3,
                promedioFinal: PromedioFinal
            });
        });
        return formattedData;
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

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                    <Typography variant="body2">
                        <strong>CUATRIMESTRE:</strong>
                        <Select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            sx={{ ml: 1 }}
                        >
                            {Object.keys(cuatrimestresData).map((cuatri, index) => (
                                <MenuItem  sx={{color:"text.primary"}} key={index} value={cuatri}>{cuatri}</MenuItem>
                            ))}
                        </Select>
                    </Typography>
                    <Typography variant="body2">
                        <strong>GRUPO:</strong> {student.Grupo}
                    </Typography>
                    <Typography variant="body2">
                        <strong>PERIODO:</strong> {student.period}
                    </Typography>
                </div>

                <TableContainer component={Paper} sx={{ mt: 3, border: "1px solid #921F45" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#921F45" }}>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Materia</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Parcial 1</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Parcial 2</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Parcial 3</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Promedio Final</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cuatrimestresData[selectedSemester]?.map((subject, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#D9D9D9" : "white" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>{subject.materia}</TableCell>
                                    <TableCell align="center">{subject.parcial1.calificacion}&nbsp;&nbsp;{subject.parcial1.tipo}</TableCell>
                                    <TableCell align="center">{subject.parcial2.calificacion}&nbsp;&nbsp;{subject.parcial2.tipo}</TableCell>
                                    <TableCell align="center">{subject.parcial3.calificacion}&nbsp;&nbsp;{subject.parcial3.tipo}</TableCell>
                                    <TableCell align="center">{subject.promedioFinal}</TableCell>
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
