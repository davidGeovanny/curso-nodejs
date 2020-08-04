// let getNombre = async () => {
//     // throw new Error('No existe un nombre para ese usuario');

//     return 'David';
// };

let getNombre = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('David');
        }, 3000);
    });
};

let saludo = async () => {
    let nombre = await getNombre();
    return `Hola ${ nombre }`
};

// console.log(getNombre());

saludo().then((mensaje) => {
    console.log(mensaje);
}).catch((error) => {
    console.log('Error de async: ', error);
});