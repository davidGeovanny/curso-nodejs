const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let { email, password } = req.body;

    Usuario.findOne({ email }, (err, usuarioDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        
        if( !bcrypt.compareSync( password, usuarioDB.password ) ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.KEY_SEED, {
            expiresIn: process.env.EXP_TOKEN
        });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

// Configuraciones de Google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    console.log(payload);

    let { name: nombre, email, picture: img } = payload;

    return {
        nombre,
        email, 
        img, 
        google: true
    };
}

app.post('/google', async (req, res) => {
    let { idtoken: token } = req.body;

    let googleUser = await verify( token )
        .catch( (err) => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    console.log('Obteniendo la información: ', googleUser)

    Usuario.findOne( { email: googleUser.email }, (err, usuarioDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( usuarioDB ) {
            if( !usuarioDB.google ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.KEY_SEED, {
                    expiresIn: process.env.EXP_TOKEN
                });
    
                return res.json( {
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el usuario no existe en la BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'google';

            usuario.save( (err, usuarioDB) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.KEY_SEED, {
                    expiresIn: process.env.EXP_TOKEN
                });
    
                return res.json( {
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })
        }
    });
});

module.exports = app;