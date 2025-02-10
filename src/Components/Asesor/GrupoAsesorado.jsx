import React, { useState } from "react";
import { Chart } from 'react-google-charts';
import { Card, CardContent, Typography, FormControl, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const ModuloAsesor = () => {
    const [estudiante, setEstudiante] = useState("");
    const estudiantes = [
        {
            nombre: "Juan Pérez", calificaciones: [
                { materia: "Matemáticas", m1: { nota: 8, tipo: "OR" }, m2: { nota: 9, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 9 },
                { materia: "Programación", m1: { nota: 9, tipo: "OR" }, m2: { nota: 8, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 9 },
                { materia: "Física", m1: { nota: 7, tipo: "E1" }, m2: { nota: 8, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 8 },
                { materia: "Química", m1: { nota: 8, tipo: "OR" }, m2: { nota: 8, tipo: "OR" }, m3: { nota: 7, tipo: "E1" }, finalGrade: 8 },
                { materia: "Historia", m1: { nota: 9, tipo: "OR" }, m2: { nota: 9, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 9 },
                { materia: "Inglés", m1: { nota: 10, tipo: "OR" }, m2: { nota: 9, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 9 },
                { materia: "Arte", m1: { nota: 9, tipo: "OR" }, m2: { nota: 8, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 9 },
                { materia: "Deportes", m1: { nota: 8, tipo: "OR" }, m2: { nota: 7, tipo: "E1" }, m3: { nota: 8, tipo: "OR" }, finalGrade: 8 }
            ],
            average: 8
        },
        {
            nombre: "María Gómez", calificaciones: [
                { materia: "Matemáticas", m1: { nota: 7, tipo: "OR" }, m2: { nota: 8, tipo: "E1" }, m3: { nota: 7, tipo: "OR" }, finalGrade: 7 },
                { materia: "Programación", m1: { nota: 10, tipo: "OR" }, m2: { nota: 9, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 9 },
                { materia: "Física", m1: { nota: 6, tipo: "E1" }, m2: { nota: 7, tipo: "OR" }, m3: { nota: 7, tipo: "OR" }, finalGrade: 7 },
                { materia: "Química", m1: { nota: 8, tipo: "OR" }, m2: { nota: 8, tipo: "OR" }, m3: { nota: 7, tipo: "OR" }, finalGrade: 8 },
                { materia: "Historia", m1: { nota: 9, tipo: "OR" }, m2: { nota: 8, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 9 },
                { materia: "Inglés", m1: { nota: 10, tipo: "OR" }, m2: { nota: 10, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 10 },
                { materia: "Arte", m1: { nota: 8, tipo: "E1" }, m2: { nota: 9, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 9 },
                { materia: "Deportes", m1: { nota: 7, tipo: "OR" }, m2: { nota: 8, tipo: "OR" }, m3: { nota: 7, tipo: "OR" }, finalGrade: 7 }
            ],
            average: 8
        },
        {
            nombre: "Luis Hernández", calificaciones: [
                { materia: "Matemáticas", m1: { nota: 10, tipo: "OR" }, m2: { nota: 10, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 10 },
                { materia: "Programación", m1: { nota: 10, tipo: "OR" }, m2: { nota: 10, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 10 },
                { materia: "Física", m1: { nota: 10, tipo: "OR" }, m2: { nota: 10, tipo: "OR" }, m3: { nota: 9, tipo: "OR" }, finalGrade: 10 },
                { materia: "Química", m1: { nota: 10, tipo: "OR" }, m2: { nota: 9, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 10 },
                { materia: "Historia", m1: { nota: 10, tipo: "OR" }, m2: { nota: 10, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 10 },
                { materia: "Inglés", m1: { nota: 10, tipo: "OR" }, m2: { nota: 10, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 10 },
                { materia: "Arte", m1: { nota: 10, tipo: "OR" }, m2: { nota: 9, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 10 },
                { materia: "Deportes", m1: { nota: 9, tipo: "OR" }, m2: { nota: 10, tipo: "OR" }, m3: { nota: 10, tipo: "OR" }, finalGrade: 10 }
            ],
            average: 9
        },
        {
            nombre: "Pedro Ramírez", calificaciones: [
                { materia: "Matemáticas", m1: { nota: 5, tipo: "E2" }, m2: { nota: 4, tipo: "E3" }, m3: { nota: 6, tipo: "E1" }, finalGrade: 5 },
                { materia: "Programación", m1: { nota: 6, tipo: "E1" }, m2: { nota: 5, tipo: "E1" }, m3: { nota: 6, tipo: "E1" }, finalGrade: 6 },
                { materia: "Física", m1: { nota: 4, tipo: "E3" }, m2: { nota: 5, tipo: "E2" }, m3: { nota: 4, tipo: "E3" }, finalGrade: 5 },
                { materia: "Química", m1: { nota: 5, tipo: "E2" }, m2: { nota: 5, tipo: "E2" }, m3: { nota: 4, tipo: "E3" }, finalGrade: 5 },
                { materia: "Historia", m1: { nota: 6, tipo: "E1" }, m2: { nota: 5, tipo: "E1" }, m3: { nota: 6, tipo: "E1" }, finalGrade: 6 },
                { materia: "Inglés", m1: { nota: 7, tipo: "E1" }, m2: { nota: 6, tipo: "E1" }, m3: { nota: 6, tipo: "E1" }, finalGrade: 6 },
                { materia: "Arte", m1: { nota: 6, tipo: "E1" }, m2: { nota: 5, tipo: "E2" }, m3: { nota: 5, tipo: "E3" }, finalGrade: 5 },
                { materia: "Deportes", m1: { nota: 5, tipo: "E3" }, m2: { nota: 4, tipo: "E3" }, m3: { nota: 5, tipo: "E3" }, finalGrade: 5 }
            ],
            average: 5
        }
    ];





    const handleChange = (event) => {
        setEstudiante(event.target.value);
    };

    const estudianteSeleccionado = estudiantes.find(e => e.nombre === estudiante);

    // Generar datos para la gráfica según el estudiante seleccionado
    const data = estudianteSeleccionado ? [
        ["Materia", "M1", "M2", "M3"],
        ...estudianteSeleccionado.calificaciones.map(c => [c.materia, c.m1.nota, c.m2.nota, c.m3.nota])
    ] : [["Materia", "M1", "M2", "M3"], ["", 0, 0, 0]];

    const options = {
        chart: {
            title: "Calificaciones por materia",
            subtitle: "Comparación de M1, M2 y M3",
        },
    };

    return (
        <Card sx={{ maxWidth: '100%', margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography display="flex" variant="h4" fontWeight="bold" justifyContent="center" gutterBottom>
                    Grupo Asesorado
                </Typography>

                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Carrera: Tecnologías de la Información</Typography>
                    <Typography variant="body2">Cuatrimestre: 8</Typography>
                    <Typography variant="body2">Grupo: B</Typography>
                    <Typography variant="body2" gutterBottom>Periodo: 20251</Typography>
                </Box>

                <FormControl fullWidth>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                        Lista de alumnos
                    </Typography>
                    <Select value={estudiante} onChange={handleChange}>
                        {estudiantes.map((e, index) => (
                            <MenuItem sx={{ color: "text.primary" }} key={index} value={e.nombre}>{e.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {estudianteSeleccionado && (
                    <>
                        <TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#921F45", height: "30px" }}>
                                        <TableCell sx={{ color: "white", fontWeight: "bold", py: 0.5 }}>Nombre de la materia</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold", py: 0.5 }}>M1</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold", py: 0.5 }}>M2</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold", py: 0.5 }}>M3</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold", py: 0.5 }}>Promedio Final</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {estudianteSeleccionado.calificaciones.map((c, index) => (
                                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#D9D9D9" : "white", height: "30px" }}>
                                            <TableCell sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{c.materia}</TableCell>
                                            <TableCell align="center" sx={{ py: 0.5 }}>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{c.m1.nota}</TableCell>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{c.m1.tipo}</TableCell>
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 0.5 }}>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{c.m2.nota}</TableCell>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{c.m2.tipo}</TableCell>
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 0.5 }}>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{c.m3.nota}</TableCell>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold", py: 0.5 }}>{c.m3.tipo}</TableCell>
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: "bold", color: c.finalGrade < 7 ? "red" : "green", py: 0.5 }}>
                                                {c.finalGrade}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        <Typography variant="h5" align="right" sx={{ mt: 3, fontWeight: "bold", color: "#921F45" }}>
                            PROMEDIO: {estudianteSeleccionado.average}
                        </Typography>
                    </>
                )}

                {/* Gráfico de barras */}
                <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            </CardContent>
        </Card>
    );
};

export default ModuloAsesor;
