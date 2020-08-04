const jwt = require('jsonwebtoken');

const verificaToken = ( req, res, next ) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.KEY_SEED, (err, decoded) => {
        if( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

    // res.json({
    //     token,
    // });
};

/**
 * Verifica si es administrador
 */
const verificaAdmin = ( req, res, next ) => {
    let { role } = req.usuario;

    if( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Solo el administrador puede realizar estos cambios'
            }
        });
    }
    next();
};

/** 
 * Verifica token para una imagen
 */
const verificaTokenImg = (req, res, next) => {
    let { token } = req.query;

    jwt.verify(token, process.env.KEY_SEED, (err, decoded) => {
        if( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdmin,
    verificaTokenImg
};