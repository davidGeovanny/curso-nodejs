const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin } = require('../middlewares/authentication');
const app = express();

app.get('/usuario', verificaToken , function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario
        .find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuariosDB) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    usuarios: usuariosDB,
                    cantidad
                });
            });
        });
});

app.post('/usuario', [verificaToken, verificaAdmin], function (req, res) {
    let { nombre, email, password, role } = req.body;

    let usuario = new Usuario({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    usuario.save( (err, usuarioDB) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });

    });

    // if( nombre === undefined ) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         persona: req.body
    //     });
    // }
});

app.put('/usuario/:id', [verificaToken, verificaAdmin], function (req, res) {
    let id = req.params.id;
    // let body = req.body;
    /** Solo atributos válidos */
    let body = _.pick(req.body, [
        'nombre',
        'email',
        'img',
        'role',
        'estado'
    ]);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', verificaToken, function (req, res) {
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id,  (err, usuarioDeleted) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true },  (err, usuarioDeleted) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        if( !usuarioDeleted ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDeleted
        });
    });
});

module.exports = app;