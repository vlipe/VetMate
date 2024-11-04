function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const logoText = document.getElementById('logo-texto');
    
    sidebar.classList.toggle('expandido');

    if (sidebar.classList.contains('expandido')) {
        logoText.textContent = 'vetmate';
    } else {
        logoText.textContent = 'v';
    }
}

const sidebar = document.getElementById('sidebar');
sidebar.addEventListener('click', toggleSidebar);

function toggleNotificacoes() {
    const popup = document.getElementById('notificacaoPopup');
    const botaoNotificacao = document.querySelector('.noti-icon');
    
    if (popup.classList.contains('active')) {
        popup.classList.remove('active');
        popup.classList.add('hide');
        botaoNotificacao.classList.remove('noti-icon-active'); 
        
        setTimeout(() => {
            popup.classList.remove('hide');
        }, 300); 
    } else {
        popup.classList.add('active');
        botaoNotificacao.classList.add('noti-icon-active'); 
    }

    botaoNotificacao.classList.add('swing');
    
    setTimeout(() => {
        botaoNotificacao.classList.remove('swing');
    }, 600);
}

const botaoNotificacao = document.querySelector('.noti-icon');
botaoNotificacao.addEventListener('click', toggleNotificacoes);

document.addEventListener('click', (event) => {

    if (!popup.contains(event.target) && !icon.contains(event.target)) {
        popup.classList.remove('active');
        popup.classList.add('hide');

        setTimeout(() => {
            popup.classList.remove('hide');
        }, 300);
    }
});

const daysContainer = document.querySelector(".dias"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  mes = document.querySelector(".mes"),
  hojeBtn = document.querySelector(".hoje-btn");

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const data = new Date();

let mesAtual = data.getMonth();
let anoAtual = data.getFullYear();

function renderizarCalendario() {
  data.setDate(1);
  const primeiroDia = new Date(anoAtual, mesAtual, 1);
  const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
  const indiceUltimoDia = ultimoDia.getDay();
  const dataUltimoDia = ultimoDia.getDate();
  const ultimoDiaAnterior = new Date(anoAtual, mesAtual, 0);
  const dataUltimoDiaAnterior = ultimoDiaAnterior.getDate();
  const diasProximos = 7 - indiceUltimoDia - 1;

  mes.innerHTML = `${meses[mesAtual]} ${anoAtual}`;

  let dias = "";

  for (let x = primeiroDia.getDay(); x > 0; x--) {
    dias += `<div class="dia anterior">${dataUltimoDiaAnterior - x + 1}</div>`;
  }

  for (let i = 1; i <= dataUltimoDia; i++) {
    if (
      i === new Date().getDate() &&
      mesAtual === new Date().getMonth() &&
      anoAtual === new Date().getFullYear()
    ) {
      dias += `<div class="dia hoje">${i}</div>`;
    } else {
      dias += `<div class="dia">${i}</div>`;
    }
  }

  // Dias do próximo mês
  for (let j = 1; j <= diasProximos; j++) {
    dias += `<div class="dia proximo">${j}</div>`;
  }

  esconderHojeBtn();
  esconderPrevBtn();
  daysContainer.innerHTML = dias;
}

renderizarCalendario();

nextBtn.addEventListener("click", () => {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  renderizarCalendario();
});

prevBtn.addEventListener("click", () => {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  renderizarCalendario();
});

hojeBtn.addEventListener("click", () => {
  mesAtual = data.getMonth();
  anoAtual = data.getFullYear();
  renderizarCalendario();
});

function esconderHojeBtn() {
  if (
    mesAtual === new Date().getMonth() &&
    anoAtual === new Date().getFullYear()
  ) {
    hojeBtn.style.display = "none";
  } else {
    hojeBtn.style.display = "flex";
  }
}

function esconderPrevBtn() {
  if (mesAtual === new Date().getMonth() && anoAtual === new Date().getFullYear()) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex"; 
  }
}
