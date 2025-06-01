import Cookies from 'js-cookie';

const SESSION_COOKIE_NAME = 'session';
const MATRICULA_COOKIE_NAME = 'matricula';

export const iniciarSesion = (tipoUsuario, matricula) => {
    const options = {
        expires: 20 / (24 * 60), // 20 minutos
        sameSite: 'None',
        secure: true,
    };

    Cookies.set(SESSION_COOKIE_NAME, tipoUsuario, options);
    Cookies.set(MATRICULA_COOKIE_NAME, matricula, options);
};

export const cerrarSesion = () => {
    Cookies.remove(SESSION_COOKIE_NAME);
    Cookies.remove(MATRICULA_COOKIE_NAME);
};

export const obtenerTipoUsuario = () => {
    return Cookies.get(SESSION_COOKIE_NAME);
};

export const obtenerMatricula = () => {
    return Cookies.get(MATRICULA_COOKIE_NAME);
};
