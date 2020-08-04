function saludar(nombre) {
    let mensaje = `Hola ${ nombre }`;

    return mensaje;
}

let saludo = saludar('David');

console.log(saludo);