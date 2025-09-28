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
    window.location.href = 'registro-dos-pets';
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

const API_BASE = window.API_BASE || 'http://localhost:8081/api';
const token = localStorage.getItem('vm_token');

const btnAtualizar = document.querySelector('.submit');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const inputConf  = document.getElementById('confirmacaoSenha');
const inputFile  = document.getElementById('file');

// 1) Carrega dados atuais (inclusive avatar) para exibir
(async () => {
  const r = await fetch(`${API_BASE}/me`, { headers: {Authorization:`Bearer ${token}`}});
  const me = await r.json();
  document.querySelector('.user-nome')?.textContent  = me.user.name || 'Usuário';
  document.querySelector('.user-email')?.textContent = me.user.email || '';
  if (me.user.avatar_url) {
    const avatarEls = document.querySelectorAll('.avatar, .avatar-chatbot, .foto-perfil'); // ajuste seus seletores
    avatarEls.forEach(el => el.src = me.user.avatar_url);
  }
})();

// 2) Upload de foto sozinho (sem preencher outros campos)
inputFile.addEventListener('change', async () => {
  if (!inputFile.files?.length) return;
  const fd = new FormData();
  fd.append('avatar', inputFile.files[0]);
  const resp = await fetch(`${API_BASE}/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });
  if (!resp.ok) {
    const t = await resp.text();
    alert('Falha no upload: ' + t);
    return;
  }
  const { user } = await resp.json();
  // atualiza imagem na UI
  document.querySelectorAll('.avatar, .avatar-chatbot, .foto-perfil')
    .forEach(el => el.src = user.avatar_url);
  alert('Foto atualizada!');
});

// 3) Atualização parcial de texto (nenhum campo é obrigatório)
btnAtualizar.addEventListener('click', async (e) => {
  e.preventDefault();
  const body = {};
  if (inputNome.value.trim()  !== '') body.name = inputNome.value.trim();
  if (inputEmail.value.trim() !== '') body.email = inputEmail.value.trim();

  if (inputSenha.value) {
    if (inputSenha.value !== inputConf.value) {
      alert('Confirmação de senha não confere.');
      return;
    }
    body.password = inputSenha.value;
  }

  if (Object.keys(body).length === 0) {
    alert('Nada para atualizar (a foto é enviada no campo acima).');
    return;
  }

  const resp = await fetch(`${API_BASE}/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const t = await resp.text();
    alert('Falha ao atualizar: ' + t);
    return;
  }
  const { user } = await resp.json();
  document.querySelector('.user-nome')?.textContent  = user.name;
  document.querySelector('.user-email')?.textContent = user.email;
  alert('Dados atualizados!');
});


 

