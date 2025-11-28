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

  function abrirFormularioCadastro(diretoSegundoPasso = true) {
  const secP = document.getElementById('sec-p') || document.getElementById('main-content');
  const s1 = document.getElementById('nova-secao');
  const s2 = document.getElementById('nova-secao2');
  if (!secP || !s1 || !s2) return;

  // Esconde conteúdo inicial e mostra etapa 1
  secP.classList.add('hidden');
  secP.style.display = 'none';
  s1.style.display = 'block';
  s1.classList.add('active');
  s1.classList.remove('hidden');

  // Se quiser já cair direto no formulário (etapa 2)
  if (diretoSegundoPasso) {
    // sem animação/espera
    s1.style.display = 'none';
    s2.style.display = 'block';
    s2.classList.add('active');
    s2.classList.remove('hidden');
  }
}

// === CRIAR PET + (opcional) UPLOAD DE FOTO ===
async function salvarDados() {
  if (window.__vm_meus_pets_init) { 
  console.warn('meus-pets.js já inicializado — abortando segundo load');
  return;
}
window.__vm_meus_pets_init = true;

  const token = localStorage.getItem('vm_token');
  if (!token) {
    alert('Você precisa estar logado para cadastrar um pet.');
    window.location.href = 'index.html';
    return;
  }

  // campos do form (meus-pets.html > #nova-secao2)
  const nome    = (document.getElementById('nome')?.value || '').trim();
  const idade   = document.getElementById('idade')?.value;
  const peso    = document.getElementById('peso')?.value;
  const genero  = document.getElementById('genero')?.value;
  const especie = document.getElementById('especie')?.value;
  const porte   = document.getElementById('porte')?.value;

  if (!nome || !idade || !peso || !genero || !especie || !porte) {
    alert('Por favor, preencha todos os campos do formulário.');
    return;
  }

  // mapeia para snake_case esperado pelo backend
  const payload = {
    name: nome,
    species: especie,         // 'cao' | 'gato' | 'silvestre'
    size: porte,              // 'pequeno' | 'medio' | 'grande'
    sex: genero,              // se seu backend usa 'sex' (ajuste se for 'gender')
    weight_kg: parseFloat(peso),
    age_years: parseInt(idade, 10),

    // mantém também os aliases que você vinha usando
    nome,
    especie,
    porte,
    genero,
    peso: parseFloat(peso),
    idade: parseInt(idade, 10)
  };

  try {
    // 1) cria o pet
    const resp = await fetch(`${window.API_BASE}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      let msg = 'Falha ao cadastrar o pet.';
      try {
        const j = await resp.json();
        msg = j.error || j.message || msg;
      } catch {
        try { msg = await resp.text() || msg; } catch {}
      }
      throw new Error(msg);
    }

    const novoPet = await resp.json();       // precisa do id retornado
    const novoId  = novoPet.id;

    // 2) se usuário escolheu arquivo, sobe a foto
    const fileEl = document.getElementById('file');  // <input type="file" id="file">
    if (fileEl && fileEl.files && fileEl.files[0]) {
      const fd = new FormData();
      fd.append('photo', fileEl.files[0]);   // $_FILES['photo'] no backend

      const up = await fetch(`${window.API_BASE}/pets/${novoId}/photo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // NÃO defina Content-Type
        body: fd
      });

      if (!up.ok) {
        console.warn('Falha ao subir a foto do pet:', await up.text());
      }
    }

    alert('Pet cadastrado com sucesso!');

window.location.href = `registro-dos-pets.html?petId=${encodeURIComponent(novoId)}`;
return; 


    

  } catch (err) {
    alert(`Ocorreu um erro: ${err.message}`);
  }
}

window.salvarDados = salvarDados;

 

  async function carregarEExibirPets() {
    const token = localStorage.getItem('vm_token');
    const container = document.querySelector('.all-aling');
    if (!container) return;
    if (!token) {
      container.innerHTML = '<p>Você precisa fazer login para ver seus pets.</p>';
      return;
    }
    try {
      const resp = await fetch(`${window.API_BASE}/pets`, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
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
      const pesoValor = pet.peso ?? pet.weight_kg ?? '-';
      const idadeValor = pet.idade ?? pet.age_years ?? '-';
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
      const resp = await fetch(`${window.API_BASE}/pets/${petId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
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

  // Deep-link: se vier com #form-pet ou ?openForm=2, abre o formulário
  const hash = location.hash;
  const qs = new URLSearchParams(location.search);
  if (hash === '#form-pet' || qs.get('openForm') === '2') {
    abrirFormularioCadastro(true); // true = vai direto para a etapa 2
  }

  const btnSalvar = document.getElementById('botao4'); // botão "Cadastrar pet" da etapa 2
  if (btnSalvar) {
    btnSalvar.addEventListener('click', (e) => {
      e.preventDefault();
      salvarDados();
    });
  } 

  if (document.querySelector('.all-aling')) carregarEExibirPets();
});

})();
