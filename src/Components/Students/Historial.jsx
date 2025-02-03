import React, { useEffect, useState } from "react";
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
} from "@mui/material";

const StudentGrades = () => {
    const [student, setStudent] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState("7mo. CUATRIMESTRE");

    useEffect(() => {
        const mockData = {
            name: "RAUL CRESCENCIO HERNANDEZ",
            career: "INGENIERÍA EN DESARROLLO Y GESTIÓN DE SOFTWARE",
            semester: "7mo. CUATRIMESTRE",
            group: "B",
            period: "20243",
            grades: [
                { name: "MATEMÁTICAS PARA INGENIERÍA I", m1: 7, m2: 7, m3: 7, finalGrade: 7 },
                { name: "METODOLOGÍAS PARA EL DESARROLLO DE PROYECTOS", m1: 10, m2: 10, m3: 10, finalGrade: 10 },
                { name: "ARQUITECTURAS DE SOFTWARE", m1: 10, m2: 9, m3: 10, finalGrade: 10 },
                { name: "EXPERIENCIA DE USUARIO", m1: 9, m2: 10, m3: 10, finalGrade: 10 },
                { name: "SEGURIDAD INFORMÁTICA", m1: 9, m2: 9, m3: 9, finalGrade: 9 },
                { name: "INGLÉS VI", m1: 10, m2: 8, m3: 9, finalGrade: 9 },
                { name: "ADMINISTRACIÓN DEL TIEMPO", m1: 10, m2: 10, m3: 10, finalGrade: 10 },
            ],
            average: 9.71,
        };
        setStudent(mockData);
    }, []);

    if (!student) {
        return <Typography align="center">Cargando datos...</Typography>;
    }

    return (
        <Card sx={{ maxWidth: '100%', margin: "auto", mt: 4, boxShadow: 3, padding: 2, borderRadius:'1%'}}>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary" }}>
                    ALUMNO: {student.name}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary" }}>
                    CARRERA: {student.career}
                </Typography>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                    <Typography variant="body2">
                        <strong>CUATRIMESTRE:</strong>
                        <Select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            sx={{ ml: 1 }}
                        >
                            <MenuItem   value="7mo. CUATRIMESTRE"  sx={{ color: "text.primary"}} >7mo. CUATRIMESTRE</MenuItem>
                            <MenuItem  value="8vo. CUATRIMESTRE" sx={{ color: "text.primary" }} >8vo. CUATRIMESTRE</MenuItem>
                        </Select>
                    </Typography>
                    <Typography variant="body2">
                        <strong>GRUPO:</strong> {student.group}
                    </Typography>
                    <Typography variant="body2">
                        <strong>PERIODO:</strong> {student.period}
                    </Typography>
                </div>

                <TableContainer component={Paper} sx={{ mt: 3, border: "1px solid #921F45" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#921F45" }}>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre de la materia</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>M1</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>M2</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>M3</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Promedio Final</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {student.grades.map((subject, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#D9D9D9" : "white" }}>
                                    <TableCell>{subject.name}</TableCell>

                                    <TableCell  align="center">
                                        <TableCell align="center">{subject.m1}</TableCell>
                                        <TableCell align="center">OR</TableCell>
                                    </TableCell>

                                    <TableCell  align="center">
                                    <TableCell align="center">{subject.m2}</TableCell>
                                        <TableCell align="center">OR</TableCell>
                                    </TableCell>

                                    <TableCell  align="center">
                                        <TableCell align="center">{subject.m3}</TableCell>
                                        <TableCell align="center">OR</TableCell>
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", color: subject.finalGrade < 7 ? "red" : "green" }}
                                    >
                                        {subject.finalGrade}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" align="right" sx={{ mt: 3, fontWeight: "bold", color: "green" }}>
                    PROMEDIO: {student.average}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StudentGrades;