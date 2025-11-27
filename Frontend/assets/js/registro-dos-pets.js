(function () {
  window.API_BASE = window.API_BASE || 'http://localhost:8081';

  // ---- CACHE DA PÁGINA ----
  window._petsCache = [];

  // ---- RENDER PADRÃO PARA ESTA PÁGINA (#petsList + template) ----
  function renderPets(list){
    const listEl = document.getElementById('petsList');
    const tpl = document.getElementById('petCardTpl');
    if(!listEl || !tpl) return;

    listEl.innerHTML = '';

    if(!Array.isArray(list) || list.length === 0){
      listEl.innerHTML = `<p style="grid-column:1/-1; text-align:center;">Nenhum pet encontrado.</p>`;
      return;
    }


    list.forEach(p => {
      const node = tpl.content.cloneNode(true);
      // depois de clonar o template:
const photoEl = node.querySelector('.pet-photo');

// URL salva no backend
const foto = p.photo_url || p.foto || p.imageUrl || p.avatarUrl;
if (foto) {
  photoEl.style.backgroundImage = `url("${foto}")`;
  photoEl.style.backgroundSize = 'cover';
  photoEl.style.backgroundPosition = 'center';
  photoEl.style.borderRadius = '50%';
}

// nomes snake_case vindos do backend
const pesoVal  = p.weight_kg ?? p.peso ?? p.weight ?? p.weightKg ?? null;
const idadeVal = p.age_years ?? p.idade ?? p.age ?? p.ageYears ?? null;

node.querySelector('.pet-weight').textContent = (pesoVal ?? '-');
node.querySelector('.pet-age').textContent    = (idadeVal ?? '-');

      node.querySelector('.pet-name').textContent    = p.nome || p.name || '—';
      node.querySelector('.pet-species').textContent = p.especie || p.species || '—';
      node.querySelector('.pet-size').textContent    = p.porte || p.size || '—';
      node.querySelector('.pet-weight').textContent  = (p.peso ?? p.weight_kg ?? '-') || '-';
      node.querySelector('.pet-age').textContent     = (p.idade ?? p.age_years ?? '-') || '-';

      node.querySelector('.btn-more').addEventListener('click', () => {
        console.log('Mais informações do pet', p);
      });

      const token = localStorage.getItem('vm_token');
      node.querySelector('.btn-delete').addEventListener('click', async () => {
        if(!confirm(`Excluir o pet "${p.nome || p.name}"?`)) return;
        const del = await fetch(`${window.API_BASE}/pets/${p.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if(del.ok){
          await window.carregarEExibirPets(); // recarrega cache e UI
        }else{
          alert('Falha ao excluir o pet.');
        }
      });

      listEl.appendChild(node);
    });
  }

  // ---- LISTAR E ALIMENTAR O CACHE ----
  window.carregarEExibirPets = async function carregarEExibirPets(){
    const token = localStorage.getItem('vm_token');
    const listEl = document.getElementById('petsList');
    if(!listEl) return;

    listEl.innerHTML = '';

    const resp = await fetch(`${window.API_BASE}/pets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if(!resp.ok){
      const msg = (await resp.text()) || 'Erro ao carregar pets';
      listEl.innerHTML = `<p style="color:#b91c1c">${msg}</p>`;
      return;
    }

    // guarda no cache desta página
    window._petsCache = await resp.json();
    renderPets(window._petsCache);
  };

  // ---- PESQUISA (barra) ----
  window.filtrarItens = function filtrarItens(){
    const termo = (document.getElementById('searchBar')?.value || '').toLowerCase().trim();
    if(!termo){
      renderPets(window._petsCache);
      return;
    }
    const out = window._petsCache.filter(p => {
      const nome = String(p.nome || p.name || '').toLowerCase();
      const esp  = String(p.especie || p.species || '').toLowerCase();
      const por  = String(p.porte || p.size || '').toLowerCase();
      return nome.includes(termo) || esp.includes(termo) || por.includes(termo);
    });
    renderPets(out);
  };

  // ---- FILTRO POR ESPÉCIE (ícones) ----
  window.buscarPorItem = function buscarPorItem(especie){
    const alvo = String(especie || '').toLowerCase();
    // seus dados estão salvos como 'cao', 'gato', 'silvestre' → normaliza
    const map = { 'cao':'cao', 'cão':'cao', 'gato':'gato', 'silvestre':'silvestre' };
    const key = map[alvo] || alvo;

    const out = window._petsCache.filter(p => {
      const esp = String(p.especie || p.species || '').toLowerCase();
      return esp === key;
    });
    renderPets(out);
  };

  // ---- DOM READY ----
  document.addEventListener('DOMContentLoaded', () => {
    const btnSalvar = document.getElementById('botao4');
    if (btnSalvar) btnSalvar.addEventListener('click', (e) => { e.preventDefault(); salvarDados(); });

    window.carregarEExibirPets();
  });

  

  })();