import {
  POKE_API_BASE, POKEMON_LIMIT,
  setIsLoading, currentOffset, setCurrentOffset,
  setCurrentCards, addToCurrentCards
} from './config.js';
import { createPokemonCard } from './cardRenderer.js';

let totalCount = 0;

export function setTotalCount(count) {
  totalCount = count;
}

export function getTotalCount() {
  return totalCount;
}

// Initiale Daten laden (erste 20 Pokemon)
export async function loadInitialData() {
  setIsLoading(true);
  const grid = document.querySelector('.grid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  grid.innerHTML = '<p style="text-align:center;">Loading...</p>';
  if (loadMoreBtn) loadMoreBtn.disabled = true;

  try {
    const res = await fetch(`${POKE_API_BASE}?limit=${POKEMON_LIMIT}&offset=0`);
    const data = await res.json();
    setTotalCount(data.count);
    setCurrentOffset(0);
    setCurrentCards([]);

    grid.innerHTML = '';
    for (let i = 0; i < data.results.length; i++) {
      const poke = await fetch(data.results[i].url).then(r => r.json());
      createPokemonCard(poke);
      addToCurrentCards(poke);
    }

    if (loadMoreBtn) loadMoreBtn.disabled = false;
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<p style="text-align:center;color:red;">Failed to load data.</p>';
  } finally {
    setIsLoading(false);
  }
}

// Weitere Pokemon laden (Load More)
export async function loadMorePokemon() {
  setIsLoading(true);
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';
  }

  try {
    const newOffset = currentOffset + POKEMON_LIMIT;
    const res = await fetch(`${POKE_API_BASE}?limit=${POKEMON_LIMIT}&offset=${newOffset}`);
    const data = await res.json();

    setCurrentOffset(newOffset);

    for (let i = 0; i < data.results.length; i++) {
      const poke = await fetch(data.results[i].url).then(r => r.json());
      createPokemonCard(poke);
      addToCurrentCards(poke);
    }

    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Load More Pokemon';
    }
  } catch (e) {
    console.error(e);
    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Load More Pokemon';
    }
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

// Holt eine Liste voll geladener Pokémon (Details) parallel
export async function fetchPokemonList(offset = 0, limit = 20) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  const data = await response.json();
  setTotalCount(data.count); // Hinzugefügt: Setzt die Gesamtanzahl der Pokémon

  // Alle Detaildaten parallel laden
  const detailedPokemons = await Promise.all(
    data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
  );

  return detailedPokemons; // Array mit allen geladenen Pokémon
}

// Lädt ein Batch Pokémon (direkt vollgeladen)
export async function loadPokemonBatch(offset, limit) {
  return await fetchPokemonList(offset, limit);
}