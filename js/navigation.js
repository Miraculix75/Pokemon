import { currentExpandedIndex, setCurrentExpandedIndex } from './config.js';
import { resetTabsToStats } from './tabSystem.js';

// Exportiere die originalPositions Map, damit sie von cardRenderer.js verwendet werden kann
export const originalPositions = new Map();

export function navigateOverlay(direction) {
  if (currentExpandedIndex === -1) return;
  
  // Aktuelle erweiterte Karte direkt finden (zuverlässiger)
  const currentCard = document.querySelector('.pokemon-card.expanded');
  if (!currentCard) return;
  
  // Overlay-Zustand speichern
  const overlay = document.querySelector('#overlay');
  const isOverlayActive = overlay?.classList.contains('active');
  
  // Aktuelle Karte vorbereiten zum Schließen
  resetTabsToStats(currentCard);
  currentCard.classList.remove('expanded');
  currentCard.querySelector('.card-footer')?.classList.add('hidden');
  
  // Aktuelle Karte zurück ins Grid setzen
  restoreCardPosition(currentCard);
  
  // WICHTIG: Karten erst NACH DOM-Änderungen neu abfragen
  // um die aktuelle DOM-Struktur zu verwenden
  const cards = Array.from(document.querySelectorAll('.pokemon-card'));
  
  // Alle originalen Positionen zurücksetzen, um Konsistenz zu gewährleisten
  originalPositions.clear();
  
  // Nächsten Index berechnen
  let newIndex = direction > 0 ? 0 : cards.length - 1;
  if (currentExpandedIndex >= 0 && currentExpandedIndex < cards.length) {
    newIndex = currentExpandedIndex + direction;
    if (newIndex < 0) newIndex = cards.length - 1;
    if (newIndex >= cards.length) newIndex = 0;
  }
  
  // Neue Karte referenzieren mit frischer Abfrage
  const newCard = cards[newIndex];
  if (!newCard) return;
  
  // Position der neuen Karte speichern
  originalPositions.set(newCard, {
    parent: newCard.parentNode,
    nextSibling: newCard.nextSibling
  });
  
  // Mit verzögerung fortsetzen für DOM-Stabilität
  setTimeout(() => {
    try {
      // Neue Karte zum Body verschieben
      document.body.appendChild(newCard);
      
      // Expanded-Zustand aktivieren
      newCard.classList.add('expanded');
      newCard.querySelector('.card-footer')?.classList.remove('hidden');
      
      // Overlay konsistent halten
      if (overlay && isOverlayActive) overlay.classList.add('active');
      
      // Scroll-Status konsistent halten
      document.body.classList.add('no-scroll');
      
      // Index aktualisieren
      setCurrentExpandedIndex(newIndex);
    } catch (error) {
      console.error('Fehler beim Navigieren:', error);
      // Fallback: Alle Karten zurücksetzen
      document.querySelectorAll('.pokemon-card.expanded').forEach(card => {
        card.classList.remove('expanded');
        restoreCardPosition(card);
      });
    }
  }, 50);
}

// Neue Funktion zum Zurücksetzen der Karte an ihre ursprüngliche Position
export function restoreCardPosition(card) {
  if (originalPositions.has(card)) {
    const { parent, nextSibling } = originalPositions.get(card);
    
    // Prüfe, ob der Parent noch im DOM ist
    if (document.body.contains(parent)) {
      parent.insertBefore(card, nextSibling);
      return; // Erfolgreich eingefügt
    }
  }
  
  // Fallback: Wenn keine gültige Position gespeichert wurde, füge zur Grid hinzu
  const grid = document.querySelector('.grid');
  if (grid && !grid.contains(card)) {
    grid.appendChild(card);
  }
}