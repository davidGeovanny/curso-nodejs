var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderizarUsuarios( personas ) {
    console.log('Dentro de renderizar usuarios');
    console.log(personas);
    var html = `
        <li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${ params.get('sala') }</span></a>
        </li>`
    ;

    personas.forEach( ( persona ) => {
        html += `
            <li>
                <a data-id="${ persona.id }" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${ persona.nombre } <small class="text-success">online</small></span></a>
            </li>`
        ;
    });

    divUsuarios.html( html );
}

// Listeners
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    if( id ) {
        console.log(id)
    }
});

formEnviar.on('submit', function( e ) {
    e.preventDefault();

    if( txtMensaje.val().trim().length === 0 ) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre,
        mensaje: txtMensaje.val()
    }, function(resp) {
        txtMensaje.val('').focus;
        renderizarMensajes( resp, true );
        scrollBottom();
    });
});

function renderizarMensajes( mensaje, propio ) {
    var fecha = new Date( mensaje.fecha );
    var hora = `${ fecha.getHours() } : ${ fecha.getMinutes() }`;

    var adminClass = 'inverse';
    if( mensaje.nombre === 'Administrador' ) {
        adminClass = 'danger';
    }

    if( propio ) {
        var html = `
            <li class="animated fadeIn">
                <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>
                <div class="chat-content">
                    <h5>${ mensaje.nombre }</h5>
                    <div class="box bg-light-info">${ mensaje.mensaje }</div>
                </div>
                <div class="chat-time">${ hora }</div>
            </li>`
        ;
    } else {
        var imagen = mensaje.nombre !== 'Administrador' 
            ? `<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>`
            : '';

        var html = `
            <li class="reverse">
                <div class="chat-content">
                    <h5>${ mensaje.nombre }</h5>
                    <div class="box bg-light-${ adminClass }">${ mensaje.mensaje }</div>
                </div>
                ${ imagen }
                <div class="chat-time">${ hora }</div>
            </li>`
        ;
    }

    divChatBox.append( html );
}

function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}