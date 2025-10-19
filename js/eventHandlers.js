import {
  setCurrentOffset, setIsSearchResultsView
} from './config.js';
import { loadInitialData, loadMorePokemon, fetchPokemonByType } from './api.js';

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
  loadInitialData();
}

export async function handleTypeFilter(e) {
  const type = e.target.value;
  if (!type) {
    loadInitialData();
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

  // Load More Button
  document.getElementById('loadMoreBtn')?.addEventListener('click', loadMorePokemon);

  // Overlay Click Handler - schließt die erweiterte Karte
  document.getElementById('overlay')?.addEventListener('click', () => {
    const expandedCard = document.querySelector('.pokemon-card.expanded');
    if (expandedCard) {
      // Trigger close button click
      const closeBtn = expandedCard.querySelector('.close-button');
      if (closeBtn) closeBtn.click();
    }
  });

  // Scroll-to-Top Button
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}