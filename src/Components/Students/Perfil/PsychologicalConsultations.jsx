// src/components/PsychologicalConsultations.js
import { Box, Card, CardContent, List, ListItem, ListItemText, Collapse, Typography } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PsychologicalConsultations = ({ selectedPerformance, expandedPsychological, handlePsychologicalToggle }) => {
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

  return (
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
          {selectedPerformance && psychologicalConsultations[selectedPerformance]?.length > 0 ? (
            psychologicalConsultations[selectedPerformance].map((consultation, index) => (
              <Box key={index}>
                <ListItem
                  button
                  onClick={() => handlePsychologicalToggle(index)}
                  sx={{ bgcolor: '#f9f9f9', mb: 1, borderRadius: 1, '&:hover': { bgcolor: '#f0f0f0' } }}
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
  );
};

export default PsychologicalConsultations;