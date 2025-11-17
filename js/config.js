export const POKE_API_BASE = "https://pokeapi.co/api/v2/pokemon";
export const POKEMON_LIMIT = 20;

// Gemeinsame Zustandsvariablen
export let currentOffset = 0;
export let totalPokemonCount = 0;
export let isLoading = false;
export let isSearchResultsView = false;
export let currentExpandedIndex = -1;
export let currentExpandedPokemonId = null;
export let currentCards = [];

// Zustandssetter-Funktionen
export function setCurrentOffset(value) {
  currentOffset = value;
}

export function setTotalPokemonCount(value) {
  totalPokemonCount = value;
}

export function setIsLoading(value) {
  isLoading = value;
}

export function setIsSearchResultsView(value) {
  isSearchResultsView = value;
}

export function setCurrentExpandedIndex(value) {
  currentExpandedIndex = value;
}

export function setCurrentExpandedPokemonId(value) {
  currentExpandedPokemonId = value;
}

export function setCurrentCards(cards) {
  currentCards = cards;
}

export function addToCurrentCards(card) {
  currentCards.push(card);
}