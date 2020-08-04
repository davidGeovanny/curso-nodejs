const axios = require('axios');

const getLugarLatLng = async (direction) => {
    const encodedUrl = encodeURI(direction);
    
    const instance = axios.create({
        baseURL: `https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php?location=${ encodedUrl }`,
        headers: {
            'x-rapidapi-key': '06b8b8158bmsh5036bad23560f19p167fddjsn94ed1a258ad3'
        }
    });
    
    const respuesta = await instance.get();

    if( respuesta.data.Results.length === 0 ) {
        throw new Error(`No hay resultados para ${ direction }`);
    }

    const { name: direccion, lat, lon: lng } = respuesta.data.Results[0];

    return {
        direccion,
        lat,
        lng
    };
};

module.exports = {
    getLugarLatLng
}
