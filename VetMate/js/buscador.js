const searchInput = document.getElementById('searchInput');
const resultList = document.getElementById('resultList');

const specialties = [
    "Clínica Médica de Pequenos Animais",
    "Cardiologia Veterinária",
    "Oftalmologia Veterinária",
    "Odontologia Veterinária",
    "Neurologia Veterinária",
    "Dermatologia Veterinária",
    "Oncologia Veterinária",
    "Endocrinologia Veterinária",
    "Gastroenterologia Veterinária",
    "Cirurgia Geral de Pequenos Animais",
    "Ortopedia Veterinária",
    "Oftalmologia Cirúrgica",
    "Neurocirurgia Veterinária",
    "Anestesiologia Veterinária",
    "Patologia Veterinária",
    "Radiologia Veterinária",
    "Reprodução Animal",
    "Comportamento Animal",
    "Medicina de Aves",
    "Medicina de Répteis e Anfíbios"
];

function filterResults() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredResults = specialties.filter(specialty =>
    specialty.toLowerCase().includes(searchTerm)
  );

  // Limita os resultados a 5
  const limitedResults = filteredResults.slice(0, 5);

  // Cria um HTML para cada resultado e adiciona à lista
  resultList.innerHTML = limitedResults.map(specialty => `<li>${specialty}</li>`).join('');

  // Adiciona um evento de clique para cada item da lista
  resultList.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.textContent;
      resultList.innerHTML = ''; // Limpa a lista após a seleção
    });
  });
}

searchInput.addEventListener('input', filterResults);

// Selecionar o slider e o parágrafo
const slider = document.getElementById('myRange');
const valor = document.querySelector('.slider-distancia-valores');

// Adicionar um event listener ao slider
slider.addEventListener('input', () => {
    // Atualizar o valor do parágrafo com o novo valor do slider
    valor.textContent = slider.value + 'km';
});

const sliderMin = document.querySelector('.min.input-ranges');
const sliderMax = document.querySelector('.max.input-ranges');
const firstValue = document.getElementById('first');
const secondValue = document.getElementById('second');
const thirdValue = document.getElementById('third');

// Função para atualizar os valores
function updateValues() {
  // Limitar o valor mínimo
  if (sliderMin.value > 5000) {
    sliderMin.value = 5000;
  }

  // Limitar o valor máximo
  if (sliderMax.value < 5000) {
    sliderMax.value = 5000;
  }

  firstValue.textContent = sliderMin.value;
  secondValue.textContent = sliderMax.value;
  thirdValue.textContent = sliderMax.value - sliderMin.value;
}

// Adicionar event listeners aos sliders
sliderMin.addEventListener('input', updateValues);
sliderMax.addEventListener('input', updateValues);

// Chamar a função inicialmente para setar os valores corretos
updateValues();