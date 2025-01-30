import { Container, Typography, Button } from "@mui/material";

function Error400() {
    return (
        <center style={{ marginTop: '1%' }}>
            <Container maxWidth="sm">
                <div className="text-center">
                    <img
                        src="/src/assets/error.png"
                        alt="400 Error"
                        style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}
                    />
                    <Typography variant="h3" color="primary" gutterBottom>
                        ERROR 400
                    </Typography>
                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        Solicitud incorrecta
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        Hubo un problema con tu solicitud. Por favor, revisa los datos e inténtalo de nuevo.
                    </Typography>
                    <Button variant="contained" color="primary" href="/">
                        Volver al inicio
                    </Button>
                </div>
            </Container>
        </center>
    );
}

function Error404() {
    return (
        <center style={{ marginTop: '1%' }}>
            <Container maxWidth="sm">
                <div className="text-center">

                    <img
                        src="/src/assets/error.png"
                        alt="404 Error"
                        style={{ width: '100%', maxWidth: '300px', }}
                    />

                    <Typography variant="h3" color="primary" gutterBottom>
                        ERROR 404
                    </Typography>

                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        Página no encontrada
                    </Typography>

                    <Typography variant="body1" color="textSecondary" paragraph>
                        Lo sentimos, la página que buscas no existe.
                    </Typography>

                    <Button variant="contained" color="primary" href="/">
                        Volver al inicio
                    </Button>
                </div>
            </Container>
        </center>
    );
}

function Error500() {
    return (
        <center style={{ marginTop: '1%' }}>
            <Container maxWidth="sm">
                <div className="text-center">
                    <img
                        src="/src/assets/error.png"
                        alt="500 Error"
                        style={{ width: '100%', maxWidth: '300px' }}
                    />
                     <Typography variant="h3" color="primary" gutterBottom>
                        ERROR 500
                    </Typography>
                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        Error interno del servidor
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        Algo salió mal en nuestro lado. Estamos trabajando en solucionarlo.
                    </Typography>
                    <Button variant="contained" color="primary" href="/">
                        Volver al inicio
                    </Button>
                </div>
            </Container>
        </center>
    );
}

export { Error400, Error404, Error500 };
