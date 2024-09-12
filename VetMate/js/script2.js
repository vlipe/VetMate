document.addEventListener('DOMContentLoaded', (event) => {
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            closeModal(modalId);
        });
    });

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

        mostrarModal('modal-envio');
    });

    const btnVoltar = document.getElementById('btn-voltar-modal');
    btnVoltar.addEventListener('click', () => {
        ocultarModal('modal-envio');
    });
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
        document.getElementById('blur').classList.add('active'); 
    } else {
        console.error('Modal não encontrado com o ID:', modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
        document.getElementById('blur').classList.remove('active'); 
    } else {
        console.error('Modal não encontrado com o ID:', modalId);
    }
}

function mostrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
        document.getElementById('blur').classList.add('active'); 
        document.body.classList.add('no-scroll');
    } else {
        console.error('Modal não encontrado com o ID:', modalId);
    }
}

function ocultarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
        document.getElementById('blur').classList.remove('active'); 
        document.body.classList.remove('no-scroll');
    } else {
        console.error('Modal não encontrado com o ID:', modalId);
    }
}