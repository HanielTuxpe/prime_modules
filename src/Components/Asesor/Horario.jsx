import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, CircularProgress, Box
} from '@mui/material';

const HorarioDocente = () => {
    const [horario, setHorario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState('');
    const [carrera, setCarrera] = useState('');

    const nombreDocente = 'Ricardo'; // Usar nombre exacto de la hoja
    const docenteCompleto = 'MA. Ricardo García Morales'


    useEffect(() => {
        const cargarHorario = async () => {
            try {
                const response = await fetch('http://localhost:3000/horarios');
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                if (!workbook.SheetNames.includes(nombreDocente)) {
                    throw new Error(`No existe hoja para el docente: ${nombreDocente}`);
                }

                const sheet = workbook.Sheets[nombreDocente];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // Extraer PERIODO y CARRERA
                const metaPeriodo = data.find((row) => row[0]?.toString().toUpperCase().includes('PERIODO'));
                const metaCarrera = data.find((row) => row[0]?.toString().toUpperCase().includes('CARRERA'));

                if (metaPeriodo) setPeriodo(metaPeriodo[1] || '');
                if (metaCarrera) setCarrera(metaCarrera[1] || '');

                const esHoraValida = (valor) => {
                    if (!valor) return false;
                    const texto = valor.toString().trim();
                    return /^[0-2]?[0-9]:[0-5][0-9]\s*-\s*[0-2]?[0-9]:[0-5][0-9]$/.test(texto);
                };

                // Limpiar filas útiles
                const filas = data
                    .filter((fila) => esHoraValida(fila[0]))
                    .map((fila) => ({
                        hora: fila[0],
                        lunes: fila[1] || '',
                        martes: fila[2] || '',
                        miercoles: fila[3] || '',
                        jueves: fila[4] || '',
                        viernes: fila[5] || ''
                    }));

                setHorario(filas);
            } catch (err) {
                console.error('Error:', err.message);
                setHorario([]);
            } finally {
                setLoading(false);
            }
        };

        cargarHorario();
    }, [nombreDocente]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <Box sx={{ maxWidth: screen, mt: 4 }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                Universidad Tecnológica de la Huasteca Hidalguense
            </Typography>
            <Typography variant="subtitle1" align="center">
                Dirección de Tecnologías de la Información
            </Typography>
            <Typography variant="h6" align="center" sx={{ mt: 2, color: '#a00037' }}>
                Horario del Docente
            </Typography>
            <Typography variant="body2" align="center" >
                Docente: {docenteCompleto}
            </Typography>
            {periodo && (
                <Typography variant="body2" align="center">
                    Período: {periodo}
                </Typography>
            )}
            {carrera && (
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                    Carrera: {carrera}
                </Typography>
            )}

            {horario.length > 0 ? (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#2e7d32' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Hora</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Lunes</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Martes</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Miércoles</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Jueves</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Viernes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {horario.map((row, idx) => {
                                const esReceso = row.lunes?.toString().toUpperCase().includes('RECESO');
                                return (
                                    <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? '#f2fdf2' : 'white' }}>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                            {row.hora}
                                        </TableCell>
                                        {esReceso ? (
                                            <TableCell colSpan={5} align="center" sx={{ fontWeight: 'bold', fontStyle: 'italic', backgroundColor: '#d0f0d0' }}>
                                                {row.lunes}
                                            </TableCell>
                                        ) : (
                                            <>
                                                <TableCell>
                                                    <span dangerouslySetInnerHTML={{ __html: (row.lunes || '').replace(/\n/g, '<br />') }} />
                                                </TableCell>
                                                <TableCell>
                                                    <span dangerouslySetInnerHTML={{ __html: (row.martes || '').replace(/\n/g, '<br />') }} />
                                                </TableCell>
                                                <TableCell>
                                                    <span dangerouslySetInnerHTML={{ __html: (row.miercoles || '').replace(/\n/g, '<br />') }} />
                                                </TableCell>
                                                <TableCell>
                                                    <span dangerouslySetInnerHTML={{ __html: (row.jueves || '').replace(/\n/g, '<br />') }} />
                                                </TableCell>
                                                <TableCell>
                                                    <span dangerouslySetInnerHTML={{ __html: (row.viernes || '').replace(/\n/g, '<br />') }} />
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                    No se encontró horario para el docente: {nombreDocente}
                </Typography>
            )}
        </Box>
    );
};

export default HorarioDocente;
