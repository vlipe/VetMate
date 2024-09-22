// Funções para manipular os modais
function abrirModalCadastro() {
    document.getElementById('medicamentos-modal-cadastro').style.display = 'block';
}

function fecharModalCadastro() {
    document.getElementById('medicamentos-modal-cadastro').style.display = 'none';
}

function abrirModalNotificacoes(notificacoes) {
    const tabelaNotificacoes = document.getElementById('medicamentos-tabela-notificacoes');
    tabelaNotificacoes.innerHTML = ''; // Limpa a tabela antes de adicionar novas notificações

    // Cria o cabeçalho da tabela
    const headerRow = tabelaNotificacoes.insertRow();
    const doseHeader = headerRow.insertCell();
    const horarioHeader = headerRow.insertCell();
    doseHeader.textContent = "Dose";
    horarioHeader.textContent = "Horário";

    notificacoes.forEach((notificacao, index) => {
        const row = tabelaNotificacoes.insertRow();
        const doseCell = row.insertCell();
        const horarioCell = row.insertCell();
        doseCell.textContent = `${index + 1}ª Dose`;
        horarioCell.textContent = notificacao;
    });

    document.getElementById('medicamentos-modal-notificacoes').style.display = 'block';
}

function fecharModalNotificacoes() {
    document.getElementById('medicamentos-modal-notificacoes').style.display = 'none';
}

// Função para calcular os horários das notificações
function calcularHorariosNotificacoes(horarioInicial, quantidade) {
    const horarios = [];
    const intervalo = 24 / quantidade; // Intervalo em horas entre as notificações

    let horaAtual = new Date('1970-01-01T' + horarioInicial);

    for (let i = 0; i < quantidade; i++) {
        horarios.push(horaAtual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        horaAtual.setHours(horaAtual.getHours() + intervalo);
    }

    return horarios;
}

// Função para criar um card de medicamento
function criarCardMedicamento(medicamento, index) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Adicione a imagem se existir
    if (medicamento.imagem) {
        const img = document.createElement('img');
        img.src = medicamento.imagem;
        card.appendChild(img);
    }

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const h3 = document.createElement('h3');
    h3.textContent = medicamento.nome;
    cardInfo.appendChild(h3);

    const pConcentracao = document.createElement('p');
    pConcentracao.textContent = `Concentração: ${medicamento.dosagem}`;
    cardInfo.appendChild(pConcentracao);

    const pQuantidade = document.createElement('p');
    pQuantidade.textContent = `Doses Diárias: ${medicamento.quantidade}`;
    cardInfo.appendChild(pQuantidade);

    const pHorario = document.createElement('p');
    pHorario.textContent = `Primeira Dose às: ${medicamento.horario}`;
    cardInfo.appendChild(pHorario);

    // Container para os botões
    const botoesContainer = document.createElement('div');
    botoesContainer.classList.add('botoes-container');

    // Botão Doses
    const botaoDoses = document.createElement('button');
    botaoDoses.textContent = 'Doses';
    botaoDoses.classList.add('medicamentos-botao-doses');
    botaoDoses.addEventListener('click', () => {
        const notificacoes = calcularHorariosNotificacoes(medicamento.horario, medicamento.quantidade);
        abrirModalNotificacoes(notificacoes);
    });
    botoesContainer.appendChild(botaoDoses);

    // Botão Excluir
    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.classList.add('medicamentos-botao-excluir');
    botaoExcluir.addEventListener('click', (event) => {
        event.stopPropagation();
        excluirMedicamento(index);
    });
    botoesContainer.appendChild(botaoExcluir);

    cardInfo.appendChild(botoesContainer);

    card.appendChild(cardInfo);

    return card;
}

// Função para carregar os medicamentos do LocalStorage
function carregarMedicamentos() {
    const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    const cardsContainer = document.getElementById('medicamentos-cards-container');
    const semMedicamentos = document.getElementById('medicamentos-sem-medicamentos');

    cardsContainer.innerHTML = '';

    if (medicamentos.length > 0) {
        semMedicamentos.style.display = 'none';

        medicamentos.forEach((medicamento, index) => {
            const card = criarCardMedicamento(medicamento, index);
            cardsContainer.appendChild(card);
        });
    } else {
        semMedicamentos.style.display = 'block';
    }
}

