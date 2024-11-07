const abas = document.querySelectorAll('.aba-link-acompanhamento');
const secoes = document.querySelectorAll('.secao-acompanhamento');

abas.forEach(aba => {
  aba.addEventListener('click', (event) => {
    event.preventDefault();

    abas.forEach(a => a.classList.remove('ativo'));
    aba.classList.add('ativo');

    secoes.forEach(secao => {
      secao.style.display = 'none';
    });

    const idSecao = aba.getAttribute('href');
    const secao = document.querySelector(idSecao);
    secao.style.display = 'block';
  });
});

const vacinasConteudo = document.getElementById('vacinas-conteudo');
const modalVacina = document.getElementById('modal-vacina');
const formVacina = document.getElementById('form-vacina');
const modalSucessoVacina = document.getElementById('modal-sucesso-vacina');

function carregarVacinas() {
  const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
  exibirVacinas(vacinas);
}

function exibirVacinas(vacinas) {
  vacinasConteudo.innerHTML = `
    <h1>Minhas Vacinas</h1> 
    <div id="cards-container-vacinas"></div> 
    <button id="adicionar-vacina">Adicionar Vacina</button> 
  `;

  const cardsContainer = document.getElementById('cards-container-vacinas');

  if (vacinas.length === 0) {
    cardsContainer.innerHTML = `
      <p class="p-mensagem">Cadastre as vacinas do seu pet para manter o histórico de vacinação sempre atualizado e garantir a saúde do seu amigo.</p> 
      <img src="../imagens/ilustration-vacina.png" alt="Ilustração-vacina" class="img-vacinas"> 
    `;
  } else {
    vacinas.forEach((vacina, indice) => {
      const card = `
        <div class="card-vacina">
           <img src="${vacina.imagem}" alt="${vacina.nome}">
          <div class="card-vacina-info">
            <h3>${vacina.nome}</h3>
            <p>Dosagem: ${vacina.dosagem}</p>
            <p>Data de Aplicação: <span class="math-inline">\{vacina\.data\}</p\>
<div class\="card\-vacina\-botoes"\>
<button class\="editar-vacina" data-indice="${indice}">Editar</button>
              <button class="excluir-vacina" data-indice="${indice}">Excluir</button>
            </div>
          </div>
        </div>
      `;
      cardsContainer.innerHTML += card;
    });

    const botoesEditar = document.querySelectorAll('.editar-vacina');
    botoesEditar.forEach(botao => {
      botao.addEventListener('click', () => {
        const indice = botao.dataset.indice;
        preencherModalVacina(vacinas[indice], indice);
      });
    });

    const botoesExcluir = document.querySelectorAll('.excluir-vacina');
    botoesExcluir.forEach(botao => {
      botao.addEventListener('click', () => {
        const indice = botao.dataset.indice;
        excluirVacina(indice);
      });
    });
  }

  document.getElementById('adicionar-vacina').addEventListener('click', () => {
    document.getElementById('indice-vacina').value = '';
    modalVacina.style.display = 'block';
    document.getElementById('modal-titulo-vacina').textContent = 'Cadastrar Vacina';
    formVacina.reset();
  });
}

function preencherModalVacina(vacina, indice) {
  document.getElementById('indice-vacina').value = indice;
  document.getElementById('nome-vacina').value = vacina.nome;
  document.getElementById('dosagem-vacina').value = vacina.dosagem;
  document.getElementById('data-vacina').value = vacina.data;
  document.getElementById('modal-titulo-vacina').textContent = 'Editar Vacina';
  modalVacina.style.display = 'block';
}

function excluirVacina(indice) {
  const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
  vacinas.splice(indice, 1);
  localStorage.setItem('vacinas', JSON.stringify(vacinas));
  carregarVacinas();
}

formVacina.addEventListener('submit', (event) => {
  event.preventDefault();

  const indice = parseInt(document.getElementById('indice-vacina').value);
  const imagemVacina = document.getElementById('imagem-vacina').files[0];
  const nomeVacina = document.getElementById('nome-vacina').value;
  const dosagemVacina = document.getElementById('dosagem-vacina').value;
  const dataVacina = document.getElementById('data-vacina').value;

  if (imagemVacina) {
    const reader = new FileReader();

    reader.onload = (e) => {
      salvarVacina(indice, e.target.result, nomeVacina, dosagemVacina, dataVacina, 'vacina');
    }

    reader.readAsDataURL(imagemVacina);
  } else {
    salvarVacina(indice, null, nomeVacina, dosagemVacina, dataVacina, 'vacina');
  }
});

const medicamentosConteudo = document.getElementById('medicamentos-conteudo');
const modalMedicamento = document.getElementById('modal-medicamento');
const formMedicamento = document.getElementById('form-medicamento');
const modalSucessoMedicamento = document.getElementById('modal-sucesso-medicamento');

function carregarMedicamentos() {
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  exibirMedicamentos(medicamentos);
}

