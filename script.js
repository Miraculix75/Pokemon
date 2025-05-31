const POKE_API_BASE = "https://pokeapi.co/api/v2/pokemon";
const POKEMON_LIMIT = 20;
let currentOffset = 0;
let totalPokemonCount = 0;
let isLoading = false;
let isSearchResultsView = false;
let currentExpandedIndex = -1;
let currentCards = [];

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  document.getElementById('searchInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSearch();
  });

  document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    isSearchResultsView = false;
    currentOffset = 0;
    loadData();
  });

  document.getElementById('typeFilter')?.addEventListener('change', async (e) => {
    const type = e.target.value;
    if (!type) {
      loadData();
      return;
    }
    isLoading = true;
    const grid = document.querySelector('.grid');
    grid.innerHTML = '<p style="text-align:center;">Loading...</p>';
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await res.json();
      grid.innerHTML = '';
      currentCards = [];
      for (let i = 0; i < Math.min(data.pokemon.length, 40); i++) {
        const poke = await fetch(data.pokemon[i].pokemon.url).then(r => r.json());
        createPokemonCard(poke);
        currentCards.push(poke);
      }
    } catch (err) {
      grid.innerHTML = `<p style="text-align:center; color: red;">Failed to load type filter</p>`;
    } finally {
      isLoading = false;
    }
  });
});

async function loadData() {
  isLoading = true;
  const grid = document.querySelector('.grid');
  const pagination = document.getElementById('pagination-container');
  grid.innerHTML = '<p style="text-align:center;">Loading...</p>';
  pagination.innerHTML = '';

  try {
    const res = await fetch(`${POKE_API_BASE}?limit=${POKEMON_LIMIT}&offset=${currentOffset}`);
    const data = await res.json();
    totalPokemonCount = data.count;
    currentCards = [];

    grid.innerHTML = '';
    for (let i = 0; i < data.results.length; i++) {
      const poke = await fetch(data.results[i].url).then(r => r.json());
      createPokemonCard(poke);
      currentCards.push(poke);
    }
    renderPagination();
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<p style="text-align:center;color:red;">Failed to load data.</p>';
  } finally {
    isLoading = false;
  }
}

function renderPagination() {
  const container = document.getElementById('pagination-container');
  container.innerHTML = '';

  const totalPages = Math.ceil(totalPokemonCount / POKEMON_LIMIT);
  const currentPage = Math.floor(currentOffset / POKEMON_LIMIT) + 1;

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > 1) {
    const prevArrow = document.createElement('button');
    prevArrow.textContent = '«';
    prevArrow.addEventListener('click', () => {
      currentOffset = (start - 2) * POKEMON_LIMIT;
      loadData();
    });
    container.appendChild(prevArrow);
  }

  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentOffset = (i - 1) * POKEMON_LIMIT;
      loadData();
    });
    container.appendChild(btn);
  }

  if (end < totalPages) {
    const nextArrow = document.createElement('button');
    nextArrow.textContent = '»';
    nextArrow.addEventListener('click', () => {
      currentOffset = end * POKEMON_LIMIT;
      loadData();
    });
    container.appendChild(nextArrow);
  }
}

function setupTabFunctionality(container) {
  const tabButtons = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');
  
  // Initial den Stats-Tab aktivieren
  if (tabContents.length > 0) {
    tabContents[0].classList.add('active');
    if (tabButtons.length > 0) {
      tabButtons[0].classList.add('active');
    }
  }
  
  // Event-Handler für Tab-Klicks
  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Verhindert, dass der Klick die Karte schließt
      
      // Alle Tabs deaktivieren
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
      });
      
      // Angeklickten Tab aktivieren
      button.classList.add('active');
      const tabName = button.getAttribute('data-tab');
      const activeContent = container.querySelector(`.tab-content.tab-${tabName}`);
      
      if (activeContent) {
        activeContent.classList.add('active');
        activeContent.classList.remove('hidden');
      }
    });
  });
}

