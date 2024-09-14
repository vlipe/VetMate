const carousel = document.querySelector('.carousel');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const items = document.querySelectorAll('.carousel .list .item');

let activeIndex = 0; 

function showItem(index) {
    items.forEach(item => item.style.opacity = '0');

    items[index].style.opacity = '1';

    if (index > activeIndex) {
        carousel.classList.add('next');
        carousel.classList.remove('prev');
    } else {
        carousel.classList.add('prev');
        carousel.classList.remove('next');
    }

    activeIndex = index;
}

showItem(activeIndex);

prevButton.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    showItem(activeIndex);
});

nextButton.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % items.length;
    showItem(activeIndex);
});