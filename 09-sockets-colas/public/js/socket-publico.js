var socket = io();

var lblTickets = [
    lblTicket1 = $('#lblTicket1'),
    lblTicket2 = $('#lblTicket2'),
    lblTicket3 = $('#lblTicket3'),
    lblTicket4 = $('#lblTicket4')
];

var lblEscritorios = [
    lblEscritorio1 = $('#lblEscritorio1'),
    lblEscritorio2 = $('#lblEscritorio2'),
    lblEscritorio3 = $('#lblEscritorio3'),
    lblEscritorio4 = $('#lblEscritorio4')
];

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Desconectado del servidor');
});

socket.on('estadoActual', function( data ) {
    actualizaHTML( data.ultimos4 );
});

socket.on('ultimos4', function( data ) {
    // var audio = new Audio('audio/new-ticket.mp3');
    // audio.play();
    actualizaHTML( data.ultimos4 );
});

function actualizaHTML( ultimos4 ) {
    for (let index = 0; index < ultimos4.length; index++) {
        lblTickets[ index ].text(`Ticket ${ ultimos4[ index ].numero }`);
        lblEscritorios[ index ].text(`Escritorio ${ ultimos4[ index ].escritorio }`);
    }
}