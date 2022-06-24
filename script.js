let usuarios = [];
let seuUsuario = [];
let novoUsuario = [];
let começarBatePapo = true;
let ultimaMsgAnterior = "";
let destinatario = "Todos";
let tipo = "message";

function PegarUsuario(novoUsuario) {
    novoUsuario.value = "";
}

function EnviarUsuario() {
    novoUsuario = { name: document.querySelector("input").value }
    console.log(novoUsuario);
    let promise;
    if (começarBatePapo == true) {
        promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", novoUsuario);
    }
    else {
        promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", novoUsuario);
    }
    promise.then(ReceberUsuarios);
    promise.catch(TratarErro);
}

function EnviarMsgAoServidor() {
    let msg = document.querySelectorAll("input");
    let novaMsg = {
        from: seuUsuario.name,
        to: destinatario,
        text: msg[1].value,
        type: tipo
    }
    promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMsg);
    promise.then(ativarBatePapo);
    promise.catch(TratarErroMsg);
    msg[1].value = "Escreva aqui...";
    console.log(novaMsg.to,novaMsg.type);
}

function ReceberUsuarios() {
    seuUsuario = novoUsuario;
    document.querySelector(".entrar").classList.add("esconder");
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(atualizarUsuarios);
}

function atualizarUsuarios(resposta) {
    usuarios = resposta.data;
    console.log(usuarios);
    if (começarBatePapo) {
        setInterval(ativarBatePapo, 3000);
        setInterval(EnviarUsuario, 5000);
    }
    começarBatePapo = false;
}

function TratarErroMsg() {
    window.location.reload();
}
function TratarErro(erro) {
    console.log(erro.response.status);
    if (começarBatePapo == true) document.querySelector(".erro").classList.remove("esconder");
}

function ativarBatePapo() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(ImprimirMensagens)

}

function ImprimirMensagens(resposta) {
    console.log(resposta);
    let msg = document.querySelector(".corpo");
    msg.innerHTML = "";
    for (let i = 0; i < resposta.data.length; i++) {
        if (resposta.data[i].type === "status") {
            msg.innerHTML +=
                `<div class="${resposta.data[i].type}">
            (${resposta.data[i].time}) <b>${resposta.data[i].from}</b> ${resposta.data[i].text}
        </div>`;
        }
        if (resposta.data[i].type === "message") {
            msg.innerHTML +=
                `<div class="${resposta.data[i].type}">
            (${resposta.data[i].time}) <b>${resposta.data[i].from}</b> para <b>${resposta.data[i].to}</b>: ${resposta.data[i].text}
        </div>`;
        }
        
        if (resposta.data[i].type === "private_message") {
            console.log(resposta.data[i].to, seuUsuario.name, resposta.data[i].to, destinatario)
            if (resposta.data[i].to === seuUsuario.name || resposta.data[i].to === destinatario) {
                msg.innerHTML +=
                    `<div class="${resposta.data[i].type}">
        (${resposta.data[i].time}) <b>${resposta.data[i].from}</b> para <b>${resposta.data[i].to}</b>: ${resposta.data[i].text}
        </div>`;
            }
        }

    }
    if (ultimaMsgAnterior !== resposta.data[resposta.data.length - 1].time.toString()) {
        window.scrollTo(0, document.body.scrollHeight);
    }
    ultimaMsgAnterior = resposta.data[resposta.data.length - 1].time.toString();
}

function menuLateral() {
    document.querySelector(".menu-lateral").classList.remove("esconder");
    let itemsLaterais = document.querySelector(".lateral");
    console.log(usuarios);
    itemsLaterais.innerHTML =
    `<div>Escolha um contato para enviar mensagem:</div>
        <div class="item-lateral" onclick="selecionarContatoLateral(this)">
            <ion-icon name="people"></ion-icon>
            <div>Todos</div>
    </div> `;
    for (let i = 0; i < usuarios.length; i++) {
        itemsLaterais.innerHTML +=
            `<div class="item-lateral" onclick="selecionarContatoLateral(this)">
                <ion-icon name="people"></ion-icon>
                <div>${usuarios[i].name}</div> 
             </div>`;
    }
}

function selecionarContatoLateral(contato) {
    destinatario = contato.querySelector("div").innerHTML;
    if (destinatario === "Todos") {
        tipo = "message";
        const msgTodos = document.querySelector(".msg-privada")
        msgTodos.innerHTML ="";
        console.log("aaaa");
    }
    if (destinatario !== "Todos") {
        tipo = "private_message";
        const msgReservada= document.querySelector(".msg-privada");
        
        msgReservada.innerHTML = `Enviando para ${destinatario} (reservadamente)`;
        console.log("bbb");
    }
    document.querySelector(".menu-lateral").classList.add("esconder");
    console.log(destinatario, tipo);
}
