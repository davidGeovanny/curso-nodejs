require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use( express.static( path.resolve( __dirname, '../public' ) ) );

app.use( require('./routes/index') );

mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if( err ) {
        throw err;
    }
    console.log('Conexión con base de datos');
});

// .then( (res) => {
//     console.log('Conexión con base de datos');
// }).catch( (err) => {
//     console.log(err);
// });

 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});