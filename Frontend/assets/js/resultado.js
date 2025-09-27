function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const logoText = document.getElementById('logo-texto');
  
  sidebar.classList.toggle('expandido');

  if (sidebar.classList.contains('expandido')) {
      logoText.textContent = 'vetmate';
  } else {
      logoText.textContent = 'v';
  }
}

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

  if (!popup.contains(event.target) && !icon.contains(event.target)) {
      popup.classList.remove('active');
      popup.classList.add('hide');

      setTimeout(() => {
          popup.classList.remove('hide');
      }, 300);
  }
});

const cardImg = document.querySelector(".card-container")

window.onload = () => {
    setTimeout(() => {
        document.querySelector(".card-container").classList.remove("loading");
    }, 2000);
}

// Selecting DOM elements
const startBtn = document.querySelector("#startBtn"),
  endBtn = document.querySelector("#endBtn"),
  prevNext = document.querySelectorAll(".prevNext"),
  numbers = document.querySelectorAll(".link");

// Setting an initial step
let currentStep = 0;

// Function to update the button states
const updateBtn = () => {
  // If we are at the last step
  if (currentStep === 4) {
    endBtn.disabled = true;
    prevNext[1].disabled = true;
  } else if (currentStep === 0) {
    // If we are at the first step
    startBtn.disabled = true;
    prevNext[0].disabled = true;
  } else {
    endBtn.disabled = false;
    prevNext[1].disabled = false;
    startBtn.disabled = false;
    prevNext[0].disabled = false;
  }
};

// Add event listeners to the number links
numbers.forEach((number, numIndex) => {
  number.addEventListener("click", (e) => {
    e.preventDefault();
    // Set the current step to the clicked number link
    currentStep = numIndex;
    // Remove the "active" class from the previously active number link
    document.querySelector(".active").classList.remove("active");
    // Add the "active" class to the clicked number link
    number.classList.add("active");
    updateBtn(); // Update the button states
  });
});

// Add event listeners to the "Previous" and "Next" buttons
prevNext.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Increment or decrement the current step based on the button clicked
    currentStep += e.target.id === "next" ? 1 : -1;
    numbers.forEach((number, numIndex) => {
      // Toggle the "active" class on the number links based on the current step
      number.classList.toggle("active", numIndex === currentStep);
      updateBtn(); // Update the button states
    });
  });
});

// Add event listener to the "Start" button
startBtn.addEventListener("click", () => {
  // Remove the "active" class from the previously active number link
  document.querySelector(".active").classList.remove("active");
  // Add the "active" class to the first number link
  numbers[0].classList.add("active");
  currentStep = 0;
  updateBtn(); // Update the button states
  endBtn.disabled = false;
  prevNext[1].disabled = false;
});

// Add event listener to the "End" button
endBtn.addEventListener("click", () => {
  // Remove the "active" class from the previously active number link
  document.querySelector(".active").classList.remove("active");
  // Add the "active" class to the last number link
  numbers[4].classList.add("active");
  currentStep = 4;
  updateBtn(); // Update the button states
  startBtn.disabled = false;
  prevNext[0].disabled = false;
});
