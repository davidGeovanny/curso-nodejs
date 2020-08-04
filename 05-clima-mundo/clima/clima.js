const axios = require('axios');

const getClima = async ( lat, lng ) => {
    const resp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lng }&appid=03c84953048cf30954ac865807447c1c&units=metric`);

    return resp.data.main.temp;
}

module.exports = {
    getClima
};