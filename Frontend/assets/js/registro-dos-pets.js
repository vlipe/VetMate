(function () {
  window.API_BASE = window.API_BASE || 'http://localhost:8081';

  async function salvarDados() {
    const token = localStorage.getItem('vm_token');
    if (!token) {
      alert('Você precisa estar logado para cadastrar um pet.');
      window.location.href = 'index.html';
      return;
    }
    const nome = (document.getElementById('nome')?.value || '').trim();
    const idade = document.getElementById('idade')?.value;
    const peso = document.getElementById('peso')?.value;
    const genero = document.getElementById('genero')?.value;
    const especie = document.getElementById('especie')?.value;
    const porte = document.getElementById('porte')?.value;
    if (!nome || !idade || !peso || !genero || !especie || !porte) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }
    const dadosDoPet = {
      nome,
      idade: parseInt(idade, 10),
      peso: parseFloat(peso),
      genero,
      especie,
      porte,
      name: nome,
      ageYears: parseInt(idade, 10),
      weightKg: parseFloat(peso),
      gender: genero,
      species: especie,
      size: porte
    };
    try {
  const resposta = await fetch(`${window.API_BASE}/api/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(dadosDoPet)
  });
  if (!resposta.ok) {
    let msg = 'Falha ao cadastrar o pet.';
    try {
      const errJson = await resposta.json();
      msg = errJson.error || errJson.message || msg;
    } catch {
      try { msg = await resposta.text() || msg; } catch {}
    }
    throw new Error(msg);
  }

  alert('Pet cadastrado com sucesso!');

  const estaNaPaginaDeRegistro = /registro-dos-pets(\.html)?$/i.test(location.pathname);

  if (estaNaPaginaDeRegistro) {
    document.getElementById('nova-secao2')?.classList.remove('active');
    document.getElementById('nova-secao2')?.classList.add('hidden');
    const secP = document.getElementById('sec-p') || document.getElementById('main-content');
    if (secP) {
      secP.style.display = 'block';
      secP.classList.remove('hidden');
    }
    if (typeof window.carregarEExibirPets === 'function') {
      await window.carregarEExibirPets();
      document.querySelector('.all-aling')?.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    window.location.href = 'registro-dos-pets.html';
  }
} catch (error) {
  alert(`Ocorreu um erro: ${error.message}`);
}

  }
  window.salvarDados = salvarDados;

  document.addEventListener('DOMContentLoaded', () => {
    const btnSalvar = document.getElementById('botao4');
    if (btnSalvar) btnSalvar.addEventListener('click', (e) => { e.preventDefault(); salvarDados(); });
  });
})();
