// Obtém os elementos de input e o botão pelo ID
const senhaInput = document.getElementById('senha');
const confirmacaoSenhaInput = document.getElementById('confirmacaoSenha');
const atualizarButton = document.querySelector('.submit');

// Flag para controlar a verificação da confirmação
let verificarConfirmacao = false;

// Função para verificar se as senhas coincidem e atendem aos requisitos
function verificarSenhas(event) {
  event.preventDefault();

  const senha = senhaInput.value;
  const confirmacaoSenha = confirmacaoSenhaInput.value;

  // Expressões regulares para validar os requisitos da senha
  const regexMinimo8Digitos = /.{3,}/;


  let mensagemErroSenha = "";
  if (!regexMinimo8Digitos.test(senha)) {
    mensagemErroSenha += "A senha deve ter no mínimo 3 caracteres. ";
  }
  
  if (mensagemErroSenha !== "") {
    alert(mensagemErroSenha);
    senhaInput.value = ''; // Limpa o input de senha
    confirmacaoSenhaInput.value = ''; // Limpa o input de confirmação
    senhaInput.focus(); 
    verificarConfirmacao = false;
  } else {
    verificarConfirmacao = true;
    if (senha !== confirmacaoSenha) {
      alert("A confirmação de senha está incorreta. Por favor, tente novamente.");
      confirmacaoSenhaInput.value = '';
      confirmacaoSenhaInput.focus();
      verificarConfirmacao = false;
    } else {
      alert("Formulário enviado com sucesso! Suas informações serão atualizadas.");
      // Aqui você pode adicionar outras ações, como enviar o formulário manualmente, se necessário
    }
  }
}

// Adiciona um ouvinte de evento de clique ao botão "Atualizar"
atualizarButton.addEventListener('click', verificarSenhas);

// Adiciona um ouvinte de evento blur no segundo input para verificar a confirmação apenas quando necessário
confirmacaoSenhaInput.addEventListener('blur', () => {
  if (verificarConfirmacao) {
    verificarSenhas(event); 
  }
});


const API_BASE = window.API_BASE || 'http://localhost:8081/api';
const token = localStorage.getItem('vm_token');
if (!token) {
  alert('Faça login novamente');
  window.location.href = 'area-restrita.html';
}


// Carrega dados do /me para mostrar avatar/nome/email atuais
async function carregarPerfil() {
  try {
    const resp = await fetch(`${API_BASE}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    const user = data.user || {};

    // exibir avatar (se houver) em algum img#avatarPreview
    const img = document.getElementById('avatarPreview');
    if (img && user.avatar_url) img.src = user.avatar_url;

    // opcional: preencher placeholders
    document.getElementById('nome').placeholder  = user.name  || 'Insira seu nome';
    document.getElementById('email').placeholder = user.email || 'Insira seu email';
  } catch (e) {
    console.error(e);
  }
}

// Atualizar (parcial): envia só o que for preenchido
document.querySelector('.submit').addEventListener('click', async (e) => {
  e.preventDefault();

  const name  = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const conf  = document.getElementById('confirmacaoSenha').value.trim();

  const body = {};
  if (name)  body.name  = name;
  if (email) body.email = email;
  if (senha) {
    if (senha !== conf) {
      alert('Confirmação de senha incorreta');
      return;
    }
    body.password = senha;
  }

  if (Object.keys(body).length === 0) {
    alert('Nada para atualizar.');
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    alert('Dados atualizados!');
    // se quiser, atualize UI/localStorage
  } catch (err) {
    console.error(err);
    alert('Falha ao atualizar: ' + err.message);
  }
});

// Upload do avatar sem precisar preencher mais nada
document.getElementById('file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append('avatar', file);

  try {
    const resp = await fetch(`${API_BASE}/user/avatar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }, // NÃO defina Content-Type manualmente
      body: fd
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    const url  = data.avatar_url;

    // Mostra na tela
    const img = document.getElementById('avatarPreview');
    if (img) img.src = url;

    // Se a Área Restrita usa localStorage para montar header, salve:
    const vmUser = JSON.parse(localStorage.getItem('vm_user') || '{}');
    vmUser.avatar_url = url;
    localStorage.setItem('vm_user', JSON.stringify(vmUser));

    alert('Foto atualizada!');
  } catch (err) {
    console.error(err);
    alert('Falha no upload: ' + err.message);
  }
});



