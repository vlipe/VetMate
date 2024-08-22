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


