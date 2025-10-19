import { loadInitialData } from './api.js';
import { setupEventListeners } from './eventHandlers.js';

// App starten
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadInitialData();
});