var chatRef = null;
var mensaje = $("#message");
var autor = $("#autor");

//firebase
var firebaseConfig = {
    apiKey: "AIzaSyCbx4pEetaNT9hPH072eEEhl6kTA-oPcCE",
    authDomain: "restaurant-b07d5.firebaseapp.com",
    databaseURL: "https://restaurant-b07d5.firebaseio.com",
    projectId: "restaurant-b07d5",
    storageBucket: "restaurant-b07d5.appspot.com",
    messagingSenderId: "626535033218",
    appId: "1:626535033218:web:adfd78204d11c0266ec79b",
    measurementId: "G-Q0CGDN6HE1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var dbRef = firebase.database().ref();

$("#saveAutor").on("click", function () {
    if (autor.val().trim() !== '') {
        let nomAutor = autor.val().trim() + new Date().getTime();
        ocultar(nomAutor);
    } else {
        alert("Escribe un nombre para poder continuar");
    }

});

function ocultar(nomAutor) {
    localStorage.setItem("nombreAutor", nomAutor);
    autor.val(nomAutor).hide();
    $("#saveAutor").hide();
    $("#contenido").show();
    $("#message").attr("placeholder", nomAutor + ', Escribe tu mensaje...');
    initChat();
}

mensaje.on("keypress", function (event) {
    var codigo = event.which || event.keyCode;
    let nomAutor = autor.val();
    console.log("Presionada: " + codigo);
    if (codigo === 13) {
        console.log("Tecla ENTER");
        var message = mensaje.val();
        console.log('message ->> ', message);
        if (message.trim() !== '') {
            var f = new Date();
            let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear()
            console.log('fecha -> ', fecha)
            chatRef.push({
                mensaje: message,
                userEnvio: nomAutor,
                fecha: fecha
            });
        }
        mensaje.val('');
    }
});

$(document).ready(function () {
    let nomAutor = localStorage.getItem("nombreAutor");
    console.log("ready autor -> ", nomAutor);
    if (nomAutor !== 'undefined' && nomAutor !== null) {
        ocultar(nomAutor);
    }

});

function template(mensaje, userEnvio) {
    console.log('mensaje --> ', mensaje, ' userEnvio ', userEnvio);
    var tem = "";
    let nomAutor = autor.val();
    if (userEnvio === nomAutor) {
        temp = '<div class="d-flex justify-content-end mb-4">' +
            '       <div class="msg_cotainer_send">' + mensaje +
            '           <span class="msg_time">' + userEnvio + '</span>' +
            '        </div>' +
            '        <div class="img_cont_msg">' +
            '           <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">' +
            '        </div>' +
            '    </div>'
    } else {
        temp = ' <div class="d-flex justify-content-start mb-4">' +
            '         <div class="img_cont_msg">' +
            '             <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">' +
            '         </div>' +
            '       <div class="msg_cotainer">' + mensaje +
            '           <span class="msg_time">' + userEnvio + '</span>'
        '       </div>' +
        '    </div> ';
    }
    return temp;
}

function initChat() {
    chatRef = dbRef.child('chat/global');
    chatRef.on('child_added', function (data) {
        console.log('data -> ', data.val());
        $('#chat').append(template(data.val().mensaje, data.val().userEnvio));
    });
}
