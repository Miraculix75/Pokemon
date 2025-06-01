import { loadData } from './api.js';
import { setupEventListeners } from './eventHandlers.js';

// App initialisieren
document.addEventListener('DOMContentLoaded', () => {
  // Event-Listener einrichten
  setupEventListeners();
  
  // Initialen Daten laden
  loadData();
});