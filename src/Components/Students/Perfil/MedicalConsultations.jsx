// src/components/MedicalConsultations.js
import { Box, Card, CardContent, List, ListItem, ListItemText, Collapse, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MedicalConsultations = ({ selectedPerformance, expandedMedical, handleMedicalToggle }) => {
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
          <LocalHospitalIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: '#921F45', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: 18, sm: 24 } }}>
            Historial de Consultas Médicas
          </Typography>
        </Box>
        <List>
          {selectedPerformance && medicalConsultations[selectedPerformance]?.length > 0 ? (
            medicalConsultations[selectedPerformance].map((consultation, index) => (
              <Box key={index}>
                <ListItem
                  button
                  onClick={() => handleMedicalToggle(index)}
                  sx={{ bgcolor: '#f9f9f9', mb: 1, borderRadius: 1, '&:hover': { bgcolor: '#f0f0f0' } }}
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
              No hay consultas médicas disponibles
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default MedicalConsultations;