(function () {
  window.API_BASE = window.API_BASE || 'http://localhost:8081';
  window.listaCompletaDePets = window.listaCompletaDePets || [];

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const logoText = document.getElementById('logo-texto');
    if (!sidebar || !logoText) return;
    sidebar.classList.toggle('expandido');
    logoText.textContent = sidebar.classList.contains('expandido') ? 'vetmate' : 'v';
  }
  window.toggleSidebar = toggleSidebar;

  const popupEl = document.getElementById('notificacaoPopup');
  const notiIconEl = document.querySelector('.noti-icon');

  function toggleNotificacoes() {
    if (!popupEl || !notiIconEl) return;
    const ativa = popupEl.classList.contains('active');
    if (ativa) {
      popupEl.classList.remove('active');
      popupEl.classList.add('hide');
      notiIconEl.classList.remove('noti-icon-active');
      setTimeout(() => popupEl.classList.remove('hide'), 300);
    } else {
      popupEl.classList.add('active');
      notiIconEl.classList.add('noti-icon-active');
    }
    notiIconEl.classList.add('swing');
    setTimeout(() => notiIconEl.classList.remove('swing'), 600);
  }
  window.mostrarNotificacoes = toggleNotificacoes;

  document.addEventListener('click', (event) => {
    if (!popupEl || !notiIconEl) return;
    const clicouFora = !popupEl.contains(event.target) && !notiIconEl.contains(event.target);
    if (clicouFora && popupEl.classList.contains('active')) {
      popupEl.classList.remove('active');
      popupEl.classList.add('hide');
      setTimeout(() => popupEl.classList.remove('hide'), 300);
    }
  });

  function mostrarSecaoCadastro1() {
    const secP = document.getElementById('sec-p') || document.getElementById('main-content');
    const novaSecao = document.getElementById('nova-secao');
    if (!secP || !novaSecao) return;
    secP.classList.add('hidden');
    setTimeout(() => {
      secP.style.display = 'none';
      novaSecao.style.display = 'block';
      novaSecao.classList.add('active');
    }, 300);
  }

  function mostrarSecaoCadastro2() {
    const s1 = document.getElementById('nova-secao');
    const s2 = document.getElementById('nova-secao2');
    if (!s1 || !s2) return;
    s1.classList.add('hidden');
    setTimeout(() => {
      s1.style.display = 'none';
      s2.style.display = 'block';
      s2.classList.add('active');
      s2.classList.remove('hidden');
    }, 300);
  }

  async function carregarEExibirPets() {
    const token = localStorage.getItem('vm_token');
    const container = document.querySelector('.all-aling');
    if (!container) return;
    if (!token) {
      container.innerHTML = '<p>Você precisa fazer login para ver seus pets.</p>';
      return;
    }
    try {
      const resp = await fetch(`${window.API_BASE}/api/pets`, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
      if (!resp.ok) throw new Error('Falha ao buscar os pets. Verifique seu login.');
      window.listaCompletaDePets = await resp.json();
      renderizarPets(window.listaCompletaDePets);
    } catch (err) {
      container.innerHTML = `<p>Ocorreu um erro: ${err.message}</p>`;
    }
  }
  window.carregarEExibirPets = carregarEExibirPets;

  function renderizarPets(listaDePets) {
    const container = document.querySelector('.all-aling');
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(listaDePets) || listaDePets.length === 0) {
      container.innerHTML = '<p style="text-align:center;width:100%;">Nenhum pet encontrado.</p>';
      return;
    }
    listaDePets.forEach(pet => {
      const generoTxt = String(pet.genero || pet.gender || '').toLowerCase();
      const generoIcone = generoTxt === 'macho'
        ? '<img src="assets/imagens/icons8-masculino-32.png" alt="Macho" style="width:20px;height:20px;">'
        : '<img src="assets/imagens/icons8-feminino-24.png" alt="Fêmea" style="width:20px;height:20px;">';
      const pesoValor = pet.peso ?? pet.weightKg ?? '-';
      const idadeValor = pet.idade ?? pet.ageYears ?? '-';
      const especieValor = pet.especie ?? pet.species ?? '-';
      const porteValor = pet.porte ?? pet.size ?? '-';
      const div = document.createElement('div');
      div.className = 'pet-card-container';
      div.innerHTML = `
        <div class="card-pet-info">
          <div class="pet-header">
            <h3>${pet.nome || pet.name || '(Sem nome)'}</h3>
            <span>${generoIcone}</span>
          </div>
          <p><strong>Espécie:</strong> ${especieValor}</p>
          <p><strong>Porte:</strong> ${porteValor}</p>
          <p><strong>Peso:</strong> ${pesoValor} Kg</p>
          <p><strong>Idade:</strong> ${idadeValor} anos</p>
          <div class="pet-actions">
            <button class="btn-info">Mais informações</button>
            <button class="btn-excluir" data-id="${pet.id}">Excluir</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
    container.querySelectorAll('.btn-excluir').forEach(b => {
      b.addEventListener('click', () => excluirPet(b.getAttribute('data-id')));
    });
  }

  async function excluirPet(petId) {
    if (!confirm('Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.')) return;
    const token = localStorage.getItem('vm_token');
    if (!token) {
      alert('Sua sessão expirou. Faça o login novamente.');
      return;
    }
    try {
      const resp = await fetch(`${window.API_BASE}/api/pets/${petId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!resp.ok) throw new Error('Não foi possível excluir o pet.');
      alert('Pet excluído com sucesso!');
      carregarEExibirPets();
    } catch (err) {
      alert(err.message);
    }
  }

  function filtrarItens() {
    const termo = (document.getElementById('searchBar')?.value || '').toLowerCase();
    const petsFiltrados = window.listaCompletaDePets.filter(pet =>
      String(pet.nome || pet.name || '').toLowerCase().includes(termo) ||
      String(pet.especie || pet.species || '').toLowerCase().includes(termo) ||
      String(pet.porte || pet.size || '').toLowerCase().includes(termo)
    );
    renderizarPets(petsFiltrados);
  }
  window.filtrarItens = filtrarItens;
  window.buscarPorItem = function (especie) {
    const termo = String(especie || '').toLowerCase();
    const petsFiltrados = window.listaCompletaDePets.filter(pet => String(pet.especie || pet.species || '').toLowerCase() === termo);
    renderizarPets(petsFiltrados);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const btnCadastrar = document.getElementById('btn-cadastrar');
    if (btnCadastrar) btnCadastrar.addEventListener('click', (e) => { e.preventDefault(); mostrarSecaoCadastro1(); });
    const botaoAvancar = document.getElementById('botao2');
    if (botaoAvancar) botaoAvancar.addEventListener('click', (e) => { e.preventDefault(); mostrarSecaoCadastro2(); });
    if (document.querySelector('.all-aling')) carregarEExibirPets();
  });
})();
