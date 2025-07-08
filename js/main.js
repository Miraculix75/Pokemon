import { loadData, getTotalCount } from './api.js';
import { setupEventListeners } from './eventHandlers.js';
import { renderPagination } from './pagination.js';
import { POKEMON_LIMIT, currentOffset, setCurrentOffset } from './config.js';

// Seitenwechsel-Funktion
function handlePageChange(newOffset) {
  setCurrentOffset(newOffset);
  loadAndRender(); // Neue Pokémon laden
}

// Pokémon + Pagination laden
async function loadAndRender() {
  await loadData(); // Daten abholen

  const total = getTotalCount(); // Anzahl der Pokémon
  if (total > 0) {
    renderPagination(total, currentOffset, POKEMON_LIMIT, handlePageChange);
  } else {
    console.warn('⚠️ Total count is 0 – Pagination wird nicht angezeigt.');
  }
}

// App starten
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadAndRender();
});