import { 
  setCurrentOffset, setIsSearchResultsView 
} from './config.js';
import { loadData, fetchPokemonByType } from './api.js';

export function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput || !searchInput.value.trim()) return;
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  // Implementierung der Suchfunktion hier
  console.log(`Searching for: ${searchTerm}`);
  
  // Hier würde man normalerweise eine Suche mit dem searchTerm durchführen
  // und die Ergebnisse anzeigen
}

export function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
  }
  setIsSearchResultsView(false);
  setCurrentOffset(0);
  loadData();
}

export async function handleTypeFilter(e) {
  const type = e.target.value;
  if (!type) {
    loadData();
    return;
  }
  await fetchPokemonByType(type);
}

export function setupEventListeners() {
  // Suche
  document.getElementById('searchInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSearch();
  });

  // Clear-Button
  document.getElementById('clearSearchBtn')?.addEventListener('click', clearSearch);

  // Typ-Filter
  document.getElementById('typeFilter')?.addEventListener('change', handleTypeFilter);
}