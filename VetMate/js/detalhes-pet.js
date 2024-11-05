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