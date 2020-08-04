const { getLugarLatLng } = require('./lugar/lugar');
const { getClima } = require('./clima/clima');

const argv = require('yargs').options({
    direccion: {
        alias: 'd',
        desc: 'Dirección de la ciudad para obtener el clima',
        demand: true
    }
}).argv;

// getLugarLatLng( argv.direccion )
//     .then( (resp) => {
//         console.log(resp);
//     });

// getClima( 35, 139 )
//     .then( (resp) => {
//         console.log(resp);
//     })
//     .catch( (err) => {
//         console.log('Error: ', err);
//     });

const getInfo = async ( direction ) => {    
    try {
        let { lat, lng, direccion } = await getLugarLatLng( direction );
    
        let clima = await getClima( lat, lng );
    
        return `El clima de ${ direccion } es de ${ clima }`;
    } catch (error) {
        return `No se pudo determinar el clima de ${ direction }`;
    }
};

getInfo( argv.direccion )
    .then( (resp) => {
        console.log(resp);
    })
    .catch( (err) => {
        console.log(err);
    });