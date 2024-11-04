// Função para salvar os dados no localStorage
function salvarDados() {
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const peso = document.getElementById('peso').value;
    const genero = document.getElementById('genero').value;
    const especie = document.getElementById('especie').value;
    const porte = document.getElementById('porte').value;

  
    // Verifica se todos os campos estão preenchidos
    if (!nome || !idade || !peso || !genero || !especie || !porte) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return; // Impede o salvamento se algum campo estiver vazio
    }
  
  
  
    // Salva os dados no localStorage
    localStorage.setItem('nome', nome);
    localStorage.setItem('idade', idade);
    localStorage.setItem('peso', peso);
    localStorage.setItem('genero', genero);
    localStorage.setItem('especie', especie);
    localStorage.setItem('porte', porte);
  
    alert('Dados do pet cadastrados com sucesso!');
  
    // Redireciona para a página que exibe os dados
    window.location.href = "../html/registro-dos-pets.html";
  }
  
  // Função para exibir os dados na página html
  function exibirDados() {
    const nome = localStorage.getItem('nome');
    const idade = localStorage.getItem('idade');
    const peso = localStorage.getItem('peso');
    const genero = localStorage.getItem('genero');
    const especie = localStorage.getItem('especie');
    const porte = localStorage.getItem('porte');
  
    // Exibe os dados na página
    document.getElementById('exibirNome').textContent = nome;
    document.getElementById('exibirIdade').textContent = idade;
    document.getElementById('exibirPeso').textContent = peso;
    document.getElementById('exibirGenero').textContent = genero;
    document.getElementById('exibirEspecie').textContent = especie;
    document.getElementById('exibirPorte').textContent = porte;
  }
  
  // Chama a função exibirDados se estiver na página html
  if (document.getElementById('exibirNome')) {
    exibirDados();
  }
  



//   barra de pesquisa
function filtrarItens() {
    // Pega o valor digitado pelo usuário e converte para minúsculas
    const termoPesquisa = document.getElementById('searchBar').value.toLowerCase();
    // Seleciona todos os itens da lista
    const itens = document.querySelectorAll('#listaDeItens .item ' );

    // Itera sobre cada item para verificar se ele corresponde ao termo pesquisado
    itens.forEach(item=> {
        // Converte o texto do item para minúsculas
        const textoItem = item.textContent.toLowerCase();
        // Verifica se o texto do item contém o termo de pesquisa
        if (textoItem.includes(termoPesquisa)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Função para filtrar itens com base na entrada do usuário

// Função para buscar diretamente por um item específico ao clicar
function buscarPorItem(nome) {
    document.getElementById('searchBar').value = nome;
    filtrarItens();
}
 

