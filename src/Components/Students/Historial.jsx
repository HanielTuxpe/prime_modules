  // Datos ficticios para consultas médicas
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

  // Datos ficticios para consultas psicológicas
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