const slides = document.querySelectorAll('.slide');
let currentSlideIndex = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
}

document.querySelector('.seta-esquerda').addEventListener('click', prevSlide);
document.querySelector('.seta-direita').addEventListener('click', nextSlide);

// Iniciar com o primeiro slide ativo
showSlide(currentSlideIndex);
