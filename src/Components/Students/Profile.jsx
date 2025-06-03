import { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, CircularProgress, Fade } from '@mui/material';
import QRCode from 'react-qr-code';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const Profile = () => {
    const [studentData, setStudentData] = useState({
        matricula: '20221038',
        nombre: '',
        apaterno: '',
        amaterno: '',
        cuatrimestre: '',
        grupo: '',
        nombreCarrera: '',
        email: '',
        periodo: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:3000/Fulldata/?matricula=${studentData.matricula}`);
                const data = response.data.data[0];
                setStudentData({
                    matricula: data.Matricula || studentData.matricula,
                    nombre: data.Nombre || studentData.nombre,
                    apaterno: data.APaterno || studentData.apaterno,
                    amaterno: data.AMaterno || studentData.amaterno,
                    cuatrimestre: data.Cuatrimestre || studentData.cuatrimestre,
                    grupo: data.Grupo || studentData.grupo,
                    nombreCarrera: data.NombreCarrera || studentData.nombreCarrera,
                    email: data.Email || studentData.email,
                    periodo: data.Periodo || studentData.periodo,
                });
            } catch (error) {
                console.error('Error fetching student data:', error);
                setError('No se pudieron cargar los datos del estudiante.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentData.matricula]);

    const fullName = `${studentData.nombre} ${studentData.apaterno} ${studentData.amaterno}`.trim();

    const formatCuatrimestre = (cuatrimestre) => {
        const cuatrimestreNum = parseInt(cuatrimestre, 10);
        if (isNaN(cuatrimestreNum)) return cuatrimestre;
        const cuatrimestreNames = [
            'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto',
            'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo'
        ];
        return `${cuatrimestreNames[cuatrimestreNum - 1] || cuatrimestre} (${cuatrimestre}°)`;
    };

    const toTitleCase = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const formatPeriodo = (periodo) => {
        if (!periodo) return 'N/A';
        // Assuming Periodo is in format "YYYYN" (e.g., "20251" for 2025-1)
        const year = periodo.slice(0, 4);
        const term = periodo.slice(4);
        return `${year}-${term}`;
    };

    return (
        <Container
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
                justifyContent: 'center',
                padding: { xs: 2, md: 4 },
            }}
            disableGutters
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : error ? (
                <Typography color="error" variant="h6" sx={{ textAlign: 'center' }}>
                    {error}
                </Typography>
            ) : (
                <Fade in={!loading} timeout={600}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
                        {/* QR Section */}
                        <Card
                            sx={{
                                flex: 1,
                                maxWidth: { xs: '100%', md: '35%' },
                                boxShadow: 3,
                                borderRadius: 3,
                                bgcolor: '#ffffff',
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
                                QR de Acceso
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: '#fff',
                                    borderRadius: 2,
                                    border: '2px solid #1976d2',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <QRCode
                                    size={200}
                                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                    value={studentData.matricula.toString()}
                                    viewBox={`0 0 256 256`}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                />
                            </Box>
                        </Card>

                        {/* Student Information Section */}
                        <Card
                            sx={{
                                flex: 2,
                                boxShadow: 3,
                                borderRadius: 3,
                                bgcolor: '#ffffff',
                                p: 4,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        mb: 3,
                                        color: '#333',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {toTitleCase(fullName) || 'Sin Nombre'}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <AccountCircleIcon
                                        sx={{
                                            fontSize: 120,
                                            color: '#1976d2',
                                            border: '3px solid #1976d2',
                                            borderRadius: '50%',
                                            p: 1,
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ textAlign: 'center', color: '#666', mb: 3 }}>
                                    Foto de Perfil
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '2fr 2fr' },
                                        gap: 2,
                                        bgcolor: '#f9f9f9',
                                        p: 3,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                        Matrícula del Alumno
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333' }}>
                                        {studentData.matricula}
                                    </Typography>

                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                        Correo Electrónico
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333' }}>
                                        {studentData.email || 'N/A'}
                                    </Typography>

                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                        Programa Educativo
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333', textTransform: 'capitalize' }}>
                                        {studentData.nombreCarrera.toLowerCase() || 'N/A'}
                                    </Typography>

                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                        Cuatrimestre Actual
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333' }}>
                                        {formatCuatrimestre(studentData.cuatrimestre) || 'N/A'}
                                    </Typography>

                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                        Periodo
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333' }}>
                                        {formatPeriodo(studentData.periodo) || 'N/A'}
                                    </Typography>

                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                        Grupo
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#333' }}>
                                        {studentData.grupo || 'N/A'}
                                    </

                                    Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Fade>
            )}
        </Container>
    );
};

export default Profile;