function createPokemonCard(pokemon) {
  const id = pokemon.id;
  const name = pokemon.name;
  const image = pokemon.sprites.other['official-artwork'].front_default;
  const type = pokemon.types[0].type.name;
  const hp = pokemon.stats[0].base_stat;
  const attack = pokemon.stats[1].base_stat;
  const defense = pokemon.stats[2].base_stat;
  const speed = pokemon.stats[5]?.base_stat ?? '—';
  const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');

  const container = document.createElement('div');
  container.className = `pokemon-card bg-${type}`;
  container.innerHTML = `
    <span class="pokemon-number">#${String(id).padStart(3, '0')}</span>
    <div class="pokemon-name">${name}</div>
    <div class="pokemon-image"><img src="${image}" alt="${name}"></div>

    <div class="tab-buttons hidden">
      <button class="tab-btn active" data-tab="stats">Stats</button>
      <button class="tab-btn" data-tab="moves">Moves</button>
      <button class="tab-btn" data-tab="shiny">Shiny</button>
    </div>

    <div class="tab-content tab-stats">
      <div class="pokemon-types">
        ${pokemon.types.map(t => `<span class="type type-${t.type.name}">${t.type.name}</span>`).join('')}
      </div>
      <div class="pokemon-stats">
        <p><strong>HP:</strong> ${hp}</p>
        <p><strong>Attack:</strong> ${attack}</p>
        <p><strong>Defense:</strong> ${defense}</p>
        <p><strong>Speed:</strong> ${speed}</p>
      </div>
      <div class="abilities"><strong>Abilities:</strong> ${abilities}</div>
    </div>

    <div class="tab-content tab-moves hidden">
      <ul>${pokemon.moves.slice(0, 10).map(m => `<li>${m.move.name}</li>`).join('')}</ul>
    </div>

    <div class="tab-content tab-shiny hidden">
      <img src="${pokemon.sprites.front_shiny}" alt="${name} shiny" style="width: 120px;">
      <img src="${pokemon.sprites.front_default}" alt="${name}" style="height: 200px; margin-top: 1rem;">
    </div>

    <div class="card-footer hidden">
      <div class="overlay-nav-buttons">
        <button class="prev-btn">←</button>
        <button class="next-btn">→</button>
      </div>
    </div>

    <div class="close-button">×</div>
  `;

  container.addEventListener('dblclick', () => {
    const isExpanded = container.classList.contains('expanded');
    
    // Schließe andere geöffnete Karten
    document.querySelectorAll('.pokemon-card.expanded').forEach(card => {
      if (card !== container) {
        card.classList.remove('expanded');
      }
    });
    
    // Toggle expanded Zustand der aktuellen Karte
    container.classList.toggle('expanded', !isExpanded);
    
    // WICHTIG: Setze den currentExpandedIndex, wenn die Karte expandiert wird
    if (!isExpanded) {
      // Finde den Index der aktuellen Karte
      const allCards = Array.from(document.querySelectorAll('.pokemon-card'));
      currentExpandedIndex = allCards.indexOf(container);
      
      // Footer und Buttons einblenden
      const footer = container.querySelector('.card-footer');
      if (footer) {
        footer.classList.remove('hidden');
      }
      document.body.classList.add('no-scroll');
    } else {
      // Wenn die Karte geschlossen wird
      currentExpandedIndex = -1;
      document.body.classList.remove('no-scroll');
      const footer = container.querySelector('.card-footer');
      if (footer) {
        footer.classList.add('hidden');
      }
    }
  });

  container.querySelector('.close-button').addEventListener('click', e => {
    e.stopPropagation();
    container.classList.remove('expanded');
    document.body.classList.remove('no-scroll');
    container.querySelector('.card-footer')?.classList.add('hidden');
    currentExpandedIndex = -1;
  });

  container.querySelector('.prev-btn').addEventListener('click', e => {
    e.stopPropagation();
    navigateOverlay(-1);
  });

  container.querySelector('.next-btn').addEventListener('click', e => {
    e.stopPropagation();
    navigateOverlay(1);
  });

  // Tab-Funktionalität aktivieren
  setupTabFunctionality(container);

  document.querySelector('.grid').appendChild(container);
}

function navigateOverlay(direction) {
  if (currentExpandedIndex === -1) return;
  const cards = document.querySelectorAll('.pokemon-card');
  
  // Schließe aktuelle Karte ohne bg-Klassen zu entfernen
  cards[currentExpandedIndex].classList.remove('expanded');

  currentExpandedIndex += direction;
  if (currentExpandedIndex < 0) currentExpandedIndex = cards.length - 1;
  if (currentExpandedIndex >= cards.length) currentExpandedIndex = 0;

  const newCard = cards[currentExpandedIndex];
  
  // Neue Karte expandieren ohne ihre bg-Klasse zu ändern
  newCard.classList.add('expanded');
  
  document.body.classList.add('no-scroll');
  newCard.querySelector('.card-footer')?.classList.remove('hidden');
}
