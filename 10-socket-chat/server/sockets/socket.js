const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', ( data, callback ) => {
        if( !data.nombre || !data.sala ) {
            return callback({
                err: true,
                message: 'El nombre y sala son necesarios'
            });
        }

        client.join( data.sala );
        
        usuarios.agregarPersona( client.id, data.nombre, data.sala );
        callback( usuarios.obtenerPersonasPorSala( data.sala ) );

        client.broadcast.to( data.sala ).emit('listaPersonas', usuarios.obtenerPersonasPorSala( data.sala ));
        client.broadcast.to( data.sala ).emit('crearMensaje', crearMensaje( 'Administrador', `${ data.nombre } se ha unido al chat` ));
    });

    client.on('disconnect', () => {
        let usuarioBorrado = usuarios.borrarPersona( client.id );
        
        client.broadcast.to( usuarioBorrado.sala ).emit('crearMensaje', crearMensaje( 'Administrador', `${ usuarioBorrado.nombre } salió del chat` ));
        client.broadcast.to( usuarioBorrado.sala ).emit('listaPersonas', usuarios.obtenerPersonasPorSala( usuarioBorrado.sala ));
    });

    client.on('crearMensaje', ( data, callback ) => {
        let persona = usuarios.obtenerPersona( client.id );
        let mensaje = crearMensaje( persona.nombre, data.mensaje );

        client.broadcast.to( persona.sala ).emit('crearMensaje', mensaje);

        callback( mensaje );
    });

    // Mensajes privados
    client.on('mensajePrivado', ( data ) => {
        let persona = usuarios.obtenerPersona( client.id );

        client.broadcast.to( data.para ).emit('mensajePrivado', crearMensaje( persona.nombre, data.mensaje ));
    });
});