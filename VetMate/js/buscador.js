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
"Medicina de Répteis e Anfíbios",
"Medicina Felina",
"Medicina de Animais Silvestres",
"Medicina de Equinos",
"Medicina de Bovinos",
"Medicina de Suínos",
"Medicina de Ovinos e Caprinos",
"Nutrição Animal",
"Acupuntura Veterinária",
"Fisioterapia Veterinária",
"Homeopatia Veterinária",
"Terapia Floral Veterinária",
"Ozonioterapia Veterinária",
"Medicina Tradicional Chinesa Veterinária",
"Emergência e Cuidados Críticos Veterinários",
"Medicina Preventiva Veterinária",
"Medicina de Abrigo",
"Medicina Veterinária Legal",
"Epidemiologia Veterinária",
"Saúde Pública Veterinária",
"Inspeção de Produtos de Origem Animal",
"Tecnologia de Alimentos de Origem Animal",
"Bem-estar Animal",
"Ética Veterinária",
"Gestão de Clínicas e Hospitais Veterinários",
"Marketing Veterinário",
"Comunicação Veterinária",
"Educação Continuada Veterinária",
"Pesquisa Veterinária",
"Genética Animal",
"Biotecnologia Animal",
"Farmacologia Veterinária",
"Toxicologia Veterinária",
"Parasitologia Veterinária",
"Microbiologia Veterinária",
"Imunologia Veterinária",
"Virologia Veterinária",
"Micologia Veterinária",
"Bacteriologia Veterinária",
"Hematologia Veterinária",
"Bioquímica Clínica Veterinária",
"Citologia Veterinária",
"Histopatologia Veterinária",
"Anatomia Patológica Veterinária",
"Medicina Veterinária Integrativa",
"Medicina Veterinária Holística",
"Odontologia Equina",
"Cardiologia Equina",
"Ortopedia Equina",
"Oftalmologia Equina",
"Reprodução Equina",
"Medicina Esportiva Equina",
"Podologia Equina",
"Nutrição Equina",
"Anestesiologia Equina",
"Cirurgia de Grandes Animais",
"Reprodução de Bovinos",
"Nutrição de Bovinos",
"Manejo Sanitário de Bovinos",
"Produção de Leite",
"Produção de Carne",
"Medicina de Animais de Laboratório",
"Medicina de Animais Aquáticos",
"Apicultura",
"Aqüicultura",
"Conservação da Fauna",
"Manejo de Animais Selvagens",
"Reabilitação de Animais Selvagens",
"Zootecnia",
"Tecnologia de Produção Animal",
"Melhoramento Genético Animal",
"Nutrigenômica Animal",
"Proteômica Animal",
"Bioinformática Veterinária",
"Nanotecnologia Veterinária",
"Inteligência Artificial Veterinária",
"Telemedicina Veterinária"
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