document.addEventListener('DOMContentLoaded', () => {
  // ===== CONFIG =====
  const API_BASE = (window.API_BASE || 'http://localhost:8081/api').replace(/\/$/, '');
  let token = localStorage.getItem('vm_token') || '';
  if (token.startsWith('"') && token.endsWith('"')) token = token.slice(1, -1);

  if (!token) {
    alert('Faça login novamente');
    window.location.href = 'area-restrita.html';
    return;
  }

  // ===== Seletores =====
  const form           = document.querySelector('form');
  const btnSubmit      = document.querySelector('.submit');

  const modal          = document.getElementById('imageModal');
  const closeBtn       = document.querySelector('.close');
  let fileInput        = document.getElementById('file'); 
  const imagePreview   = document.getElementById('imagePreview');
  const avatarPreview  = document.getElementById('avatarPreview');

  const btnRotateLeft  = document.getElementById('rotateLeft');
  const btnRotateRight = document.getElementById('rotateRight');
  const btnZoomIn      = document.getElementById('zoomIn');
  const btnZoomOut     = document.getElementById('zoomOut');
  const btnCrop        = document.getElementById('cropImage');

  const inputNome      = document.getElementById('nome');
  const inputEmail     = document.getElementById('email');
  const inputSenha     = document.getElementById('senha');
  const inputConfSenha = document.getElementById('confirmacaoSenha');

  const freshInput = fileInput.cloneNode(true);
fileInput.parentNode.replaceChild(freshInput, fileInput);
fileInput = freshInput;

  if (form) form.addEventListener('submit', (e) => e.preventDefault());

  let cropper = null;

  // ===== Helpers =====
  async function api(path, opts = {}) {
    const headers = new Headers(opts.headers || {});
    if (!headers.has('Authorization') && token) {
      headers.set('Authorization', 'Bearer ' + token);
    }
    return fetch(API_BASE + path, { ...opts, headers });
  }
  async function safeJson(resp) { try { return await resp.json(); } catch { return null; } }
  function toast(msg, isError=false){ alert((isError?'❌ ':'✅ ')+msg); }

  // ===== 1) Carregar perfil =====
  async function loadProfile() {
    try {
      const resp = await api('/me', { method: 'GET' });
      if (resp.status === 401) throw new Error('Não autorizado. Faça login novamente.');
      if (!resp.ok)           throw new Error('Falha ao carregar perfil');

      const data = await resp.json();
      const user = data.user || {};
      inputNome.value  = user.name  || '';
      inputEmail.value = user.email || '';
      if (user.avatar_url) avatarPreview.src = user.avatar_url;

      // Se existir VetMateUser, hidrata o header global
      window.VetMateUser?.saveAndHydrate?.({
        name: user.name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || null
      });
    } catch (err) {
      console.error(err);
      toast(err.message || 'Erro ao carregar perfil', true);
    }
  }

  // ===== 2) Escolher arquivo → abrir Cropper (sem upload imediato) =====
fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (cropper) { cropper.destroy(); cropper = null; }

  imagePreview.onload = () => {
    modal.style.display = 'block';
    cropper = new Cropper(imagePreview, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      guides: true,
      center: true,
      highlight: false
    });
  };

  const reader = new FileReader();
  reader.onload = (ev) => { imagePreview.src = ev.target.result; };
  reader.readAsDataURL(file);
});

  // ===== 3) Controles do cropper =====
  btnRotateLeft .addEventListener('click', (e)=>{ e.preventDefault(); cropper?.rotate(-90); });
  btnRotateRight.addEventListener('click', (e)=>{ e.preventDefault(); cropper?.rotate( 90); });
  btnZoomIn     .addEventListener('click', (e)=>{ e.preventDefault(); cropper?.zoom(0.1);  });
  btnZoomOut    .addEventListener('click', (e)=>{ e.preventDefault(); cropper?.zoom(-0.1); });

  btnCrop.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({ width: 300, height: 300 });
  if (!canvas) return;

  canvas.toBlob(async (blob) => {
    try {
      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.jpg');

      const resp = await api('/user/avatar', { method: 'POST', body: formData });
      if (resp.status === 401) throw new Error('Não autorizado. Faça login novamente.');
      if (!resp.ok) {
        const errData = await safeJson(resp);
        throw new Error(errData?.error?.message || 'Falha ao enviar avatar');
      }

      const data = await resp.json();

      
      if (data.avatar_url) {
        const at   = Date.now();
        const bust = data.avatar_url + (data.avatar_url.includes('?') ? '&' : '?') + 't=' + at;
        avatarPreview.src = bust;

        window.VetMateUser?.saveAndHydrate?.({
          avatar_url: data.avatar_url,
          avatar_updated_at: at
        });
      }

      modal.style.display = 'none';
      fileInput.value = '';
      cropper.destroy(); cropper = null;

      toast('Imagem atualizada com sucesso!');
      
    } catch (err) {
      console.error(err);
      toast(err.message || 'Erro ao enviar imagem', true);
    }
  }, 'image/jpeg', 0.9);
});


  // ===== 5) Fechar modal =====
  function closeModalAndReset() {
    modal.style.display = 'none';
    cropper?.destroy(); cropper = null;
    fileInput.value = '';
  }
  closeBtn.addEventListener('click', closeModalAndReset);
  window.addEventListener('click', (e) => { if (e.target === modal) closeModalAndReset(); });

  // ===== 6) Atualizar nome/senha (um único listener, com validação) =====
btnSubmit.addEventListener('click', async (e) => {
  e.preventDefault();

  const name = (inputNome.value || '').trim();
  const password = inputSenha.value;
  const confirm  = inputConfSenha.value;

  if (!name && !password) { toast('Nada para atualizar', true); return; }
  if (password) {
    if (password.length < 3) { toast('A senha deve ter no mínimo 3 caracteres.', true); return; }
    if (password !== confirm) { toast('As senhas não coincidem.', true); return; }
  }

  const payload = {};
  if (name)     payload.name = name;
  if (password) payload.password = password;

  try {
    const resp = await api('/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.status === 401) throw new Error('Não autorizado. Faça login novamente.');
    if (!resp.ok) {
      const errData = await safeJson(resp);
      throw new Error(errData?.error?.message || 'Falha ao atualizar perfil');
    }

    const data = await resp.json();
    inputSenha.value = '';
    inputConfSenha.value = '';
    if (data.user?.name) inputNome.value = data.user.name;

    // Reflete no header/cards
    if (data.user?.name) {
      const cur = (() => { try { return JSON.parse(localStorage.getItem('vm_user') || '{}'); } catch { return {}; } })();
      localStorage.setItem('vm_user', JSON.stringify({ ...cur, name: data.user.name }));
      window.VetMateUser?.hydrate?.();
    }

    toast('Perfil atualizado!');
  } catch (err) {
    console.error(err);
    toast(err.message || 'Erro ao atualizar', true);
  }
});


  // Start
  loadProfile();
});




carregarPerfil();

