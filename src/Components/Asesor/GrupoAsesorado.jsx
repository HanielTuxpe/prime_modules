import React, { useState } from "react";
import { Card, CardContent, Typography, FormControl, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";


const ModuloAsesor = () => {
    const [estudiante, setEstudiante] = useState("");
    const estudiantes = [
        {
            nombre: "Juan Pérez", calificaciones: [
                { materia: "Matemáticas", m1: 8, m2: 9, m3: 10, finalGrade: 9 },
                { materia: "Programación", m1: 9, m2: 8, m3: 9, finalGrade: 9 },
            ],
            average: 9.71
        },
        {
            nombre: "María Gómez", calificaciones: [
                { materia: "Matemáticas", m1: 7, m2: 8, m3: 7, finalGrade: 7 },
                { materia: "Programación", m1: 10, m2: 9, m3: 9, finalGrade: 9 },

            ],
            average: 8.71
        }
    ];

    const handleChange = (event) => {
        setEstudiante(event.target.value);
    };

    const estudianteSeleccionado = estudiantes.find(e => e.nombre === estudiante);

    return (
        <Card sx={{ maxWidth: '100%', margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography display="flex" variant="h4" fontWeight="bold" justifyContent="center" gutterBottom>
                    Grupo Asesorado
                </Typography>

                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Carrera: Tecnologías de la Información</Typography>
                    <Typography variant="body2">Cuatrimestre: 8</Typography>
                    <Typography variant="body2" > Grupo: B </Typography>
                    <Typography variant="body2" gutterBottom> Periodo: 20251</Typography>

                </Box>

                <FormControl fullWidth>

                    <Typography variant="boby2" fontWeight="bold" gutterBottom>
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
                                    <TableRow sx={{ backgroundColor: "#921F45" }}>
                                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre de la materia</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>M1</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>M2</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>M3</TableCell>
                                        <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Promedio Final</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {estudianteSeleccionado.calificaciones.map((c, index) => (
                                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#D9D9D9" : "white" }}>
                                            <TableCell sx={{ color: "#000000", fontWeight: "bold" }} >{c.materia}</TableCell>

                                            <TableCell align="center">
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold" }} >{c.m1}</TableCell>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold" }} >OR</TableCell>
                                            </TableCell>

                                            <TableCell align="center">
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold" }} >{c.m2}</TableCell>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold" }} >OR</TableCell>
                                            </TableCell>

                                            <TableCell align="center">
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold" }} >{c.m3}</TableCell>
                                                <TableCell align="center" sx={{ color: "#000000", fontWeight: "bold" }} >OR</TableCell>
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                sx={{ fontWeight: "bold", color: c.finalGrade < 7 ? "red" : "green" }}
                                            >
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





            </CardContent>
        </Card>
    );
};

export default ModuloAsesor;
