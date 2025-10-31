document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     SIDEBAR
  =============================== */
  const sidebar = document.getElementById('sidebar');
  const logoText = document.getElementById('logo-texto');

  function toggleSidebar() {
    sidebar.classList.toggle('expandido');
    logoText.textContent = sidebar.classList.contains('expandido') ? 'vetmate' : 'v';
  }

  if (sidebar) {
    sidebar.addEventListener('click', toggleSidebar);
  }


  /* ===============================
     MODAL STEPPER (TUTORIAL)
  =============================== */
  const overlay = document.getElementById("stepper-modal-overlay");
  const button = document.getElementById("modal-stepper-button");
  const slides = document.querySelectorAll(".modal-slide");
  const dots = document.querySelectorAll(".stepper-dot");
  let currentStep = 1;

  function showSlide(slideNumber) {
    currentStep = slideNumber;

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    document.getElementById(`slide-${slideNumber}`).classList.add("active");
    document.querySelector(`.stepper-dot[data-slide="${slideNumber}"]`).classList.add("active");

    if (currentStep === 1) {
      button.textContent = "Prosseguir";
    } else if (currentStep === 2) {
      button.textContent = "Vamos lá";
    }
  }

  if (button) {
    button.addEventListener("click", () => {
      if (currentStep === 1) {
        showSlide(2);
      } else if (currentStep === 2) {
        overlay.classList.add("modal-hidden");
        overlay.style.display = "none";
      }
    });
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const slideToGo = parseInt(dot.dataset.slide);
      showSlide(slideToGo);
    });
  });

  if (overlay) {
    showSlide(1);
    overlay.classList.remove("modal-hidden");
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.classList.add("modal-hidden");
      }
    });
  }


  /* ===============================
     EXPANSÃO DE MENSAGENS
  =============================== */
  const toggleMensagens = document.getElementById("toggle-mensagens");
  const iconeChevron = document.getElementById("icone-chevron");
  const conteudoMensagens = document.getElementById("conteudo-mensagens");

  if (toggleMensagens && iconeChevron && conteudoMensagens) {
    toggleMensagens.addEventListener("click", () => {
      conteudoMensagens.classList.toggle("escondido");
      if (conteudoMensagens.classList.contains("escondido")) {
        iconeChevron.classList.replace("fa-chevron-down", "fa-chevron-right");
      } else {
        iconeChevron.classList.replace("fa-chevron-right", "fa-chevron-down");
      }
    });
  }


  /* ===============================
     MODAL STATUS (CLIP BUTTON)
  =============================== */
  const btnClipe = document.getElementById("btn-clipe");
  const modalStatus = document.getElementById("modal-status");

  if (btnClipe && modalStatus) {
    btnClipe.addEventListener("click", (event) => {
      event.stopPropagation();
      modalStatus.classList.toggle("escondido");
    });

    document.addEventListener("click", (event) => {
      if (!modalStatus.classList.contains("escondido")) {
        if (!modalStatus.contains(event.target) && !btnClipe.contains(event.target)) {
          modalStatus.classList.add("escondido");
        }
      }
    });
  }


  /* ===============================
     NOTIFICAÇÕES (FUNCIONAL)
  =============================== */
  const popup = document.getElementById('notificacaoPopup');
  const botaoNotificacao = document.querySelector('.noti-icon');

  if (popup && botaoNotificacao) {

    function toggleNotificacoes() {
      if (popup.classList.contains('active')) {
        popup.classList.remove('active');
        popup.classList.add('hide');
        botaoNotificacao.classList.remove('noti-icon-active');
        setTimeout(() => popup.classList.remove('hide'), 300);
      } else {
        popup.classList.add('active');
        botaoNotificacao.classList.add('noti-icon-active');
      }

      // animação
      botaoNotificacao.classList.add('swing');
      setTimeout(() => botaoNotificacao.classList.remove('swing'), 600);
    }

    // abre/fecha ao clicar no ícone
    botaoNotificacao.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleNotificacoes();
    });

    // fecha ao clicar fora
    document.addEventListener('click', (event) => {
      if (!popup.contains(event.target) && !botaoNotificacao.contains(event.target)) {
        if (popup.classList.contains('active')) {
          popup.classList.remove('active');
          popup.classList.add('hide');
          setTimeout(() => popup.classList.remove('hide'), 300);
          botaoNotificacao.classList.remove('noti-icon-active');
        }
      }
    });
  }


  /* ===============================
     CHATBOT
  =============================== */
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

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  if (btnChatbot) {
    btnChatbot.style.position = 'fixed';
    btnChatbot.style.bottom = isMobile() ? '20px' : '3rem';
    btnChatbot.style.right = isMobile() ? '20px' : '3rem';
  }

  containerChatbot?.classList.remove('show');
  containerChatbotChat?.classList.remove('show');

  btnChatbot?.addEventListener('click', () => {
    if (!containerChatbot.classList.contains('show')) {
      containerChatbot.classList.add('show');
      btnChatbot.style.opacity = '0';
      btnChatbot.style.pointerEvents = 'none';
    }
  });

  btnContinuar?.addEventListener('click', () => {
    containerChatbot.classList.remove('show');
    containerChatbotChat.classList.add('show');
  });

  [...svgFecharIcons, ...svgFecharIcons2].forEach(icon => {
    icon.addEventListener('click', () => {
      containerChatbot.classList.remove('show');
      containerChatbotChat.classList.remove('show');
      setTimeout(() => {
        btnChatbot.style.opacity = '1';
        btnChatbot.style.pointerEvents = 'auto';
      }, 300);
    });
  });

  setaVoltar?.addEventListener('click', () => {
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
      return "A Vetmate é um sistema único e inovador, cujo objetivo é revolucionar o dia a dia de pessoas como você! Auxiliando em tarefas como: organização de informações dos pets, encontrar clínicas veterinárias e muito mais!";
    } else if (userMessage === "Onde posso encontrar uma clínica veterinária?") {
      return "Você pode encontrar uma clínica veterinária na seção 'Encontre um Veterinário' do nosso site.";
    }

    try {
      const apiKey = 'AIzaSyDPxTwQmVkJWQO2gUZ4wrDZvqDbqiFGZLo';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      });

      if (!response.ok) throw new Error(`Erro na requisição à API: ${response.status}`);

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      console.error(error);
      throw new Error(`Erro: ${error.message}`);
    }
  }

  btnEnviar?.addEventListener('click', async () => {
    const userMessage = inputMensagem.value.trim();
    if (userMessage) {
      iniciarChat();
      addMessage(userMessage, true);
      inputMensagem.value = '';
      const loadingMessage = addMessage("Aguarde...");
      try {
        const botResponse = await sendMessageToAPI(userMessage);
        loadingMessage.remove();
        addMessage(botResponse);
      } catch (error) {
        loadingMessage.remove();
        addMessage(`Erro: ${error.message}`);
      }
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
    contentChatbot?.remove();
  }

});