// Função para salvar um novo medicamento no LocalStorage
function salvarMedicamento(medicamento) {
    const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    medicamentos.push(medicamento);
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
}

// Função para excluir um medicamento
function excluirMedicamento(index) {
    const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    medicamentos.splice(index, 1);
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    carregarMedicamentos();
}

// Função para agendar as notificações
function agendarNotificacoes(notificacoes, medicamento) {
    // Verifica se o navegador suporta notificações
    if (!("Notification" in window)) {
        alert("Este navegador não suporta notificações de desktop.");
        return;
    }

    // Solicita permissão para enviar notificações (se ainda não tiver sido concedida)
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    notificacoes.forEach((notificacao, index) => {
        const agora = new Date();
        const [hora, minuto] = notificacao.split(':');
        const horarioNotificacao = new Date();
        horarioNotificacao.setHours(hora, minuto, 0, 0); // Define o horário da notificação na data atual

        // Calcula o tempo em milissegundos até a próxima notificação (considerando o dia atual)
        let tempoAteNotificacao = horarioNotificacao - agora;

        // Se a notificação já passou hoje, agenda para amanhã
        if (tempoAteNotificacao < 0) {
            tempoAteNotificacao += 24 * 60 * 60 * 1000; // Adiciona 24 horas
        }

        // Agenda a notificação (usando setTimeout para cada notificação individual)
        setTimeout(() => {
            // Verifica novamente a permissão antes de enviar a notificação
            if (Notification.permission === "granted") {
                const notificacao = new Notification('Hora do Medicamento!', {
                    body: 'VetMate: ' + medicamento.nome + ' (' + medicamento.dosagem + ')', // Concatenação de strings
                    // icon: medicamento.imagem // Opcional: usar a imagem do medicamento como ícone
                });
            }
        }, tempoAteNotificacao);
    });
}

// Adiciona um ouvinte de evento ao formulário de cadastro
document.getElementById('medicamentos-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('medicamentos-nome').value;
    const dosagem = document.getElementById('medicamentos-dosagem').value;
    const quantidade = parseInt(document.getElementById('medicamentos-quantidade').value);
    const horario = document.getElementById('medicamentos-horario').value;

    const imagemInput = document.getElementById('medicamentos-imagem');
    let imagemDataURL = null;

    if (imagemInput.files && imagemInput.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
            imagemDataURL = e.target.result;

            const novoMedicamento = {
                nome: nome,
                imagem: imagemDataURL,
                dosagem: dosagem,
                quantidade: quantidade,
                horario: horario
            };

            salvarMedicamento(novoMedicamento);
            carregarMedicamentos();
            fecharModalCadastro();

            const notificacoes = calcularHorariosNotificacoes(horario, quantidade);
            agendarNotificacoes(notificacoes, novoMedicamento);
        };

        reader.readAsDataURL(imagemInput.files[0]);
    } else {
        const novoMedicamento = {
            nome: nome,
            dosagem: dosagem,
            quantidade: quantidade,
            horario: horario
        };

        salvarMedicamento(novoMedicamento);
        carregarMedicamentos();
        fecharModalCadastro();

        const notificacoes = calcularHorariosNotificacoes(horario, quantidade);
        agendarNotificacoes(notificacoes, novoMedicamento);
    }
});

// Carrega os medicamentos ao iniciar a página
carregarMedicamentos();

// Adiciona um ouvinte de evento ao botão de cadastro para abrir o modal
document.getElementById('medicamentos-botao-cadastrar').addEventListener('click', () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                abrirModalCadastro();
            } else {
                alert('Você precisa permitir as notificações nas configurações do seu navegador para receber os lembretes.');
            }
        });
    } else {
        abrirModalCadastro();
    }
});