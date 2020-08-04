var socket = io();

// Para escuchar información (emit)
socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Desconectado del servidor');
});

// Para enviar información (on)
socket.emit('sendMessage', {
    usuario: 'Geovanny',
    mensaje: 'Hola Mundo'
}, function( res ) {
    console.log('Respuesta de servidor: ', res);
});

socket.on('sendMessage', function( data ) {
    console.log('Servidor: ', data);
});