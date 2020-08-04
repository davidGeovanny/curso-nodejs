const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use( fileUpload() );

app.put('/upload/:tipo/:id', ( req, res ) => {
    let { tipo, id } = req.params;

    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let fileName = archivo.name.split('.');
    let extensionFile = fileName[ fileName.length - 1 ];

    // Extensiones permitidas
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if( validExtensions.indexOf( extensionFile ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + validExtensions.join(', ')
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionFile }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, ( err ) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
            default:
                break;
        }

        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });
    });
});

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, ( err, usuarioDB ) => {
        if( err ) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !usuarioDB ) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save( (err, usuarioGuardado) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
};

const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, ( err, productoDB ) => {
        if( err ) {
            borrarArchivo( nombreArchivo, 'productos' );
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            borrarArchivo( nombreArchivo, 'productos' );
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borrarArchivo( productoDB.img, 'productos' );

        productoDB.img = nombreArchivo;
        productoDB.save( ( err, productoGuardado ) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
};

const borrarArchivo = (nombreImagen, tipo) => {
    let pathImg = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreImagen }` );
    if( fs.existsSync(pathImg) ) {
        fs.unlinkSync(pathImg);
    }
};

module.exports = app;