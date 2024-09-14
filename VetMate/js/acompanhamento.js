// Elementos do DOM
const abrirModalBtn = document.getElementById('abrirModal');
const modal = document.getElementById('modal');
const fecharModalBtn = document.querySelector('.fechar');
const formPet = document.getElementById('formPet');
const listaPets = document.getElementById('listaPets');
const mensagemInicial = document.getElementById('mensagemInicial');

// Abrir e fechar o modal
abrirModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

fecharModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Manipulação de formulário e armazenamento no LocalStorage
formPet.addEventListener('submit', (event) => {
    event.preventDefault();

    const fotoPetInput = document.getElementById('fotoPet');
    const nomePetInput = document.getElementById('nomePet');
    const especieInput = document.getElementById('especie');
    const racaInput = document.getElementById('raca');
    const idadeInput = document.getElementById('idade');

    if (!fotoPetInput.files || fotoPetInput.files.length === 0) {
        alert("Por favor, selecione uma foto do pet.");
        return; 
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const fotoPetBase64 = e.target.result;

        let pets = JSON.parse(localStorage.getItem('pets')) || [];
        let novoPet = {
            id: Date.now(),
            fotoPet: fotoPetBase64,
            nomePet: nomePetInput.value,
            especie: especieInput.value,
            raca: racaInput.value,
            idade: idadeInput.value 
        };
        pets.push(novoPet);
        localStorage.setItem('pets', JSON.stringify(pets));

        criarCardPet(novoPet);

        nomePetInput.value = '';
        especieInput.value = '';
        racaInput.value = '';
        idadeInput.value = ''; 
        fotoPetInput.value = ''; 

        modal.style.display = 'none';

        if (pets.length > 0) {
            mensagemInicial.style.display = 'none';
        }
    };
    reader.readAsDataURL(fotoPetInput.files[0]);
});

// Criar card do pet
function criarCardPet(pet) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = pet.id;

    const img = document.createElement('img');
    img.src = pet.fotoPet;
    card.appendChild(img);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const h3 = document.createElement('h3');
    h3.textContent = pet.nomePet;
    cardInfo.appendChild(h3);

    const especieParagrafo = document.createElement('p');
    especieParagrafo.textContent = `Espécie: ${pet.especie}`;
    cardInfo.appendChild(especieParagrafo);

    const racaParagrafo = document.createElement('p');
    racaParagrafo.textContent = `Raça: ${pet.raca}`;
    cardInfo.appendChild(racaParagrafo);

    const idadeParagrafo = document.createElement('p');
    idadeParagrafo.textContent = `Idade: ${pet.idade}`;
    cardInfo.appendChild(idadeParagrafo);

    const botoesContainer = document.createElement('div');
    botoesContainer.classList.add('botoes-container');

    const consultasBtn = document.createElement('a'); 
    consultasBtn.href = 'consultas.html'; 
    const consultasBtnInner = document.createElement('button');
    consultasBtnInner.textContent = 'Consultas';
    consultasBtn.appendChild(consultasBtnInner);
    botoesContainer.appendChild(consultasBtn);

    const examesBtn = document.createElement('a'); 
    examesBtn.href = 'exames.html'; 
    const examesBtnInner = document.createElement('button'); 
    examesBtnInner.textContent = 'Exames';
    examesBtn.appendChild(examesBtnInner);
    botoesContainer.appendChild(examesBtn);

    const vacinasBtn = document.createElement('a'); 
    vacinasBtn.href = 'vacinas.html'; 
    const vacinasBtnInner = document.createElement('button'); 
    vacinasBtnInner.textContent = 'Vacinas';
    vacinasBtn.appendChild(vacinasBtnInner);
    botoesContainer.appendChild(vacinasBtn);

    const medicamentosBtn = document.createElement('a'); 
    medicamentosBtn.href = 'medicamentos.html'; 
    const medicamentosBtnInner = document.createElement('button');
    medicamentosBtnInner.textContent = 'Medicamentos';
    medicamentosBtn.appendChild(medicamentosBtnInner);
    botoesContainer.appendChild(medicamentosBtn);

    const apagarBtn = document.createElement('button');
    apagarBtn.textContent = 'Apagar';
    apagarBtn.id = 'apagarBtn'; 
    apagarBtn.addEventListener('click', () => {
        apagarPet(pet.id);
    });
    botoesContainer.appendChild(apagarBtn);

    cardInfo.appendChild(botoesContainer); 
    card.appendChild(cardInfo); 
    listaPets.appendChild(card);
}

// Apagar pet
function apagarPet(id) {
    let pets = JSON.parse(localStorage.getItem('pets')) || [];
    pets = pets.filter(pet => pet.id !== id);
    localStorage.setItem('pets', JSON.stringify(pets));

    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) {
        card.remove();
    }

    if (pets.length === 0) {
        mensagemInicial.style.display = 'block';
    }
}

// Exibir pets ao carregar a página
function exibirPets() {
    let pets = JSON.parse(localStorage.getItem('pets')) || [];
    pets.forEach(criarCardPet);

    if (pets.length > 0) {
        mensagemInicial.style.display = 'none';
    }
}

// Chamar a função para exibir os pets ao carregar a página
exibirPets();