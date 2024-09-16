let currentIndex = 0;
const totalComments = document.querySelectorAll('.comment').length;
let autoSlideInterval = setInterval(nextComment, 2000); // Muda de comentário a cada 3 segundos

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
    autoSlideInterval = setInterval(nextComment, 2000); // Reinicia o intervalo
});

document.getElementById('nextButton').addEventListener('click', function() {
    clearInterval(autoSlideInterval); // Pausa o carrossel automático
    nextComment();
    autoSlideInterval = setInterval(nextComment, 2000); // Reinicia o intervalo
});
  
document.querySelector('.carousel-wrapper').addEventListener('mouseenter', function() {
    
   
    clearInterval(autoSlideInterval); // Pausa o carrossel automático
    });
    
    // Retomar a transição automática quando o mouse sair do carrossel
    document.querySelector('.carousel-wrapper').addEventListener('mouseleave', function() {
        autoSlideInterval = 
        autoSlideInterval =
    
       
    setInterval(nextComment, 2000); // Reinicia o carrossel automático
    });
    
    // Função para lidar com arrastar e soltar
let isDragging = false;
let startX;

document.querySelector('.carousel-wrapper').addEventListener('dragstart', function(e) {
    clearInterval(autoSlideInterval); // Pausa o carrossel automático
    isDragging = true;
    startX = e.clientX;
});

document.querySelector('.carousel-wrapper').addEventListener('dragover', function(e) {
    e.preventDefault(); // Previne o comportamento padrão do drag
});

document.querySelector('.carousel-wrapper').addEventListener('dragend', function(e) {
    if (!isDragging) return;
    const endX = e.clientX;
    const threshold = 50; // Defina um limite de movimento para mudar o slide
    if (startX - endX > threshold) {
        nextComment();
    } else if (endX - startX > threshold) {
        prevComment();
    }
});
