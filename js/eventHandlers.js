import {
  setCurrentOffset, setIsSearchResultsView, setCurrentCards, addToCurrentCards
} from './config.js';
import { loadInitialData, loadMorePokemon, fetchPokemonByType } from './api.js';
import { createPokemonCard } from './cardRenderer.js';


function validateSearchInput() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const value = searchInput.value.trim();

  if (value.length >= 3) {
    searchBtn.disabled = false;
    searchBtn.title = 'Search for Pokemon';
  } else {
    searchBtn.disabled = true;
    searchBtn.title = 'Enter at least 3 characters';
  }
}


export async function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput || !searchInput.value.trim()) return;

  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm.length < 3) return;

  const grid = document.querySelector('.grid');
  grid.innerHTML = '<p style="text-align:center;">Searching...</p>';
  setIsSearchResultsView(true);
  setCurrentCards([]);

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
    if (response.ok) {
      const pokemon = await response.json();
      grid.innerHTML = '';
      createPokemonCard(pokemon);
      addToCurrentCards(pokemon);
    } else {
      grid.innerHTML = `<p style="text-align:center;color:orange;">No Pokemon found with name or ID "${searchTerm}"</p>`;
    }
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p style="text-align:center;color:red;">Failed to search. Try again.</p>`;
  }
}


export function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  if (searchInput) {
    searchInput.value = '';
  }
  if (searchBtn) {
    searchBtn.disabled = true;
    searchBtn.title = 'Enter at least 3 characters';
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
  // Search input - validate on input
  document.getElementById('searchInput')?.addEventListener('input', validateSearchInput);

  // Search input - Enter key to search
  document.getElementById('searchInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !document.getElementById('searchBtn').disabled) {
      handleSearch();
    }
  });

  // Search button
  document.getElementById('searchBtn')?.addEventListener('click', handleSearch);

  // Clear button
  document.getElementById('clearSearchBtn')?.addEventListener('click', clearSearch);

  // Type filter
  document.getElementById('typeFilter')?.addEventListener('change', handleTypeFilter);

  // Load More button
  document.getElementById('loadMoreBtn')?.addEventListener('click', loadMorePokemon);

  // Overlay click handler - closes expanded card
  document.getElementById('overlay')?.addEventListener('click', () => {
    const expandedCard = document.querySelector('.pokemon-card.expanded');
    if (expandedCard) {
      const closeBtn = expandedCard.querySelector('.close-button');
      if (closeBtn) closeBtn.click();
    }
  });

  // Scroll-to-Top button
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