import { currentExpandedIndex, setCurrentExpandedIndex } from './config.js';
import { resetTabsToStats } from './tabSystem.js';

export function navigateOverlay(direction) {
  if (currentExpandedIndex === -1) return;
  const cards = document.querySelectorAll('.pokemon-card');
  
  // Reset tabs to stats for the card being closed
  resetTabsToStats(cards[currentExpandedIndex]);
  
  // Schließe aktuelle Karte und verstecke deren Footer
  cards[currentExpandedIndex].classList.remove('expanded');
  cards[currentExpandedIndex].querySelector('.card-footer')?.classList.add('hidden');
  
  // Wichtig: Stelle sicher, dass alle anderen Karten ebenfalls geschlossen sind
  // und deren Footers versteckt sind
  document.querySelectorAll('.pokemon-card').forEach(card => {
    if (!card.isSameNode(cards[currentExpandedIndex])) {
      card.classList.remove('expanded');
      card.querySelector('.card-footer')?.classList.add('hidden');
    }
  });

  let newIndex = currentExpandedIndex + direction;
  if (newIndex < 0) newIndex = cards.length - 1;
  if (newIndex >= cards.length) newIndex = 0;

  const newCard = cards[newIndex];
  
  // Neue Karte expandieren und Footer anzeigen
  newCard.classList.add('expanded');
  newCard.querySelector('.card-footer')?.classList.remove('hidden');
  
  document.body.classList.add('no-scroll');
  setCurrentExpandedIndex(newIndex);
}