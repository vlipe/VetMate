function menuShow() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "../imagens/menu.svg";
    } else {
        menuMobile.classList.add('open');
        document.querySelector('.icon').src = "../imagens/close.svg"
    }
}

const openButtons = document.querySelectorAll('.cadastro-link-link');
const closeButtons = document.querySelectorAll('.close-modal');

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

        modal.showModal();
    });
});


closeButtons.forEach(button => {
    button.addEventListener('click', () => {

        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

        modal.close();
    });
});


const modal1 = document.getElementById('modal-1');
const modal2 = document.getElementById('modal-2');
const btnFecharModal2 = document.querySelector('.btn-login-2');

function mostrarModal(modalId) {
    document.getElementById(modalId).showModal();
}

function ocultarModal(modalId) {
    document.getElementById(modalId).close();
}





btnFecharModal2.addEventListener('click', () => {
    ocultarModal('modal-2');
});

const telas = document.querySelectorAll('.tela, .tela-1');
let currentIndex = 0;

function showSlide(index) {
  telas.forEach((tela, i) => {
    tela.style.display = i === index ? 'block' : 'none';
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % telas.length;
  showSlide(currentIndex);
}

showSlide(0);
setInterval(nextSlide, 3000);

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// API configuration
const API_KEY = "AIzaSyAKwWUfLmNUZCHi-B7JQl1bgIs1GYWfsGw"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // return chat <li> element
}

const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ 
        role: "user", 
        parts: [{ text: userMessage }] 
      }] 
    }),
  }

  // Send POST request to API, get response and set the reponse as paragraph text
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    
    // Get the API response text and update the message element
    messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
  } catch (error) {
    // Handle error
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
}

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
}

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window 
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

const API_BASE = window.API_BASE || 'http://localhost:8081/api';

document.getElementById('btn-login')?.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginSenha').value.trim();
  if (!email || !password) return alert('Preencha email e senha');

  try {
    const resp = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // se precisar mandar token ou algo, acrescente no Authorization
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Erro ${resp.status}: ${txt || resp.statusText}`);
    }

    const data = await resp.json();
    localStorage.setItem('vm_token', data.token);
    localStorage.setItem('vm_user', JSON.stringify(data.user));
    window.location.href = 'area-restrita-login.html';
  } catch (err) {
    console.error(err);
    alert(`Falha no login: ${err.message}`);
  }
});
document.querySelector('.btn-cadastre-se')?.addEventListener('click', async (e) => {
  e.preventDefault(); // não deixa o form recarregar a página
  const name = document.getElementById('regNome').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regSenha').value.trim();
  if (!name || !email || !password) return alert('Preencha nome, email e senha');

  try {
    const resp = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Erro ${resp.status}: ${txt || resp.statusText}`);
    }

    // sucesso → fecha modal 1 e abre modal 2
    document.getElementById('modal-1').close();
    document.getElementById('modal-2').showModal();
  } catch (err) {
    console.error(err);
    alert(`Falha no cadastro: ${err.message}`);
  }
});


// === LOGIN ===
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginSenha').value.trim();
  if (!email || !password) return;

  try {
    const resp = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    if (!resp.ok) {
      const err = await resp.json().catch(()=>({error:{message:'Login falhou'}}));
      alert(err?.error?.message || 'Falha no login');
      return;
    }
    const data = await resp.json();
    localStorage.setItem('vm_token', data.token);
    localStorage.setItem('vm_user', JSON.stringify(data.user));
    window.location.href = 'area-restrita-login.html';
  } catch (err) {
    alert('Falha no login: ' + (err?.message || 'erro de rede'));
  }
});


// === CADASTRO (MODAL) ===
const dlg1 = document.getElementById('modal-1');
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name     = document.getElementById('regNome').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regSenha').value.trim();

  if (!name || !email || !password) {
    alert('Preencha nome, email e senha.');
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(()=>({error:{message:'Cadastro falhou'}}));
      alert(err?.error?.message || 'Falha no cadastro');
      return;
    }

    // sucesso → fecha modal-1 e abre modal-2
    dlg1.close?.();
    document.getElementById('modal-2').showModal?.();

  } catch (err) {
    alert('Falha no cadastro: ' + (err?.message || 'erro de rede'));
  }
});

// Abrir/fechar modal (garanta que o botão "Cadastre-se" de fora abre o diálogo)
document.querySelectorAll('.cadastro-link-link').forEach(btn => {
  btn.addEventListener('click', () => document.getElementById('modal-1').showModal());
});
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    const id = btn.getAttribute('data-modal');
    document.getElementById(id).close();
  });
});





