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
  const regexMinimo8Digitos = /.{8,}/;
  const regexCaracteresEspeciais = /[@!#]/;
  const regexLetras = /[a-zA-Z]/;

  let mensagemErroSenha = "";
  if (!regexMinimo8Digitos.test(senha)) {
    mensagemErroSenha += "A senha deve ter no mínimo 8 caracteres. ";
  }
  if (!regexCaracteresEspeciais.test(senha)) {
    mensagemErroSenha += "A senha deve conter pelo menos um dos caracteres: @, ! ou #. ";
  }
  if (!regexLetras.test(senha)) {
    mensagemErroSenha += "A senha deve conter pelo menos uma letra. ";
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