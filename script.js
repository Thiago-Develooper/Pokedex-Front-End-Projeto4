// Função para obter os dados dos primeiros 9 Pokémon
function getFirstNinePokemons() {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=150';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const pokemonList = data.results;
      const cardContainer = document.querySelector('.container.d-flex.justify-content-center.flex-wrap');
      cardContainer.innerHTML = ''; // Limpar o conteúdo do contêiner

      const promises = pokemonList.map((pokemon, index) => fetchPokemonData(pokemon, index));

      Promise.all(promises)
        .then(pokemonDataList => {
          pokemonDataList.sort((a, b) => a.index - b.index); // Ordenar pelo índice em ordem crescente
          pokemonDataList.forEach(pokemonData => {
            const pokemonCard = createPokemonCard(pokemonData);
            cardContainer.appendChild(pokemonCard);
          });
        })
        .catch(error => {
          console.log('Ocorreu um erro ao obter os dados dos Pokémon:', error);
        });
    })
    .catch(error => {
      console.log('Ocorreu um erro ao obter a lista de Pokémon:', error);
    });
}

// Função para obter os dados de um Pokémon individual
function fetchPokemonData(pokemon, index) {
  const pokemonUrl = pokemon.url;

  return fetch(pokemonUrl)
    .then(response => response.json())
    .then(data => {
      const pokemonData = {
        index: index + 1,
        name: data.name,
        image: data.sprites.front_default,
        type: data.types[0].type.name
      };
      return pokemonData;
    })
    .catch(error => {
      console.log('Ocorreu um erro ao obter os dados do Pokémon:', error);
    });
}

// Função para criar o elemento HTML do card do Pokémon
function createPokemonCard(pokemonData) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style = 'width: 18rem; background-color: #FDDFDF;';

  const image = document.createElement('img');
  image.className = 'card-img-top';
  image.src = pokemonData.image;
  image.alt = 'Pokemon Image';
  image.style = 'border-radius: 100%;';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = pokemonData.name;

  const type = document.createElement('div');
  type.className = 'container d-flex justify-content-between';

  const link = document.createElement('a');
  link.href = 'single.html';
  link.className = 'btn btn-primary';
  link.style = 'color: white; background-color: red;';
  link.textContent = pokemonData.type;

  type.appendChild(link);

  cardBody.appendChild(title);
  cardBody.appendChild(type);

  card.appendChild(image);
  card.appendChild(cardBody);

  // Adiciona um evento de clique ao card
  card.addEventListener('click', function() {
    redirectToSinglePage(pokemonData);
  });

  return card;
}

// Função para redirecionar para a página "single.html" com os dados do Pokémon selecionado
function redirectToSinglePage(pokemonData) {
  const url = `single.html?id=${pokemonData.index}&image=${encodeURIComponent(pokemonData.image)}`;
  window.location.href = url;
}

// Função para obter os dados de um único Pokémon
function getSinglePokemonData() {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get('id');
  const pokemonImage = urlParams.get('image');

  if (pokemonId && pokemonImage) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const pokemonImageElement = document.querySelector('#pokemonImage');
        pokemonImageElement.src = pokemonImage;

        const pokemonNameElement = document.querySelector('#pokemonName');
        pokemonNameElement.textContent = data.name;

        const pokemonNumberValueElement = document.querySelector('#pokemonNumberValue');
        pokemonNumberValueElement.textContent = pokemonId;

        const pokemonHeightValueElement = document.querySelector('#pokemonHeightValue');
        pokemonHeightValueElement.textContent = data.height;

        const pokemonWeightValueElement = document.querySelector('#pokemonWeightValue');
        pokemonWeightValueElement.textContent = data.weight;

        const pokemonSpeciesValueElement = document.querySelector('#pokemonSpeciesValue');
        pokemonSpeciesValueElement.textContent = data.species.name;

        const pokemonTypesValueElement = document.querySelector('#pokemonTypesValue');
        pokemonTypesValueElement.textContent = data.types.map(type => type.type.name).join(', ');

        const abilities = data.abilities.map(ability => ability.ability.name);
        const abilitiesContainer = document.querySelector('.movimentos');
        abilitiesContainer.innerHTML = ''; // Limpar o conteúdo do contêiner

        const abilitiesHeading = document.createElement('h3');
        abilitiesHeading.textContent = 'Habilidades';
        abilitiesContainer.appendChild(abilitiesHeading);

        const abilitiesList = document.createElement('ul');
        abilitiesList.classList.add('list-group');
        abilitiesList.classList.add('mt-4');
        abilitiesContainer.appendChild(abilitiesList);

        abilities.forEach(ability => {
          const abilityItem = document.createElement('li');
          abilityItem.classList.add('list-group-item');
          abilityItem.textContent = ability;
          abilitiesList.appendChild(abilityItem);
        });

        // Obter as evoluções do Pokémon
        getEvolutionChain(pokemonId);
      })
      .catch(error => {
        console.log('Ocorreu um erro ao obter os dados do Pokémon:', error);
      });
  }
}

