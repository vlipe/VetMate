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
const btnCadastrar = document.getElementById('cadastro-link-link');
const btnFecharModal2 = document.querySelector('.btn-login-2');

function mostrarModal(modalId) {
    document.getElementById(modalId).showModal();
}

function ocultarModal(modalId) {
    document.getElementById(modalId).close();
}


btnCadastrar.addEventListener('click', () => {
    ocultarModal('modal-1'); 
    mostrarModal('modal-2'); 
});


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


