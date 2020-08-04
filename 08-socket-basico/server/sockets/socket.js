const { io } = require('../server');

io.on('connection', ( client ) => {
    console.log('Usuario conectado');

    client.emit('sendMessage', {
        usuario: 'Admin',
        mensaje: 'Bienvenido a la aplicación de sockets'
    });

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    client.on('sendMessage', ( message, callback ) => {
        console.log(message);

        client.broadcast.emit('sendMessage', message);

        // if( message.usuario ) {
        //     callback({
        //         res: 'Todo salió bien'
        //     });
        // } else {
        //     callback({
        //         res: 'Todo salió mal'
        //     });
        // }
    });
});