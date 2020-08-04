const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/authentication');

const app = express();

app.get('/imagen/:tipo/:img', [verificaTokenImg], ( req, res ) => {
    let { tipo, img } = req.params;

    let pathImg = path.resolve( __dirname, `../../uploads/${ tipo }/${ img }` );

    let noImagePath = path.resolve( __dirname, '../assets/no-image.jpg' );

    if( fs.existsSync(pathImg) ) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(noImagePath);
    }
    
});

module.exports = app;