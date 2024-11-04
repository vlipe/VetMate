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

  document.getElementById('btn-cadastrar').addEventListener('click', function(event) {
    event.preventDefault();

    const mainContent = document.getElementById('main-content');
    const novaSecao = document.getElementById('nova-secao');

    mainContent.classList.add('hidden');

    setTimeout(() => {
        mainContent.style.display = 'none';
        novaSecao.style.display = 'block';
        novaSecao.classList.add('active');
    }, 700);
});

document.getElementById('botao2').addEventListener('click', function(event) {
    event.preventDefault();

    const novaSecao = document.getElementById('nova-secao');
    const novaSecao2 = document.getElementById('nova-secao2');

    novaSecao.classList.add('hidden');

    setTimeout(() => {
        novaSecao.style.display = 'none';
        novaSecao2.style.display = 'block';
        novaSecao2.classList.add('active');
        novaSecao2.classList.remove('hidden');
    }, 400);
});



  