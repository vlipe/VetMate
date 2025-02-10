const sidebar = document.getElementById('sidebar');
sidebar.addEventListener('click', toggleSidebar);


function toggleNotificacoes() {
  const popup = document.getElementById('notificacaoPopup');
  const botaoNotificacao = document.querySelector('.noti-icon');
  
  if (popup.classList.contains('active')) {
      popup.classList.remove('active');
      popup.classList.add('hide');
      botaoNotificacao.classList.remove('noti-icon-active');
      
      setTimeout(() => {
          popup.classList.remove('hide');
      }, 300);
  } else {
      popup.classList.add('active');
      botaoNotificacao.classList.add('noti-icon-active');
  }

  botaoNotificacao.classList.add('swing');
  
  setTimeout(() => {
      botaoNotificacao.classList.remove('swing');
  }, 600);
}

const botaoNotificacao = document.querySelector('.noti-icon');
botaoNotificacao.addEventListener('click', toggleNotificacoes);

document.addEventListener('click', (event) => {
  const popup = document.getElementById('notificacaoPopup');
  const icon = document.querySelector('.noti-icon');

  // Verifica se o clique foi fora do popup e do ícone
  if (!popup.contains(event.target) && !icon.contains(event.target)) {
      popup.classList.remove('active');
      popup.classList.add('hide');

      setTimeout(() => {
          popup.classList.remove('hide');
      }, 300);
  }
});

  



const daysContainer = document.querySelector(".dias"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  mes = document.querySelector(".mes"),
  hojeBtn = document.querySelector(".hoje-btn");

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const data = new Date();

let mesAtual = data.getMonth();
let anoAtual = data.getFullYear();

function renderizarCalendario() {
  data.setDate(1);
  const primeiroDia = new Date(anoAtual, mesAtual, 1);
  const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
  const indiceUltimoDia = ultimoDia.getDay();
  const dataUltimoDia = ultimoDia.getDate();
  const ultimoDiaAnterior = new Date(anoAtual, mesAtual, 0);
  const dataUltimoDiaAnterior = ultimoDiaAnterior.getDate();
  const diasProximos = 7 - indiceUltimoDia - 1;

  mes.innerHTML = `${meses[mesAtual]} ${anoAtual}`;

  let dias = "";

  for (let x = primeiroDia.getDay(); x > 0; x--) {
    dias += `<div class="dia anterior">${dataUltimoDiaAnterior - x + 1}</div>`;
  }

  for (let i = 1; i <= dataUltimoDia; i++) {
    if (
      i === new Date().getDate() &&
      mesAtual === new Date().getMonth() &&
      anoAtual === new Date().getFullYear()
    ) {
      dias += `<div class="dia hoje">${i}</div>`;
    } else {
      dias += `<div class="dia">${i}</div>`;
    }
  }

  for (let j = 1; j <= diasProximos; j++) {
    dias += `<div class="dia proximo">${j}</div>`;
  }

  esconderHojeBtn();
  esconderPrevBtn();
  daysContainer.innerHTML = dias;
}

renderizarCalendario();

nextBtn.addEventListener("click", () => {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  renderizarCalendario();
});

prevBtn.addEventListener("click", () => {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  renderizarCalendario();
});

hojeBtn.addEventListener("click", () => {
  mesAtual = data.getMonth();
  anoAtual = data.getFullYear();
  renderizarCalendario();
});

function esconderHojeBtn() {
  if (
    mesAtual === new Date().getMonth() &&
    anoAtual === new Date().getFullYear()
  ) {
    hojeBtn.style.display = "none";
  } else {
    hojeBtn.style.display = "flex";
  }
}

function esconderPrevBtn() {
  if (mesAtual === new Date().getMonth() && anoAtual === new Date().getFullYear()) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex"; 
  }
}

