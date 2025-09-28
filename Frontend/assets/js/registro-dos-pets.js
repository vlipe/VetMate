
const API_BASE = 'http://localhost:8081'; 


let listaCompletaDePets = [];



async function carregarEExibirPets() {
    const token = localStorage.getItem('vm_token');
    if (!token) {
        document.querySelector('.all-aling').innerHTML = '<p>Você precisa fazer login para ver seus pets.</p>';
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE}/api/pets`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) throw new Error('Falha ao buscar os pets. Verifique seu login.');


        listaCompletaDePets = await resposta.json();
        

        renderizarPets(listaCompletaDePets);

    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        document.querySelector('.all-aling').innerHTML = `<p>Ocorreu um erro: ${error.message}</p>`;
    }
}

async function salvarDados() {
    const token = localStorage.getItem('vm_token');
    if (!token) {
        alert('Você precisa estar logado para cadastrar um pet.');
        window.location.href = 'index.html';
        return;
    }


    const nome = document.getElementById('nome').value.trim();
    const idade = document.getElementById('idade').value;
    const peso = document.getElementById('peso').value;
    const genero = document.getElementById('genero').value;
    const especie = document.getElementById('especie').value;
    const porte = document.getElementById('porte').value;


    if (!nome || !idade || !peso || !genero || !especie || !porte) {
        alert('Por favor, preencha todos os campos do formulário.');
        return;
    }

    const dadosDoPet = {
        nome: nome,
        idade: parseInt(idade),
        peso: parseFloat(peso),
        genero: genero,
        especie: especie,
        porte: porte
    };

    try {
        const resposta = await fetch(`${API_BASE}/api/pets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosDoPet)
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.message || 'Falha ao cadastrar o pet.');
        }

        alert('Pet cadastrado com sucesso!');

        window.location.href = 'registro-dos-pets.html';

    } catch (error) {
        console.error('Erro no cadastro do pet:', error);
        alert(`Ocorreu um erro: ${error.message}`);
    }
}


/**
 * Exclui um pet do banco de dados através da API, usando o ID do pet.
 * @param {number} petId 
 */
async function excluirPet(petId) {
    if (!confirm('Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.')) {
        return;
    }

    const token = localStorage.getItem('vm_token');
    if (!token) {
        alert('Sua sessão expirou. Faça o login novamente.');
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE}/api/pets/${petId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) throw new Error('Não foi possível excluir o pet.');

        alert('Pet excluído com sucesso!');
        // Recarrega a lista da API para atualizar a tela
        carregarEExibirPets();

    } catch (error) {
        console.error('Erro ao excluir pet:', error);
        alert(error.message);
    }
}




/**
 * Desenha os cards dos pets na tela a partir de uma lista.
 * @param {Array} listaDePets - A lista de pets a ser exibida.
 */
function renderizarPets(listaDePets) {
    const container = document.querySelector('.all-aling');
    container.innerHTML = ''; // Limpa a tela antes de desenhar

    if (listaDePets.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum pet encontrado.</p>';
        return;
    }


    listaDePets.forEach(pet => {
        const generoIcone = pet.genero.toLowerCase() === 'macho'
            ? '<img src="assets/imagens/icons8-masculino-32.png" alt="Macho" style="width: 20px; height: 20px;">'
            : '<img src="assets/imagens/icons8-feminino-24.png" alt="Fêmea" style="width: 20px; height: 20px;">';

        const petDiv = document.createElement('div');

        petDiv.className = 'pet-card-container'; 
        
        petDiv.innerHTML = `
          <div class="card-pet-info">
              <div class="pet-header">
                  <h3>${pet.nome}</h3>
                  <span>${generoIcone}</span>
              </div>
              <p><strong>Espécie:</strong> ${pet.especie}</p>
              <p><strong>Porte:</strong> ${pet.porte}</p>
              <p><strong>Peso:</strong> ${pet.peso} Kg</p>
              <p><strong>Idade:</strong> ${pet.idade} anos</p>
              <div class="pet-actions">
                  <button class="btn-info">Mais informações</button>
                  <button class="btn-excluir" onclick="excluirPet(${pet.id})">Excluir</button>
              </div>
          </div>
        `;
        container.appendChild(petDiv);
    });
}



function filtrarItens() {
    const termo = document.getElementById('searchBar').value.toLowerCase();
    const petsFiltrados = listaCompletaDePets.filter(pet =>
        pet.nome.toLowerCase().includes(termo) ||
        pet.especie.toLowerCase().includes(termo) ||
        pet.porte.toLowerCase().includes(termo)
    );
    renderizarPets(petsFiltrados);
}

/**
 * Filtra a lista de pets (já carregada) por espécie ao clicar nos ícones.
 * @param {string} especie - A espécie para filtrar ("Cao", "Gato", etc).
 */
function buscarPorItem(especie) {
    const termo = especie.toLowerCase();
    const petsFiltrados = listaCompletaDePets.filter(pet => pet.especie.toLowerCase() === termo);
    renderizarPets(petsFiltrados);
}





document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.all-aling')) {
        carregarEExibirPets();
    }


    const btnCadastrar = document.getElementById('btn-cadastrar');
    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', function(event) {
            event.preventDefault();
            const mainContent = document.getElementById('sec-p');
            const novaSecao = document.getElementById('nova-secao');
            
            btnCadastrar.style.display = 'none';
            mainContent.classList.add('hidden');

            setTimeout(() => {
                mainContent.style.display = 'none';
                novaSecao.style.display = 'block';
                novaSecao.classList.add('active');
            }, 700);
        });
    }

    const botaoAvancar = document.getElementById('botao2');
    if (botaoAvancar) {
        botaoAvancar.addEventListener('click', function(event) {
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
    }


});