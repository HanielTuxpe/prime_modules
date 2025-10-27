// src/components/UserData.js
import { Card, CardContent, Box, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserData = ({ studentData, toTitleCase, formatCuatrimestre, formatPeriodo }) => {
  const fullName = `${studentData.nombre} ${studentData.apaterno} ${studentData.amaterno}`.trim();

  return (
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
            gridTemplateColumns: '2fr 2fr',
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
  );
};

export default UserData;