const btnChatbot = document.querySelector('.btn-chatbot');
const containerChatbot = document.querySelector('.container-chatbot');
const containerChatbotChat = document.querySelector('.container-chatbot-chat');
const btnContinuar = document.querySelector('.btn-continuar');
const svgFecharIcons = document.querySelectorAll('.svg-fechar');
const svgFecharIcons2 = document.querySelectorAll('.svg-fechar-chat');
const contentChatbot = document.querySelector('.content-chatbot');
const inputMensagem = document.querySelector('.input-texto');
const btnEnviar = document.querySelector('.btn-enviar');
const setaVoltar = document.querySelector('.svg-voltar');

let contentChatbotRemovido = false;

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
  btnChatbot.style.position = 'fixed';
  btnChatbot.style.bottom = '20px';
  btnChatbot.style.right = '20px';
} else {
  btnChatbot.style.position = 'fixed';
  btnChatbot.style.bottom = '3rem';
  btnChatbot.style.right = '3rem';
}

containerChatbot.classList.remove('show');
containerChatbotChat.classList.remove('show');

btnChatbot.addEventListener('click', () => {
  if (!containerChatbot.classList.contains('show')) {
    containerChatbot.classList.add('show');
    btnChatbot.style.opacity = '0';
    btnChatbot.style.pointerEvents = 'none';
  }
});

btnContinuar.addEventListener('click', () => {
  containerChatbot.classList.remove('show');
  containerChatbotChat.classList.add('show');
});

svgFecharIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    if (containerChatbot.classList.contains('show')) {
      containerChatbot.classList.remove('show');
    } else if (containerChatbotChat.classList.contains('show')) {
      containerChatbotChat.classList.remove('show');
    }
    setTimeout(() => {
      btnChatbot.style.opacity = '1';
      btnChatbot.style.pointerEvents = 'auto';
    }, 300);
  });
});

svgFecharIcons2.forEach(icon => {
  icon.addEventListener('click', () => {
    if (containerChatbot.classList.contains('show')) {
      containerChatbot.classList.remove('show');
    } else if (containerChatbotChat.classList.contains('show')) {
      containerChatbotChat.classList.remove('show');
    }
    setTimeout(() => {
      btnChatbot.style.opacity = '1';
      btnChatbot.style.pointerEvents = 'auto';
    }, 300);
  });
});

setaVoltar.addEventListener('click', () => {
  containerChatbotChat.classList.remove('show');
  containerChatbot.classList.add('show');
});

function addMessage(text, isUser = false) {
  const messagesContainer = document.querySelector('.messages-container');
  if (messagesContainer) {
    const message = document.createElement('div');
    message.classList.add(isUser ? 'user-message' : 'bot-message');
    message.innerText = text;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return message;
  }
}

async function sendMessageToAPI(userMessage) {
  if (userMessage === "O que é a Vetmate?") {
    return Promise.resolve("A Vetmate é um sistema único e inovador, cujo objetivo é revolucionar o dia a dia de pessoas como você! Auxiliando em tarefas como: organização de informações dos pets, encontrar clínicas veterinárias e muito mais!");
  } else if (userMessage === "Onde posso encontrar uma clínica veterinária?") {
    return Promise.resolve("Você pode encontrar uma clínica veterinária na seção 'Encontre um Veterinário' do nosso site.");
  }

  try {
    const apiKey = 'AIzaSyCiq8igjazwf5UXx0nAWjdGDxxjqxnqKSw'; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: userMessage
          }]
        }]
      })
    });

    if (!response.ok) {
      const statusCode = response.status;
      throw new Error(`Erro na requisição à API. Status code: ${statusCode}`);
    }

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;

    return Promise.resolve(botResponse);

  } catch (error) {
    console.error(error);
    return Promise.reject(`Erro: ${error.message}`);
  }
}

btnEnviar.addEventListener('click', async () => {
  const userMessage = inputMensagem.value.trim();
  if (userMessage) {
    iniciarChat(); 

    addMessage(userMessage, true); 
    inputMensagem.value = '';

    const loadingMessage = addMessage("Aguarde...");

    sendMessageToAPI(userMessage)
      .then(botResponse => {
        loadingMessage.remove();
        addMessage(botResponse);
      })
      .catch(error => {
        loadingMessage.remove();
        addMessage(`Erro: ${error.message}`);
      });
  }
});

