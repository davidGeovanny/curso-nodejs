const descripcion = {
    demand: true,
    alias: 'd',
    desc: 'Descripción de la tarea por hacer'
};

const completado = {
    demand: false,
    alias: 'c',
    default: true,
    type: 'boolean',
    desc: 'Marca como completado o pendiente la tarea'
}

const filtro = {
    demand: false,
    alias: 'f',
    default: undefined,
    type: 'boolean',
    desc: 'Argumento de búsqueda de las tareas'
}

const argv = require('yargs')
            .command('crear', 'Crear un elemento por hacer',  { descripcion } )
            .command('actualizar', 'Actualiza el estado completado de una tarea', { descripcion, completado })
            .command('listar', 'Lista todas las tareas por hacer', { filtro })
            .command('borrar', 'Borra una tarea por hacer', { descripcion })
            .help()
            .argv;

module.exports = {
    argv
};