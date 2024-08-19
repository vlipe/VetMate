const slides = document.querySelectorAll('.slide');
const slideContainer = document.querySelector('.slides');
const leftArrow = document.querySelector('.seta-esquerda');
const rightArrow = document.querySelector('.seta-direita');
let currentSlideIndex = 0;

function showSlide(index) {
    const slideWidth = slides[0].clientWidth;
    const offset = -slideWidth * index;
    slideContainer.style.transform = `translateX(${offset}px)`;
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
}

leftArrow.addEventListener('click', prevSlide);
rightArrow.addEventListener('click', nextSlide);
