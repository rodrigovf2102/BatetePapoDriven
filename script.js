let usuarios = [];
let seuUsuario = [];
let novoUsuario = [];
let começarBatePapo = true;

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
    if(começarBatePapo) ativarBatePapo();
    começarBatePapo = false;
}

function TratarErro(erro)
{
    console.log(erro.response.status);
    if(começarBatePapo==true) document.querySelector(".erro").classList.remove("esconder");
}

function ativarBatePapo(){
    setInterval(EnviarUsuario,5000);
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(ImprimirMensagens)
}

function ImprimirMensagens(resposta){
    console.log(resposta);
    for(let i=0;i<resposta.data.length;i++){
        if(resposta.data[i].type==="status"){
        document.querySelector(".corpo").innerHTML+= 
        `<div class="${resposta.data[i].type}">
            (${resposta.data[i].time}) ${resposta.data[i].from} ${resposta.data[i].text}
        </div>`;
        }
    if(resposta.data[i].type==="message"){
        document.querySelector(".corpo").innerHTML+= 
        `<div class="${resposta.data[i].type}">
            (${resposta.data[i].time}) ${resposta.data[i].from} ${resposta.data[i].text}
        </div>`;
        }
    if(resposta.data[i].type==="private-message"){
        document.querySelector(".corpo").innerHTML+= 
        `<div class="${resposta.data[i].type}">
            (${resposta.data[i].time}) ${resposta.data[i].from} ${resposta.data[i].text}
        </div>`;
        }
    }
}

