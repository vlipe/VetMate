// Função para salvar os dados dos pets no `localStorage`
function salvarDados() {
  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value;
  const peso = document.getElementById('peso').value;
  const genero = document.getElementById('genero').value;
  const especie = document.getElementById('especie').value;
  const porte = document.getElementById('porte').value;
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];

  if (!nome || !idade || !peso || !genero || !especie || !porte || !file) {
    alert('Por favor, preencha todos os campos obrigatórios e adicione uma imagem.');
    return;
  }

  const novoPet = { nome, idade, peso, genero, especie, porte };

  // Lê o arquivo de imagem e o armazena como uma URL base64
  const reader = new FileReader();
  reader.onload = function (e) {
    novoPet.imagem = e.target.result;

    const petsCadastrados = JSON.parse(localStorage.getItem('pets')) || [];
    petsCadastrados.push(novoPet);
    localStorage.setItem('pets', JSON.stringify(petsCadastrados));

    alert('Dados do pet cadastrados com sucesso!');
    window.location.href = '../html/registro-dos-pets.html';
  };
  reader.readAsDataURL(file);
}

// Função para exibir todos os pets cadastrados, incluindo a imagem
function exibirDados(pets = JSON.parse(localStorage.getItem('pets')) || []) {
  const container = document.querySelector('.all-aling');
  container.innerHTML = '';
  container.style.display = 'flex'; // Define o layout flexível
  container.style.flexWrap = 'wrap'; // Permite a quebra automática de linha
  container.style.gap = '100%'; // Espaçamento entre os itens // Limpa o container antes de renderizar os dados

  pets.forEach((pet, index) => {
    let generoIcone;
    if (pet.genero === 'macho') {
      generoIcone = '<img src="../imagens/icons8-masculino-32.png" alt="Macho" style="width: 20px; height: 20px;">';
    } else {
      generoIcone = '<img src="../imagens/icons8-feminino-24.png" alt="Fêmea" style="width: 20px; height: 20px;">';
    }

    
    

    const petDiv = document.createElement('div');
    petDiv.style.width = '45%';
    petDiv.style.border = '1px solid #ffff';
    petDiv.style.backgroundColor = '#fff';
    petDiv.style.borderRadius = '8px';
    petDiv.style.boxSizing = 'border-box';

    petDiv.innerHTML = `
      <div class="all-aling" style="display:flex; flex-direction:row; width: 100%; height:100%;">
        <div class="image-container" style="text-align: center;">
          <img src="${pet.imagem}" alt="Imagem do pet" style="width: 100%; height: 100%; border-radius: 8px;"/>
        </div>
        <div class="pet-info" style="display:flex; flex-direction:column;">
          <div class="N-I" style="display:flex; flex-direction:row; justify-content:space-between; padding-right:-70%;">
            <p style="font-size:1.2rem; color: black; font-weight: 500;"> ${pet.nome}</p>
            <p style="">${generoIcone}</p>
          </div>
          <p>${pet.especie}</p>
          <p>${pet.porte}</p>
          <p>${pet.peso} Kg</p>
          <p>${pet.idade} Anos</p>
          <div class="B-1" style="display:flex; flex-direction:row; justify-content:space-between;">
            <div class="B-2" style="padding-right:20%;">
              <button id="mais-info" style="width:120%; height:100%; font-size:0.6rem;">Mais informações</button>
            </div>
            <div class="B-3">
              <button onclick="excluirPet(${index})">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(petDiv);
  });
}

// Função para excluir um pet pelo índice
function excluirPet(index) {
  let petsCadastrados = JSON.parse(localStorage.getItem('pets')) || [];
  petsCadastrados.splice(index, 1); // Remove o pet do array

  localStorage.setItem('pets', JSON.stringify(petsCadastrados)); // Atualiza o localStorage
  exibirDados(); // Atualiza a exibição após a exclusão
}

// Função para filtrar os pets pelo nome com a barra de pesquisa
function filtrarItens() {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  const petsCadastrados = JSON.parse(localStorage.getItem('pets')) || [];

  const filteredPets = petsCadastrados.filter(pet => 
    pet.nome.toLowerCase().includes(searchTerm) || 
    pet.especie.toLowerCase().includes(searchTerm) || 
    pet.porte.toLowerCase().includes(searchTerm)
  );

  exibirDados(filteredPets);
}

// Função para filtrar por categoria ao clicar nos ícones de espécies
function buscarPorItem(especie) {
  const petsCadastrados = JSON.parse(localStorage.getItem('pets')) || [];
  const filteredPets = petsCadastrados.filter(pet => pet.especie.toLowerCase() === especie.toLowerCase());

  exibirDados(filteredPets);
}

// Chama a função exibirDados se estiver na página `html`
if (document.querySelector('.all-aling')) {
  exibirDados();
}


document.getElementById('btn-cadastrar').addEventListener('click', function(event) {
  event.preventDefault();

  const mainContent = document.getElementById('sec-p');
  const novaSecao = document.getElementById('nova-secao');
  const btnCadastrar = document.getElementById('btn-cadastrar');

  // Ocultar o botão na transição para a nova seção
  btnCadastrar.style.display = 'none';
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

 

