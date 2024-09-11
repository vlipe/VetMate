// Elementos do DOM
const abrirModalBtn = document.getElementById('abrirModal');
const modal = document.getElementById('modal');
const fecharModalBtn = document.querySelector('.fechar');
const formVacina = document.getElementById('formVacina');
const listaVacinas = document.getElementById('listaVacinas');
const mensagemInicial = document.getElementById('mensagemInicial');

// Abrir e fechar o modal
abrirModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    setTimeout(() => { // Adiciona um pequeno atraso antes de aplicar a classe
        document.body.classList.add('modal-aberto');
    }, 10); // Ajuste o tempo de atraso conforme necessário
});

fecharModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.classList.remove('modal-aberto');
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-aberto');   

    }
});

// Manipulação de formulário e armazenamento no LocalStorage
formVacina.addEventListener('submit', (event) => {
    event.preventDefault();

    const fotoRotuloInput = document.getElementById('fotoRotulo');
    const nomeVacinaInput = document.getElementById('nomeVacina');
    const farmaceuticaInput = document.getElementById('farmaceutica');
    const dataAplicacaoInput = document.getElementById('dataAplicacao');

    if (!fotoRotuloInput.files || fotoRotuloInput.files.length === 0) {
        alert("Por favor, selecione uma foto do rótulo da vacina.");
        return; 
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const fotoRotuloBase64 = e.target.result;

        let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
        let novaVacina = {
            id: Date.now(),
            fotoRotulo: fotoRotuloBase64,
            nomeVacina: nomeVacinaInput.value,
            farmaceutica: farmaceuticaInput.value,
            dataAplicacao: dataAplicacaoInput.value 
        };
        vacinas.push(novaVacina);
        localStorage.setItem('vacinas', JSON.stringify(vacinas));

        criarCardVacina(novaVacina);

        nomeVacinaInput.value = '';
        farmaceuticaInput.value = '';
        dataAplicacaoInput.value = ''; // Limpa o campo de data
        fotoRotuloInput.value = ''; 

        modal.style.display = 'none';

        if (vacinas.length > 0) {
            mensagemInicial.style.display = 'none';
        }
    };
    reader.readAsDataURL(fotoRotuloInput.files[0]);
});

// Criar card da vacina
function criarCardVacina(vacina) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = vacina.id;

    const img = document.createElement('img');
    img.src = vacina.fotoRotulo;
    card.appendChild(img);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const nome = document.createElement('h3');
    nome.textContent = vacina.nomeVacina;
    cardInfo.appendChild(nome);

    const farmaceutica = document.createElement('p');
    farmaceutica.textContent = vacina.farmaceutica;
    cardInfo.appendChild(farmaceutica);

    const dataAplicacao = document.createElement('p');
    dataAplicacao.textContent = `Data de Aplicação: ${vacina.dataAplicacao}`;
    dataAplicacao.style.marginTop = '1rem';
    cardInfo.appendChild(dataAplicacao);

    const apagarBtn = document.createElement('button');
    apagarBtn.textContent = 'Apagar';
    apagarBtn.addEventListener('click', () => {
        apagarVacina(vacina.id);
    });
    cardInfo.appendChild(apagarBtn);

    card.appendChild(cardInfo);
    listaVacinas.appendChild(card);
}

// Apagar vacina
function apagarVacina(id) {
    let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    vacinas = vacinas.filter(vacina => vacina.id !== id);
    localStorage.setItem('vacinas', JSON.stringify(vacinas));

    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) {
        card.remove();
    }

    if (vacinas.length === 0) {
        mensagemInicial.style.display = 'block';
    }
}

// Exibir vacinas ao carregar a página
function exibirVacinas() {
    let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    vacinas.forEach(criarCardVacina);

    if (vacinas.length > 0) {
        mensagemInicial.style.display = 'none';
    }
}

// Chamar a função para exibir as vacinas ao carregar a página
exibirVacinas();