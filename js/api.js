import { 
  POKE_API_BASE, POKEMON_LIMIT, 
  setIsLoading, setTotalPokemonCount, currentOffset, 
  setCurrentCards, addToCurrentCards
} from './config.js';
import { renderPagination } from './pagination.js';
import { createPokemonCard } from './cardRenderer.js';

export async function loadData() {
  setIsLoading(true);
  const grid = document.querySelector('.grid');
  const pagination = document.getElementById('pagination-container');
  grid.innerHTML = '<p style="text-align:center;">Loading...</p>';
  pagination.innerHTML = '';

  try {
    const res = await fetch(`${POKE_API_BASE}?limit=${POKEMON_LIMIT}&offset=${currentOffset}`);
    const data = await res.json();
    setTotalPokemonCount(data.count);
    setCurrentCards([]);

    grid.innerHTML = '';
    for (let i = 0; i < data.results.length; i++) {
      const poke = await fetch(data.results[i].url).then(r => r.json());
      createPokemonCard(poke);
      addToCurrentCards(poke);
    }
    renderPagination();
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<p style="text-align:center;color:red;">Failed to load data.</p>';
  } finally {
    setIsLoading(false);
  }
}

export async function fetchPokemonByType(type) {
  setIsLoading(true);
  const grid = document.querySelector('.grid');
  grid.innerHTML = '<p style="text-align:center;">Loading...</p>';
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await res.json();
    grid.innerHTML = '';
    setCurrentCards([]);
    for (let i = 0; i < Math.min(data.pokemon.length, 40); i++) {
      const poke = await fetch(data.pokemon[i].pokemon.url).then(r => r.json());
      createPokemonCard(poke);
      addToCurrentCards(poke);
    }
    return true;
  } catch (err) {
    grid.innerHTML = `<p style="text-align:center; color: red;">Failed to load type filter</p>`;
    return false;
  } finally {
    setIsLoading(false);
  }
}