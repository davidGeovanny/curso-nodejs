const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control'); 

let ticketControl = new TicketControl();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });



    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('siguienteTicket', ( data, callback ) => {
        let siguiente = ticketControl.siguienteTicket();
        console.log(siguiente);

        callback( siguiente );
    });

    client.on('atenderTicket', ( data, callback ) => {
        if( !data.escritorio ) {
            return callback({
                err: true,
                message: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket( data.escritorio );

        callback( atenderTicket );

        // Actualizar los últimos 4
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.obtenerUltimos4()
        });
    });

    // Emitir un evento llamado: estadoActual
    client.emit('estadoActual', {
        actual: ticketControl.obtenerTicketActual(),
        ultimos4: ticketControl.obtenerUltimos4()
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        console.log(data);

        client.broadcast.emit('enviarMensaje', data);


        // if (mensaje.usuario) {
        //     callback({
        //         resp: 'TODO SALIO BIEN!'
        //     });

        // } else {
        //     callback({
        //         resp: 'TODO SALIO MAL!!!!!!!!'
        //     });
        // }



    });

});