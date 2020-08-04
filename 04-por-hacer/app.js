// const argv = require('yargs').argv;
const { argv } = require('./config/yargs');
const { crear, getListado, actualizar, borrar } = require('./por-hacer/por-hacer');

const colors = require('colors');

console.log(argv);

let comando = argv._[0];

switch (comando) {
    case 'crear':
        console.log('Crear por hacer');
        let tarea = crear(argv.descripcion);
        console.log(tarea);
        break;
    case 'listar':
        console.log('Listar tareas por hacer');
        let listado = getListado(argv.filtro);
        console.log('Por Hacer'.underline.green);
        for (const tarea of listado) {
            // console.log('========='.green);
            console.log(tarea.descripcion);
            console.log('Estado: ', tarea.completado);
            console.log('========='.green);
        }
        break;
    case 'actualizar':
        console.log('Actualizar una tarea por hacer');
        let actualizado = actualizar(argv.descripcion, argv.completado);
        console.log(actualizado);
        break;
    case 'borrar':
        console.log('Borrar una tarea por hacer');
        let borrado = borrar(argv.descripcion);
        console.log(borrado);
        break;

    default:
        console.log('El comando no es reconocido');
        break;
}