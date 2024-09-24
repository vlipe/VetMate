// Funções para manipular os modais
function abrirModal() {
    document.getElementById('feedback-modal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('feedback-modal').style.display = 'none';
}

function abrirModalAgradecimento() {
    document.getElementById('feedback-agradecimento').style.display = 'block';
}

function fecharModalAgradecimento() {
    document.getElementById('feedback-agradecimento').style.display = 'none';
}

// Função para criar as estrelas de avaliação
function criarEstrelas() {
    const estrelasContainer = document.getElementById('feedback-estrelas');
    for (let i = 1; i <= 5; i++) {
        const estrela = document.createElement('i');
        estrela.classList.add('far', 'fa-star'); // Ícone de estrela vazia inicialmente
        estrela.addEventListener('click', () => {
            selecionarEstrelas(i);
        });
        estrelasContainer.appendChild(estrela);
    }
}

// Função para selecionar as estrelas
function selecionarEstrelas(nota) {
    const estrelas = document.querySelectorAll('#feedback-estrelas i');
    estrelas.forEach((estrela, index) => {
        estrela.classList.remove('fas', 'far'); // Remove as classes existentes
        if (index < nota) {
            estrela.classList.add('fas', 'fa-star'); // Ícone de estrela preenchida
        } else {
            estrela.classList.add('far', 'fa-star'); // Ícone de estrela vazia
        }
    });
}

// Adiciona um ouvinte de evento ao formulário de feedback
document.getElementById('feedback-form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Lógica para coletar os dados do formulário (foto, nome, estrelas, depoimento)
    // ...

    // Lógica para armazenar os dados do feedback (pode ser no LocalStorage ou em um banco de dados externo)
    // ...

    fecharModal(); // Fecha o modal de avaliação
    abrirModalAgradecimento(); // Abre o modal de agradecimento
});

// Adiciona um ouvinte de evento ao botão "Avaliar" para abrir o modal
document.getElementById('feedback-botao-avaliar').addEventListener('click', abrirModal);

// Cria as estrelas de avaliação ao carregar a página
criarEstrelas();