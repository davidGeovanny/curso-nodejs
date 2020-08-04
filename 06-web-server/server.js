// Esta aplicación está desplegada en Heroku

const express = require('express');
const app = express();

const hbs = require('hbs');
require('./hbs/helpers');

const port = process.env.PORT || 3000;

app.use( express.static( __dirname + '/public' ) );

// Express HBS Engine
app.set('view engine', 'hbs');
// Register Partials
hbs.registerPartials( __dirname + '/views/partials' );

app.get('/', function( req, res ) {
    res.render('home', {
        nombre: 'David'
    });
});

app.get('/about', function( req, res ) {
    res.render('about');
});

// app.get('/', function( req, res ) {
//     let salida = {
//         nombre: 'David',
//         edad: 32,
//         url: req.url
//     };

//     res.send(salida);
//     // res.send('Hola Mundo');
// });

app.get('/data', function( req, res ) {
    res.send('Hola Data');
});

app.listen(port, () => {
    console.log(`Escuchando peticiones en el puerto ${ port }`);
});