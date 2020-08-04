const express = require('express');

let { verificaToken, verificaAdmin } = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');

// Mostrar todas las categorías
app.get('/categoria', [verificaToken], ( req, res ) => {
    Categoria
        .find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( ( err, categoriasDB ) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categorias: categoriasDB
            });
        });
});

// Mostrar una categoría específica
app.get('/categoria/:id', [verificaToken], ( req, res ) => {
    const { id } = req.params;

    Categoria.findById( id, ( err, categoriaDB ) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Crear nueva categoría
app.post('/categoria', [verificaToken], ( req, res ) => {
    // Retorna dicha categoría
    let { descripcion } = req.body;

    let categoria = new Categoria();
    categoria.descripcion = descripcion;
    categoria.usuario = req.usuario._id;
    // req.usuario.id

    categoria.save( (err, categoriaDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar una categoría
app.put('/categoria/:id', [verificaToken], ( req, res ) => {
    const { id } = req.params;
    let { descripcion } = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion }, { new: true, runValidators: true, context: 'query' }, ( err, categoriaDB ) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Eliminar categoría
app.delete('/categoria/:id', [verificaToken, verificaAdmin], ( req, res ) => {
    // Solo un administrador puede borrar categorías
    // Categoria.findByIdAndRemove
    const { id } = req.params;

    Categoria.findByIdAndRemove(id, { context: 'query' }, ( err, categoriaDB ) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

module.exports = app;