function exibirMedicamentos(medicamentos) {
  medicamentosConteudo.innerHTML = `
    <h1>Meus Medicamentos</h1> 
    <div id="cards-container-medicamentos"></div> 
    <button id="adicionar-medicamento">Adicionar Medicamento</button> 
  `;

  const cardsContainer = document.getElementById('cards-container-medicamentos');

  if (medicamentos.length === 0) {
    cardsContainer.innerHTML = `
      <p class="p-mensagem">Cadastre os medicamentos do seu pet para manter o histórico de medicamentos sempre atualizado e garantir a saúde do seu amigo.</p> 
      <img src="../imagens/ilustration-remedio.png" alt="Ilustração-medicamento" class="img-vacinas"> 
    `;
  } else {
    medicamentos.forEach((medicamento, indice) => {
      const card = `
        <div class="card-vacina">
           <img src="${medicamento.imagem}" alt="${medicamento.nome}">
          <div class="card-vacina-info">
            <h3>${medicamento.nome}</h3>
            <p>Dosagem: ${medicamento.dosagem}</p>
            <p>Data de Aplicação: ${medicamento.data}</p>
<div class\="card\-vacina\-botoes"\>
<button class="editar-medicamento" data-indice="${indice}">Editar</button>
              <button class="excluir-medicamento" data-indice="${indice}">Excluir</button>
            </div>
          </div>
        </div>
      `;
      cardsContainer.innerHTML += card;
    });

    const botoesEditar = document.querySelectorAll('.editar-medicamento');
    botoesEditar.forEach(botao => {
      botao.addEventListener('click', () => {
        const indice = botao.dataset.indice;
        preencherModalMedicamento(medicamentos[indice], indice);
      });
    });

    const botoesExcluir = document.querySelectorAll('.excluir-medicamento');
    botoesExcluir.forEach(botao => {
      botao.addEventListener('click', () => {
        const indice = botao.dataset.indice;
        excluirMedicamento(indice);
      });
    });
  }

  document.getElementById('adicionar-medicamento').addEventListener('click', () => {
    document.getElementById('indice-medicamento').value = '';
    modalMedicamento.style.display = 'block';
    document.getElementById('modal-titulo-medicamento').textContent = 'Cadastrar Medicamento';
    formMedicamento.reset();
  });
}

function preencherModalMedicamento(medicamento, indice) {
  document.getElementById('indice-medicamento').value = indice;
  document.getElementById('nome-medicamento').value = medicamento.nome;
  document.getElementById('dosagem-medicamento').value = medicamento.dosagem;
  document.getElementById('data-medicamento').value = medicamento.data;
  document.getElementById('modal-titulo-medicamento').textContent = 'Editar Medicamento';
  modalMedicamento.style.display = 'block';
}

function excluirMedicamento(indice) {
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  medicamentos.splice(indice, 1);
  localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
  carregarMedicamentos();
}

formMedicamento.addEventListener('submit', (event) => {
  event.preventDefault();

  const indice = parseInt(document.getElementById('indice-medicamento').value);
  const imagemMedicamento = document.getElementById('imagem-medicamento').files[0];
  const nomeMedicamento = document.getElementById('nome-medicamento').value;
  const dosagemMedicamento = document.getElementById('dosagem-medicamento').value;
  const dataMedicamento = document.getElementById('data-medicamento').value;

  if (imagemMedicamento) {
    const reader = new FileReader();

    reader.onload = (e) => {
      salvarMedicamento(indice, e.target.result, nomeMedicamento, dosagemMedicamento, dataMedicamento);
    }

    reader.readAsDataURL(imagemMedicamento);
  } else {
    salvarMedicamento(indice, null, nomeMedicamento, dosagemMedicamento, dataMedicamento);
  }
});


function salvarMedicamento(indice, imagem, nome, dosagem, data) {
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  const novoMedicamento = {
    nome,
    dosagem,
    data
  };

  if (imagem) {
    novoMedicamento.imagem = imagem;
  } else if (indice !== "") {
    novoMedicamento.imagem = medicamentos[indice].imagem;
  }

  if (!isNaN(indice)) {
    medicamentos[indice] = novoMedicamento;
  } else {
    medicamentos.push(novoMedicamento);
  }

  localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

  modalSucessoMedicamento.style.display = 'block';

  const fecharModalSucesso = document.getElementById('fechar-modal-sucesso-medicamento');
  fecharModalSucesso.addEventListener('click', () => {
    modalSucessoMedicamento.style.display = 'none';
  });

  modalMedicamento.style.display = 'none';
  formMedicamento.reset();
  carregarMedicamentos();
}

function salvarVacina(indice, imagem, nome, dosagem, data, tipo) {
  const dados = JSON.parse(localStorage.getItem(tipo + 's')) || [];
  const novoItem = {
    nome,
    dosagem,
    data
  };

  if (imagem) {
    novoItem.imagem = imagem;
  } else if (indice !== "") {
    novoItem.imagem = dados[indice].imagem;
  }

  if (!isNaN(indice)) {
    dados[indice] = novoItem;
  } else {
    dados.push(novoItem);
  }

  localStorage.setItem(tipo + 's', JSON.stringify(dados));

  const modalSucesso = document.getElementById('modal-sucesso-' + tipo);
  modalSucesso.style.display = 'block';

  const fecharModalSucesso = document.getElementById('fechar-modal-sucesso-' + tipo);
  fecharModalSucesso.addEventListener('click', () => {
    modalSucesso.style.display = 'none';
  });

  const modal = document.getElementById('modal-' + tipo);
  const form = document.getElementById('form-' + tipo);
  modal.style.display = 'none';
  form.reset();


  if (tipo === 'vacina') {
    carregarVacinas();
  } else if (tipo === 'medicamento') {
    carregarMedicamentos();
  }
}

window.onclick = function (event) {
  if (event.target == modalVacina || event.target == modalMedicamento) {
    modalVacina.style.display = 'none';
    modalMedicamento.style.display = 'none';
  }
}

carregarVacinas();
carregarMedicamentos();

