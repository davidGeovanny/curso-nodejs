const express = require('express');

const { verificaToken } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');

// Obtener todos los productos
app.get('/productos', [verificaToken], ( req, res ) => {
    // Traer todos los productos
    // Utilizar populate: Usuario y Categoría
    // Paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto
        .find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec( ( err, productosDB ) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( !productosDB ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, ( err, cantidad ) => {
                return res.json({
                    ok: true,
                    productos: productosDB,
                    cantidad
                });
            });

        });
});

// Obtener un producto por ID
app.get('/productos/:id', [verificaToken], ( req, res ) => {
    // Utilizar populate: Usuario y Categoría
    const { id } = req.params;

    Producto
        .findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( ( err, productoDB ) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( !productoDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// Buscar productos
app.get('/productos/buscar/:termino', [verificaToken], ( req, res ) => {
    let { termino } = req.params;

    let regularExpression = new RegExp(termino, 'i'); // Insensible a mayúsculas y minúsculas
    
    Producto
        .find({ nombre: regularExpression })
        .populate('categoria', 'descripcion')
        .exec( ( err, productosDB ) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos: productosDB
            });
        });
});

// Crear un nuevo producto
app.post('/productos', [verificaToken], ( req, res ) => {
    // Guardar el usuario
    // Guardar la categoría

    let { nombre, precioUni, descripcion, categoriaId } = req.body;

    let producto = new Producto();
    producto.nombre = nombre;
    producto.precioUni = precioUni;
    producto.descripcion = descripcion;
    producto.categoria = categoriaId;
    producto.usuario = req.usuario._id;

    producto.save( (err, productoDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// Actualizar un nuevo producto
app.put('/productos/:id', [verificaToken], ( req, res ) => {
    const { id } = req.params;

    let body = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoriaId,
        disponible: req.body.disponible
    }

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, ( err, productoDB ) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// Eliminar un nuevo producto
app.delete('/productos/:id', [verificaToken], ( req, res ) => {
    const { id } = req.params;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, ( err, productoDB ) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;