const sugestoesNavegacao = document.querySelectorAll('.section-chatbot:nth-child(1) .sugestion-chatbot');
const sugestoesDuvidas = document.querySelectorAll('.section-chatbot:nth-child(2) .sugestion-chatbot');

sugestoesNavegacao.forEach(sugestao => {
  sugestao.addEventListener('click', () => {
    const pergunta = sugestao.querySelector('.txt-sugestion-chatbot').textContent;

    iniciarChat();
    addMessage(pergunta, true);

    if (pergunta === 'Aonde cadastro meus animais de estimação?') {
      exibirResposta('Você pode cadastrar seus animais de estimação na seção "Meu Perfil" do nosso site.');
    } else if (pergunta === 'Quero encontrar uma clínica veterinária!') {
      exibirResposta('Para encontrar uma clínica veterinária, acesse a seção "Encontre um Veterinário" no nosso site.');
    }
  });
});

sugestoesDuvidas.forEach(sugestao => {
  sugestao.addEventListener('click', () => {
    const pergunta = sugestao.querySelector('.txt-sugestion-chatbot').textContent;

    iniciarChat();
    addMessage(pergunta, true);

    enviarPergunta(pergunta);
  });
});

function enviarPergunta(pergunta) {
  const loadingMessage = addMessage("Aguarde...");

  sendMessageToAPI(pergunta)
    .then(botResponse => {
      loadingMessage.remove();
      addMessage(botResponse);
    })
    .catch(error => {
      loadingMessage.remove();
      addMessage(`Erro: ${error.message}`);
    });
}

function exibirResposta(resposta) {
  const mensagemAguarde = document.querySelector('.messages-container .message:last-child');
  if (mensagemAguarde && mensagemAguarde.innerText === "Aguarde...") {
    mensagemAguarde.remove();
  }
  addMessage(resposta);
}

function iniciarChat() {
  const messagesContainer = document.querySelector('.messages-container');
  if (!messagesContainer) {
    const newMessagesContainer = document.createElement('div');
    newMessagesContainer.classList.add('messages-container');
    containerChatbotChat.insertBefore(newMessagesContainer, document.querySelector('.container-mensagem'));
  }
  contentChatbot.remove();
}




function toggleSidebar() {
  const openSidebarBtn = document.getElementById("sidebarToggle");
  
    const sidebar = document.getElementById('sidebar');
    
  // Alterna a classe para abrir/fechar o sidebar
  sidebar.classList.toggle("open-sidebar");
  
  // Esconde ou mostra o botão
  openSidebarBtn.classList.toggle("hidden");
  
  // Adiciona um listener para fechar ao clicar fora
  if (sidebar.classList.contains("open-sidebar")) {
    document.addEventListener("click", closeSidebarOnClickOutside);
  } else {
    document.removeEventListener("click", closeSidebarOnClickOutside);
  }
}

// Função que fecha o sidebar ao clicar fora dele
function closeSidebarOnClickOutside(event) {
  const sidebar = document.getElementById("sidebar");
  const openSidebarBtn = document.getElementById("sidebarToggle");
  
  // Verifica se o clique foi fora do sidebar
  if (!sidebar.contains(event.target) && !openSidebarBtn.contains(event.target)) {
    sidebar.classList.remove("open-sidebar");
    openSidebarBtn.classList.remove("hidden");
    document.removeEventListener("click", closeSidebarOnClickOutside);
  }

   const logoText = document.getElementById('logo-texto');
    
    sidebar.classList.toggle('expandido');

    if (sidebar.classList.contains('expandido')) {
        logoText.textContent = 'vetmate';
    } else {
        logoText.textContent = 'v';
    }
  
}



