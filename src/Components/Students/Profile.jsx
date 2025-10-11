import { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, CircularProgress, Fade, Divider, List, ListItem, ListItemText, Collapse, useMediaQuery, useTheme } from '@mui/material';
import QRCode from 'react-qr-code';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { obtenerMatricula } from '../Access/SessionService';

const BaseURL = import.meta.env.VITE_URL_BASE_API;

const Profile = () => {
    const matricula = obtenerMatricula();
    const [studentData, setStudentData] = useState({
        matricula: '',
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
    const [selectedPerformance, setSelectedPerformance] = useState(null);
    const [expandedMedical, setExpandedMedical] = useState(null);
    const [expandedPsychological, setExpandedPsychological] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(BaseURL + `Fulldata/?matricula=${matricula}`);
                const data = response.data.data[0];
                setStudentData({
                    matricula: data.Matricula,
                    nombre: data.Nombre,
                    apaterno: data.APaterno,
                    amaterno: data.AMaterno,
                    cuatrimestre: data.Cuatrimestre,
                    grupo: data.Grupo,
                    nombreCarrera: data.NombreCarrera,
                    email: data.Email,
                    periodo: data.Periodo,
                });
            } catch (error) {
                console.error('Error fetching student data:', error);
                setError('No se pudieron cargar los datos del estudiante.');
            } finally {
                setLoading(false);
            }
        };

        // Seleccionar un perfil de rendimiento al azar al cargar
        const performances = ['Muy Alto Rendimiento', 'Alto Rendimiento', 'Rendimiento Medio', 'Rendimiento Bajo'];
        const randomPerformance = performances[Math.floor(Math.random() * performances.length)];
        setSelectedPerformance(randomPerformance);

        fetchStudentData();
    }, [matricula]);

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
        const year = periodo.slice(0, 4);
        const term = periodo.slice(4);
        return `${year}-${term}`;
    };

    // Datos ficticios para registros de entrada y salida
    const attendanceRecords = [
        { date: '2025-07-15 08:00', type: 'Entrada' },
        { date: '2025-07-15 14:30', type: 'Salida' },
        { date: '2025-07-14 07:45', type: 'Entrada' },
        { date: '2025-07-14 15:00', type: 'Salida' },
        { date: '2025-07-13 08:15', type: 'Entrada' },
        { date: '2025-07-13 14:00', type: 'Salida' },
        { date: '2025-07-12 08:30', type: 'Entrada' },
        { date: '2025-07-12 15:30', type: 'Salida' },
        { date: '2025-07-11 07:50', type: 'Entrada' },
        { date: '2025-07-11 14:45', type: 'Salida' }
    ];

    // Datos ficticios para consultas médicas (3 consultas por perfil)
    const medicalConsultations = {
        'Muy Alto Rendimiento': [
            {
                date: '2025-06-15 10:00',
                reason: 'Chequeo rutinario',
                vitals: 'Presión arterial: 120/80 mmHg, Temperatura: 36.6°C, Frecuencia cardíaca: 70 bpm',
                diagnosis: 'Estado de salud óptimo',
                treatment: 'Ninguno, mantener hábitos saludables',
                recommendations: 'Continuar con dieta balanceada y ejercicio regular',
                doctor: 'Dra. Laura Gómez',
                observations: 'Paciente en excelente condición física.'
            },
            {
                date: '2025-04-10 09:30',
                reason: 'Fatiga leve',
                vitals: 'Presión arterial: 122/82 mmHg, Temperatura: 36.7°C, Frecuencia cardíaca: 72 bpm',
                diagnosis: 'Fatiga por carga académica',
                treatment: 'Suplemento vitamínico, descanso',
                recommendations: 'Ajustar horarios de sueño',
                doctor: 'Dr. Carlos Méndez',
                observations: 'Paciente reporta alta productividad.'
            },
            {
                date: '2025-02-20 11:00',
                reason: 'Revisión post-ejercicio',
                vitals: 'Presión arterial: 118/78 mmHg, Temperatura: 36.5°C, Frecuencia cardíaca: 68 bpm',
                diagnosis: 'Sin hallazgos relevantes',
                treatment: 'Ninguno',
                recommendations: 'Mantener rutina de ejercicio',
                doctor: 'Dra. Sofía Ramírez',
                observations: 'Paciente en buen estado físico.'
            }
        ],
        'Alto Rendimiento': [
            {
                date: '2025-05-20 14:30',
                reason: 'Dolor de cabeza leve',
                vitals: 'Presión arterial: 125/85 mmHg, Temperatura: 36.8°C, Frecuencia cardíaca: 75 bpm',
                diagnosis: 'Cefalea tensional por estrés',
                treatment: 'Paracetamol 500 mg, reposo',
                recommendations: 'Técnicas de relajación, reducir carga académica',
                doctor: 'Dr. Carlos Méndez',
                observations: 'Paciente reporta alta carga de trabajo.'
            },
            {
                date: '2025-03-15 10:00',
                reason: 'Resfriado común',
                vitals: 'Presión arterial: 123/83 mmHg, Temperatura: 37.2°C, Frecuencia cardíaca: 78 bpm',
                diagnosis: 'Infección viral leve',
                treatment: 'Antihistamínico, hidratación',
                recommendations: 'Reposo, aumentar ingesta de líquidos',
                doctor: 'Dra. Laura Gómez',
                observations: 'Paciente en recuperación rápida.'
            },
            {
                date: '2025-01-25 12:00',
                reason: 'Dolor muscular',
                vitals: 'Presión arterial: 124/84 mmHg, Temperatura: 36.6°C, Frecuencia cardíaca: 74 bpm',
                diagnosis: 'Tensión muscular por postura',
                treatment: 'Ibuprofeno 400 mg, ejercicios de estiramiento',
                recommendations: 'Mejorar ergonomía al estudiar',
                doctor: 'Dr. Miguel Torres',
                observations: 'Paciente reporta largas horas de estudio.'
            }
        ],
        'Rendimiento Medio': [
            {
                date: '2025-04-10 09:00',
                reason: 'Malestar estomacal',
                vitals: 'Presión arterial: 130/90 mmHg, Temperatura: 37.0°C, Frecuencia cardíaca: 80 bpm',
                diagnosis: 'Gastritis leve',
                treatment: 'Omeprazol 20 mg, dieta blanda',
                recommendations: 'Evitar alimentos irritantes, seguimiento en 1 semana',
                doctor: 'Dra. Sofía Ramírez',
                observations: 'Paciente reporta consumo frecuente de comida rápida.'
            },
            {
                date: '2025-02-15 11:30',
                reason: 'Dolor abdominal',
                vitals: 'Presión arterial: 128/88 mmHg, Temperatura: 36.9°C, Frecuencia cardíaca: 82 bpm',
                diagnosis: 'Cólico intestinal',
                treatment: 'Buscapina 10 mg',
                recommendations: 'Dieta baja en grasas, hidratación',
                doctor: 'Dr. Carlos Méndez',
                observations: 'Paciente reporta estrés moderado.'
            },
            {
                date: '2024-12-05 10:15',
                reason: 'Alergia estacional',
                vitals: 'Presión arterial: 127/87 mmHg, Temperatura: 36.7°C, Frecuencia cardíaca: 79 bpm',
                diagnosis: 'Rinitis alérgica',
                treatment: 'Antihistamínico oral',
                recommendations: 'Evitar alérgenos, seguimiento en 2 semanas',
                doctor: 'Dra. Laura Gómez',
                observations: 'Paciente responde bien al tratamiento.'
            }
        ],
        'Rendimiento Bajo': [
            {
                date: '2025-03-05 11:15',
                reason: 'Lesión en tobillo',
                vitals: 'Presión arterial: 135/95 mmHg, Temperatura: 36.9°C, Frecuencia cardíaca: 85 bpm',
                diagnosis: 'Esguince de tobillo grado I',
                treatment: 'Vendaje compresivo, ibuprofeno 400 mg',
                recommendations: 'Reposo, elevación del pie, consulta con ortopedista',
                doctor: 'Dr. Miguel Torres',
                observations: 'Paciente reporta poca actividad física.'
            },
            {
                date: '2025-01-10 13:00',
                reason: 'Fiebre y dolor de garganta',
                vitals: 'Presión arterial: 132/92 mmHg, Temperatura: 38.0°C, Frecuencia cardíaca: 88 bpm',
                diagnosis: 'Faringitis viral',
                treatment: 'Paracetamol 500 mg, gárgaras con agua salada',
                recommendations: 'Reposo, hidratación, seguimiento en 3 días',
                doctor: 'Dra. Sofía Ramírez',
                observations: 'Paciente con baja adherencia a hábitos saludables.'
            },
            {
                date: '2024-11-20 09:45',
                reason: 'Dolor de espalda',
                vitals: 'Presión arterial: 134/94 mmHg, Temperatura: 36.8°C, Frecuencia cardíaca: 86 bpm',
                diagnosis: 'Tensión muscular lumbar',
                treatment: 'Analgésico tópico, ejercicios de estiramiento',
                recommendations: 'Mejorar postura, evitar cargar peso',
                doctor: 'Dr. Carlos Méndez',
                observations: 'Paciente reporta sedentarismo.'
            }
        ]
    };

    // Datos ficticios para consultas psicológicas (3 consultas por perfil)
    const psychologicalConsultations = {
        'Muy Alto Rendimiento': [
            {
                date: '2025-06-20 15:00',
                reason: 'Gestión de estrés académico',
                area: 'Académico, emocional',
                diagnosis: 'Buen manejo emocional, busca optimización',
                strategies: 'Técnicas de planificación y mindfulness',
                observations: 'Paciente proactivo, con metas claras y alta motivación.',
                agreements: 'Practicar 10 min de meditación diaria',
                sessions: '1 de 3 sesiones programadas',
                psychologist: 'Lic. Ana Martínez'
            },
            {
                date: '2025-04-25 14:00',
                reason: 'Perfeccionismo',
                area: 'Emocional',
                diagnosis: 'Tendencia al perfeccionismo leve',
                strategies: 'Técnicas cognitivo-conductuales, ejercicios de autoaceptación',
                observations: 'Paciente muestra alta autoexigencia.',
                agreements: 'Establecer metas realistas, revisión en 2 semanas',
                sessions: '2 de 4 sesiones programadas',
                psychologist: 'Lic. Ana Martínez'
            },
            {
                date: '2025-02-10 16:00',
                reason: 'Optimización del rendimiento',
                area: 'Académico',
                diagnosis: 'Sin problemas significativos',
                strategies: 'Técnicas de estudio avanzadas',
                observations: 'Paciente con alta motivación intrínseca.',
                agreements: 'Implementar técnicas de aprendizaje activo',
                sessions: '1 de 2 sesiones programadas',
                psychologist: 'Lic. Roberto Díaz'
            }
        ],
        'Alto Rendimiento': [
            {
                date: '2025-05-25 16:30',
                reason: 'Ansiedad por exámenes',
                area: 'Emocional',
                diagnosis: 'Ansiedad situacional leve',
                strategies: 'Técnicas de respiración, entrevista motivacional',
                observations: 'Paciente con buen desempeño, presión por calificaciones.',
                agreements: 'Establecer horarios de estudio estructurados',
                sessions: '2 de 4 sesiones programadas',
                psychologist: 'Lic. Roberto Díaz'
            },
            {
                date: '2025-03-20 15:30',
                reason: 'Estrés por proyectos',
                area: 'Académico, emocional',
                diagnosis: 'Estrés situacional',
                strategies: 'Gestión del tiempo, mindfulness',
                observations: 'Paciente muestra compromiso, pero sobrecarga.',
                agreements: 'Priorizar tareas, seguimiento en 3 semanas',
                sessions: '1 de 3 sesiones programadas',
                psychologist: 'Lic. Ana Martínez'
            },
            {
                date: '2025-01-15 14:00',
                reason: 'Dificultad para delegar',
                area: 'Social, emocional',
                diagnosis: 'Necesidad de control moderada',
                strategies: 'Técnicas de trabajo en equipo',
                observations: 'Paciente con liderazgo, pero dificultad para delegar.',
                agreements: 'Practicar delegación en proyectos grupales',
                sessions: '1 de 2 sesiones programadas',
                psychologist: 'Lic. Clara López'
            }
        ],
        'Rendimiento Medio': [
            {
                date: '2025-04-15 10:00',
                reason: 'Dificultades de concentración',
                area: 'Académico, conductual',
                diagnosis: 'Falta de hábitos de estudio efectivos',
                strategies: 'Pruebas psicométricas, técnicas de organización',
                observations: 'Paciente distraído, pero con disposición al cambio.',
                agreements: 'Usar técnica Pomodoro, seguimiento en 2 semanas',
                sessions: '1 de 5 sesiones programadas',
                psychologist: 'Lic. Clara López'
            },
            {
                date: '2025-02-05 11:00',
                reason: 'Baja motivación',
                area: 'Emocional, académico',
                diagnosis: 'Motivación extrínseca baja',
                strategies: 'Entrevista motivacional, establecimiento de metas',
                observations: 'Paciente con potencial, pero falta de dirección.',
                agreements: 'Definir objetivos a corto plazo',
                sessions: '2 de 5 sesiones programadas',
                psychologist: 'Lic. Roberto Díaz'
            },
            {
                date: '2024-12-10 10:30',
                reason: 'Ansiedad social leve',
                area: 'Social',
                diagnosis: 'Ansiedad social situacional',
                strategies: 'Técnicas de exposición gradual',
                observations: 'Paciente evita presentaciones públicas.',
                agreements: 'Practicar habilidades sociales, seguimiento en 1 mes',
                sessions: '1 de 4 sesiones programadas',
                psychologist: 'Lic. Ana Martínez'
            }
        ],
        'Rendimiento Bajo': [
            {
                date: '2025-03-10 13:00',
                reason: 'Problemas familiares',
                area: 'Emocional, social',
                diagnosis: 'Estrés crónico por conflictos familiares',
                strategies: 'Terapia cognitivo-conductual, entrevista',
                observations: 'Paciente muestra apatía y baja autoestima.',
                agreements: 'Asistir a terapia semanal, ejercicios de autoafirmación',
                sessions: '3 de 8 sesiones programadas',
                psychologist: 'Lic. Javier Ruiz'
            },
            {
                date: '2025-01-20 12:00',
                reason: 'Baja autoestima',
                area: 'Emocional',
                diagnosis: 'Baja autoestima generalizada',
                strategies: 'Terapia cognitivo-conductual, dinámicas de autoestima',
                observations: 'Paciente con actitud negativa hacia sí mismo.',
                agreements: 'Realizar ejercicios de autoafirmación diaria',
                sessions: '2 de 6 sesiones programadas',
                psychologist: 'Lic. Clara López'
            },
            {
                date: '2024-11-15 14:30',
                reason: 'Falta de motivación académica',
                area: 'Académico, emocional',
                diagnosis: 'Desmotivación crónica',
                strategies: 'Entrevista motivacional, establecimiento de metas',
                observations: 'Paciente con bajo interés en estudios.',
                agreements: 'Definir un plan de estudios personalizado',
                sessions: '1 de 5 sesiones programadas',
                psychologist: 'Lic. Roberto Díaz'
            }
        ]
    };

    const handleMedicalToggle = (index) => {
        setExpandedMedical(expandedMedical === index ? null : index);
    };

    const handlePsychologicalToggle = (index) => {
        setExpandedPsychological(expandedPsychological === index ? null : index);
    };

    return (
        <Container
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { xs: 2, md: 4 },
            }}
            disableGutters
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress sx={{ color: '#921F45' }} />
                </Box>
            ) : error ? (
                <Typography color="error" variant="h6" sx={{ textAlign: 'center', color: '#000', fontSize: { xs: 16, sm: 20 } }}>
                    {error}
                </Typography>
            ) : (
                <Fade in={!loading} timeout={600}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                        {/* Perfil del Estudiante */}
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
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#921F45', mb: 2, fontSize: { xs: 16, sm: 20 } }}>
                                    QR de Acceso
                                </Typography>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: '#fff',
                                        borderRadius: 2,
                                        border: '2px solid #921F45',
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
                                <Box sx={{ width: '100%', mt: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#921F45', mb: 2, fontSize: { xs: 16, sm: 20 } }}>
                                        Registro de Entrada y Salida
                                    </Typography>
                                    <Box
                                        sx={{
                                            maxHeight: { xs: '150px', md: '300px' },
                                            overflowY: 'auto',
                                            pr: 1,
                                        }}
                                    >
                                        <List>
                                            {attendanceRecords.map((record, index) => (
                                                <ListItem
                                                    key={index}
                                                    sx={{
                                                        bgcolor: '#f9f9f9',
                                                        mb: 1,
                                                        borderRadius: 1,
                                                        '&:hover': { bgcolor: '#f0f0f0' }
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={`${record.date}`}
                                                        secondary={`Tipo: ${record.type}`}
                                                        primaryTypographyProps={{ color: '#000', fontWeight: 600, fontSize: { xs: 12, sm: 16 } }}
                                                        secondaryTypographyProps={{ color: '#000', fontSize: { xs: 10, sm: 14 } }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Box>
                            </Card>

                            {/* Student Information Section */}
                            <Card
                                sx={{
                                    flex: 2,
                                    boxShadow: 3,
                                    borderRadius: 3,
                                    bgcolor: '#ffffff',

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

                                            color: '#000',
                                            textTransform: 'capitalize',
                                            fontSize: { xs: 24, sm: 34 },
                                        }}
                                    >
                                        {toTitleCase(fullName) || 'Sin Nombre'}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <AccountCircleIcon
                                            sx={{
                                                fontSize: { xs: 80, sm: 120 },
                                                color: '#921F45',
                                                border: '3px solid #921F45',
                                                borderRadius: '50%',
                                                p: 1,
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#000', mb: 3, fontSize: { xs: 14, sm: 18 } }}>
                                        Foto de Perfil
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 2fr', // siempre dos columnas
                                            gap: 2,
                                            bgcolor: '#f9f9f9',
                                            p: 3,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            Matrícula del Alumno
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            {studentData.matricula}
                                        </Typography>

                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            Correo Electrónico
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            {studentData.email || 'N/A'}
                                        </Typography>

                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            Programa Educativo
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#000', textTransform: 'capitalize', fontSize: { xs: 12, sm: 16 } }}>
                                            {studentData.nombreCarrera.toLowerCase() || 'N/A'}
                                        </Typography>

                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            Cuatrimestre Actual
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            {formatCuatrimestre(studentData.cuatrimestre) || 'N/A'}
                                        </Typography>

                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            Periodo
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            {formatPeriodo(studentData.periodo) || 'N/A'}
                                        </Typography>

                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            Grupo
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            {studentData.grupo || 'N/A'}
                                        </Typography>
                                    </Box>

                                </CardContent>
                            </Card>
                        </Box>

                        {/* Servicios Médicos */}
                        <Card
                            sx={{
                                width: '100%',
                                boxShadow: 3,
                                borderRadius: 3,
                                bgcolor: '#ffffff',
                                p: 4,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <LocalHospitalIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: '#921F45', mr: 2 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: 18, sm: 24 } }}>
                                        Historial de Consultas Médicas
                                    </Typography>
                                </Box>

                                <List>
                                    {selectedPerformance && medicalConsultations[selectedPerformance].length > 0 ? (
                                        medicalConsultations[selectedPerformance].map((consultation, index) => (
                                            <Box key={index}>
                                                <ListItem
                                                    button
                                                    onClick={() => handleMedicalToggle(index)}
                                                    sx={{
                                                        bgcolor: '#f9f9f9',
                                                        mb: 1,
                                                        borderRadius: 1,
                                                        '&:hover': { bgcolor: '#f0f0f0' }
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={`Consulta - ${consultation.date}`}
                                                        secondary={consultation.reason}
                                                        primaryTypographyProps={{ color: '#000', fontWeight: 600, fontSize: { xs: 12, sm: 16 } }}
                                                        secondaryTypographyProps={{ color: '#000', fontSize: { xs: 10, sm: 14 } }}
                                                    />
                                                    <ExpandMoreIcon
                                                        sx={{
                                                            transform: expandedMedical === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            color: '#921F45',
                                                            fontSize: { xs: 20, sm: 24 }
                                                        }}
                                                    />
                                                </ListItem>
                                                <Collapse in={expandedMedical === index} timeout="auto" unmountOnExit>
                                                    <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, ml: 2 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Fecha y Hora: <span style={{ fontWeight: 400 }}>{consultation.date}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Motivo: <span style={{ fontWeight: 400 }}>{consultation.reason}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Signos Vitales: <span style={{ fontWeight: 400 }}>{consultation.vitals}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Diagnóstico: <span style={{ fontWeight: 400 }}>{consultation.diagnosis}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Tratamiento: <span style={{ fontWeight: 400 }}>{consultation.treatment}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Recomendaciones: <span style={{ fontWeight: 400 }}>{consultation.recommendations}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Médico: <span style={{ fontWeight: 400 }}>{consultation.doctor}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Observaciones: <span style={{ fontWeight: 400 }}>{consultation.observations}</span>
                                                        </Typography>
                                                    </Box>
                                                </Collapse>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body1" sx={{ color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            No hay consultas médicas disponibles.
                                        </Typography>
                                    )}
                                </List>
                            </CardContent>
                        </Card>

                        {/* Servicios Psicológicos */}
                        <Card
                            sx={{
                                width: '100%',
                                boxShadow: 3,
                                borderRadius: 3,
                                bgcolor: '#ffffff',
                                p: 4,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <PsychologyIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: '#921F45', mr: 2 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: 18, sm: 24 } }}>
                                        Historial de Consultas Psicológicas
                                    </Typography>
                                </Box>

                                <List>
                                    {selectedPerformance && psychologicalConsultations[selectedPerformance].length > 0 ? (
                                        psychologicalConsultations[selectedPerformance].map((consultation, index) => (
                                            <Box key={index}>
                                                <ListItem
                                                    button
                                                    onClick={() => handlePsychologicalToggle(index)}
                                                    sx={{
                                                        bgcolor: '#f9f9f9',
                                                        mb: 1,
                                                        borderRadius: 1,
                                                        '&:hover': { bgcolor: '#f0f0f0' }
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={`Sesión - ${consultation.date}`}
                                                        secondary={consultation.reason}
                                                        primaryTypographyProps={{ color: '#000', fontWeight: 600, fontSize: { xs: 12, sm: 16 } }}
                                                        secondaryTypographyProps={{ color: '#000', fontSize: { xs: 10, sm: 14 } }}
                                                    />
                                                    <ExpandMoreIcon
                                                        sx={{
                                                            transform: expandedPsychological === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            color: '#921F45',
                                                            fontSize: { xs: 20, sm: 24 }
                                                        }}
                                                    />
                                                </ListItem>
                                                <Collapse in={expandedPsychological === index} timeout="auto" unmountOnExit>
                                                    <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, ml: 2 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Fecha y Hora: <span style={{ fontWeight: 400 }}>{consultation.date}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Motivo: <span style={{ fontWeight: 400 }}>{consultation.reason}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Área de Atención: <span style={{ fontWeight: 400 }}>{consultation.area}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Diagnóstico: <span style={{ fontWeight: 400 }}>{consultation.diagnosis}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Estrategias: <span style={{ fontWeight: 400 }}>{consultation.strategies}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Observaciones: <span style={{ fontWeight: 400 }}>{consultation.observations}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Acuerdos: <span style={{ fontWeight: 400 }}>{consultation.agreements}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Sesiones: <span style={{ fontWeight: 400 }}>{consultation.sessions}</span>
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                                            Psicólogo: <span style={{ fontWeight: 400 }}>{consultation.psychologist}</span>
                                                        </Typography>
                                                    </Box>
                                                </Collapse>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body1" sx={{ color: '#000', fontSize: { xs: 12, sm: 16 } }}>
                                            No hay consultas psicológicas disponibles.
                                        </Typography>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                </Fade>
            )}
        </Container>
    );
};

export default Profile;