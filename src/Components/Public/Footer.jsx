import React, { useState } from "react";
import { Box, Link, Typography, IconButton, useTheme, Container, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ResponsiveFooter = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [showLinks, setShowLinks] = useState(false);

    const toggleLinks = () => {
        setShowLinks((prev) => !prev);
    };

    return (
        <Box
            component="footer"
            bgcolor="primary.main"
            color="white"
            p={2}
            mt={2}
            textAlign="center"
            sx={{
                boxShadow: theme.custom.boxShadow, // Aplica el boxShadow solo en modo oscuro
            }}
        >
            <Container maxWidth="lg"
                sx={{
                    '@media (min-width: 600px)': {
                        paddingLeft: 0, // Elimina el padding a partir de 600px
                        paddingRight: 0, // Elimina el padding a partir de 600px
                    },
                    '@media (min-width: 1200px)': {
                        maxWidth: "none",
                    },
                }}
            >
                <Box>
                    {isSmallScreen ? (
                        <Box>
                            {/* Texto y flecha */}
                            <Box display="flex" alignItems="center" justifyContent="center">

                                <Typography variant={"h7"}>
                                    Universidad Tecnológica de la Huasteca Hidalguense
                                </Typography>

                                <IconButton onClick={toggleLinks} color="inherit">
                                    {showLinks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                            {/* Enlaces en columna */}
                            {showLinks && (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={1}
                                    mt={1}
                                >
                                    <Link href="/privacy-policy" variant={"h7"} sx={{ color: "#fff", textDecoration: "none" }}>
                                        Política de Privacidad
                                    </Link>
                                    <Link href="/terms-conditions" variant={"h7"} sx={{ color: "#fff", textDecoration: "none" }}>
                                        Términos y Condiciones
                                    </Link>
                                    <Link href="/legal-disclaimer" variant={"h7"} sx={{ color: "#fff", textDecoration: "none" }}>
                                        Deslinde Legal
                                    </Link>
                                    <Link href="/about"  variant={"h7"} sx={{ color: "#fff", textDecoration: "none" }}>
                                        Acerca de...
                                    </Link>
                                </Box>
                            )}
                        </Box>

                    ) : (

                        <Box
                            display="flex"
                            flexDirection={isSmallScreen ? "column" : "row"}
                            justifyContent="space-between"
                            alignItems="center"
                            gap={1}
                        >

                            <Typography variant={"h7"}>
                                Universidad Tecnológica de la Huasteca Hidalguense
                            </Typography>


                            <Box
                                display="flex"
                                flexDirection={isSmallScreen ? "column" : "row"}
                                gap={1}
                                alignItems="center"
                            >
                                <Link href="/privacy-policy" variant={"h7"} sx={{ color: '#fff', textDecoration: 'none' }}>
                                    Política de Privacidad
                                </Link>
                                <Link href="/terms-conditions" variant={"h7"} sx={{ color: '#fff', textDecoration: 'none' }}>
                                    Términos y Condiciones
                                </Link>
                                <Link href="/legal-disclaimer" variant={"h7"} sx={{ color: '#fff', textDecoration: 'none' }}>
                                    Deslinde Legal
                                </Link>
                                <Link href="/about" variant={"h7"} sx={{ color: '#fff', textDecoration: 'none' }}>
                                    Acerca de...
                                </Link>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Container >
        </Box >

    );
};

export default ResponsiveFooter;
