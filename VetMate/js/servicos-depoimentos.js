let currentIndex = 0;
const totalComments = document.querySelectorAll('.comment').length;
let autoSlideInterval = setInterval(nextComment, 3000); // Muda de comentário a cada 3 segundos

function showComment(index) {
    const comments = document.querySelector('.carousel');

    // Se o índice exceder o total de comentários, redefine para o início
    if (index >= totalComments) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalComments - 1;
    } else {
        currentIndex = index;
    }

    // Move o carrossel para mostrar o comentário atual
    comments.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextComment() {
    showComment(currentIndex + 1);
}

function prevComment() {
    showComment(currentIndex - 1);
}

// Eventos para navegação manual e pausa do carrossel automático
document.getElementById('prevButton').addEventListener('click', function() {
    clearInterval(autoSlideInterval); // Pausa o carrossel automático
    prevComment();
    autoSlideInterval = setInterval(nextComment, 3000); // Reinicia o intervalo
});

document.getElementById('nextButton').addEventListener('click', function() {
    clearInterval(autoSlideInterval); // Pausa o carrossel automático
    nextComment();
    autoSlideInterval = setInterval(nextComment, 3000); // Reinicia o intervalo
});
