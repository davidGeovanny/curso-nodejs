// Comando para establecer comunicación con el socket
var socket = io();

var label = $('#lblNuevoTicket');

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Desconectado del servidor');
});

socket.on('estadoActual', function( data ) {
    label.text(data.actual);
});

$('button').on('click', function() {
    socket.emit('siguienteTicket', null, function( data ) {
        label.text(data);
    });
});