let usuarios = [];
let seuUsuario = [];
let novoUsuario = [];
let começarBatePapo = true;
let ultimaMsgAnterior="";

function PegarUsuario(novoUsuario){
    novoUsuario.value="";
}

function EnviarUsuario(){
    novoUsuario = { name: document.querySelector("input").value}
    console.log(novoUsuario);
    if(começarBatePapo==true) usuarios.push(novoUsuario);
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",novoUsuario);
    promise.then(ReceberUsuarios);
    promise.catch(TratarErro);
}

function ReceberUsuarios(){
    seuUsuario = novoUsuario;
    document.querySelector(".entrar").classList.add("esconder");
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(atualizarUsuarios);
}

function atualizarUsuarios(resposta){
    usuarios = resposta;
    console.log(usuarios);
    if(começarBatePapo){
        setInterval(ativarBatePapo,3000);
        setInterval(EnviarUsuario,5000);
    } 
    começarBatePapo = false;
}

function TratarErro(erro)
{
    console.log(erro.response.status);
    if(começarBatePapo==true) document.querySelector(".erro").classList.remove("esconder");
}

function ativarBatePapo(){  
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(ImprimirMensagens)
    
}

function ImprimirMensagens(resposta){
    console.log(resposta);
    let msg = document.querySelector(".corpo");
    msg.innerHTML="";
    for(let i=0;i<resposta.data.length;i++){
        if(resposta.data[i].type==="status"){
        msg.innerHTML+= 
        `<div class="${resposta.data[i].type}">
            (${resposta.data[i].time}) ${resposta.data[i].from} ${resposta.data[i].text}
        </div>`;
        }
    if(resposta.data[i].type==="message"){
        msg.innerHTML+= 
        `<div class="${resposta.data[i].type}">
            (${resposta.data[i].time}) ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}
        </div>`;
        }
    if(resposta.data[i].type==="private-message"){
        msg.innerHTML+= 
        `<div class="${resposta.data[i].type}">
        (${resposta.data[i].time}) ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}
        </div>`;
        }
        
    }  
    if(ultimaMsgAnterior !== resposta.data[resposta.data.length-1].time.toString()) {
        window.scrollTo(0, document.body.scrollHeight);
    }
    console.log(ultimaMsgAnterior,"1",resposta.data[resposta.data.length-1].time)
    ultimaMsgAnterior = resposta.data[resposta.data.length-1].time.toString();
}

