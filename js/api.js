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


function setButtonState(disabled, text = null) {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.disabled = disabled;
    if (text) loadMoreBtn.textContent = text;
  }
}


function showLoadingMessage() {
  const grid = document.querySelector('.grid');
  grid.innerHTML = '<p style="text-align:center;">Loading...</p>';
}


async function fetchPokemonData(offset) {
  const res = await fetch(`${POKE_API_BASE}?limit=${POKEMON_LIMIT}&offset=${offset}`);
  return await res.json();
}


async function loadPokemonDetails(results) {
  for (let i = 0; i < results.length; i++) {
    const poke = await fetch(results[i].url).then(r => r.json());
    createPokemonCard(poke);
    addToCurrentCards(poke);
  }
}


export async function loadInitialData() {
  setIsLoading(true);
  const grid = document.querySelector('.grid');
  showLoadingMessage();
  setButtonState(true);
  try {
    const data = await fetchPokemonData(0);
    setTotalCount(data.count);
    setCurrentOffset(0);
    setCurrentCards([]);
    grid.innerHTML = '';
    await loadPokemonDetails(data.results);
    setButtonState(false);
  } catch (e) {
    handleLoadError(grid, e);
  } finally {
    setIsLoading(false);
  }
}


export async function loadMorePokemon() {
  setIsLoading(true);
  setButtonState(true, 'Loading...');
  try {
    const newOffset = currentOffset + POKEMON_LIMIT;
    const data = await fetchPokemonData(newOffset);
    setCurrentOffset(newOffset);
    await loadPokemonDetails(data.results);
    setButtonState(false, 'Load More Pokemon');
  } catch (e) {
    console.error(e);
    setButtonState(false, 'Load More Pokemon');
  } finally {
    setIsLoading(false);
  }
}


export async function fetchPokemonByType(type) {
  setIsLoading(true);
  const grid = document.querySelector('.grid');
  showLoadingMessage();
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await res.json();
    grid.innerHTML = '';
    setCurrentCards([]);
    await loadTypeFilteredPokemon(data.pokemon);
    return true;
  } catch (err) {
    handleTypeFilterError(grid);
    return false;
  } finally {
    setIsLoading(false);
  }
}


async function loadTypeFilteredPokemon(pokemonList) {
  for (let i = 0; i < Math.min(pokemonList.length, 40); i++) {
    const poke = await fetch(pokemonList[i].pokemon.url).then(r => r.json());
    createPokemonCard(poke);
    addToCurrentCards(poke);
  }
}


function handleLoadError(grid, error) {
  console.error(error);
  grid.innerHTML = '<p style="text-align:center;color:red;">Failed to load data.</p>';
}


function handleTypeFilterError(grid) {
  grid.innerHTML = '<p style="text-align:center; color: red;">Failed to load type filter</p>';
}


export async function fetchPokemonList(offset = 0, limit = 20) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  const data = await response.json();
  setTotalCount(data.count);
  const detailedPokemons = await Promise.all(
    data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
  );
  return detailedPokemons;
}


export async function loadPokemonBatch(offset, limit) {
  return await fetchPokemonList(offset, limit);
}
