let empleados = [
    {
        id: 1,
        nombre: 'David'
    },
    {
        id: 2,
        nombre: 'Geovanny'
    },
    {
        id: 3,
        nombre: 'Windroma'
    }
];

let salarios = [
    {
        id: 1,
        salario: 1000
    },
    {
        id: 2,
        salario: 2000
    }
];

let getEmpleado = (id, callback) => {
    let empleadoDB = empleados.find((empleado) => empleado.id === id);

    if( !empleadoDB ) {
        callback(`No existe un empleado con el ID ${ id }`);
    } else {
        callback(null, empleadoDB);
    }
}

let getSalario = (empleado, callback) => {
    let salarioDB = salarios.find((salario) => salario.id === empleado.id);

    if( !salarioDB ) {
        callback(`No se encontró un salario para el usuario ${ empleado.nombre }`);
    } else {
        callback(null, {
            nombre: empleado.nombre,
            salario: salarioDB.salario
        });
    }
}

getEmpleado(2, (err, empleado) => {
    if( err ) {
        return console.log(err);
    }
    getSalario(empleado, (err, respuesta) => {
        if( err ) {
            return console.log(err);
        }
        console.log(respuesta);
    });
});