// Função para obter a cadeia de evolução do Pokémon
// Função para exibir a cadeia de evolução na página
function displayEvolutionChain(evolutionChain) {
  const evolucoesContainer = document.querySelector('.evolucoes');
  evolucoesContainer.innerHTML = '';

  const evolucoesHeading = document.createElement('h3');
  evolucoesHeading.textContent = 'Evoluções';
  evolucoesContainer.appendChild(evolucoesHeading);

  const evolucoesList = document.createElement('div');
  evolucoesList.classList.add('list-e', 'd-flex', 'justify-content-evenly', 'mt-3');

  evolucoesContainer.appendChild(evolucoesList);

  evolutionChain.forEach(evolution => {
    const evolutionCard = createEvolutionCard(evolution);
    evolucoesList.appendChild(evolutionCard);
  });
}

// Função para criar o elemento HTML do card de evolução
function createEvolutionCard(evolution) {
  const card = document.createElement('div');
  card.className = 'card';

  const image = document.createElement('img');
  image.className = 'card-img-top';
  image.src = evolution.image;
  image.alt = 'Pokemon Evolution';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = evolution.name;

  cardBody.appendChild(title);

  card.appendChild(image);
  card.appendChild(cardBody);

  return card;
}

// Função para obter a cadeia de evolução do Pokémon
function getEvolutionChain(pokemonId) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const evolutionChainUrl = data.evolution_chain.url;
      return fetch(evolutionChainUrl);
    })
    .then(response => response.json())
    .then(data => {
      const evolutionChain = parseEvolutionChain(data);
      displayEvolutionChain(evolutionChain);
    })
    .catch(error => {
      console.log('Ocorreu um erro ao obter a cadeia de evolução do Pokémon:', error);
    });
}


// Função para analisar a cadeia de evolução e obter os nomes e imagens das evoluções
function parseEvolutionChain(data) {
  const evolutionChain = [];
  const evolutionData = data.chain;

  parseEvolutionData(evolutionData, evolutionChain);

  return evolutionChain;
}

// Função auxiliar para analisar os dados de evolução e obter as informações necessárias
function parseEvolutionData(data, evolutionChain) {
  const speciesName = data.species.name;
  const speciesUrl = data.species.url;

  const speciesId = getPokemonIdFromURL(speciesUrl);
  const speciesImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`;

  evolutionChain.push({
    name: speciesName,
    image: speciesImage
  });

  if (data.evolves_to.length > 0) {
    const nextEvolutionData = data.evolves_to[0];
    parseEvolutionData(nextEvolutionData, evolutionChain);
  }
}

function getPokemonIdFromURL(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 2];
}

// Resto do código...


// Exibir as habilidades de ataque e defesa do Pokémon na seção "Movimentos"
// Chamada da função para obter os dados do Pokémon selecionado
getSinglePokemonData();

// Chamada da função para exibir os primeiros 9 Pokémon
getFirstNinePokemons();

// Exibir as habilidades de ataque e defesa do Pokémon na seção "Movimentos"

