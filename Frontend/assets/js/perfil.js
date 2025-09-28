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
      alert("Formulário enviado com sucesso! Suas informações serão atualizadas em até 24 horas.");
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

carregarPerfil();

