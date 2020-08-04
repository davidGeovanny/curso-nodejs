var socket = io();

var small = $('small');

// Obtener los parámetros por URL
var searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}

var escritorio = searchParams.get('escritorio');
$('h1').text(`Escritorio ${ escritorio }`);

$('button').on('click', function() {
    socket.emit('atenderTicket', { escritorio }, function( data ) {
        if( data === 'No hay tickets' ) {
            alert(data);
            small.text( data );
            return;
        }
        small.text(`Ticket: ${ data.numero }`);
    });
});