document.addEventListener('DOMContentLoaded', (event) => {
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            closeModal(modalId);
        });
    });
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
    } else {
        console.error('Modal não encontrado com o ID:', modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
    } else {
        console.error('Modal não encontrado com o ID:', modalId);
    }
}

function toggle(){
    var blur = document.getElementById('blur');
    blur.classList.toggle('active')
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
        toggle(); 
    } else {
        console.error('Modal não encontrado com o ID:', modalId);
    }
}

