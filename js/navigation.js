import { currentExpandedIndex, setCurrentExpandedIndex } from './config.js';
import { resetTabsToStats } from './tabSystem.js';

export const originalPositions = new Map();


function closeCurrentCard(currentCard) {
  resetTabsToStats(currentCard);
  currentCard.classList.remove('expanded');
  currentCard.querySelector('.card-footer')?.classList.add('hidden');
  restoreCardPosition(currentCard);
}


function getOverlayState() {
  const overlay = document.querySelector('#overlay');
  return overlay?.classList.contains('active');
}


function prepareNextCard(cards, direction) {
  let newIndex = direction > 0 ? 0 : cards.length - 1;
  if (currentExpandedIndex >= 0 && currentExpandedIndex < cards.length) {
    newIndex = currentExpandedIndex + direction;
    if (newIndex < 0) newIndex = cards.length - 1;
    if (newIndex >= cards.length) newIndex = 0;
  }
  return { newIndex, newCard: cards[newIndex] };
}


function saveCardPosition(card) {
  originalPositions.set(card, {
    parent: card.parentNode,
    nextSibling: card.nextSibling
  });
}


function openCard(card, index, overlayActive) {
  document.body.appendChild(card);
  card.classList.add('expanded');
  card.querySelector('.card-footer')?.classList.remove('hidden');
  const overlay = document.querySelector('#overlay');
  if (overlay && overlayActive) overlay.classList.add('active');
  document.body.classList.add('no-scroll');
  setCurrentExpandedIndex(index);
}


export function navigateOverlay(direction) {
  if (currentExpandedIndex === -1) return;
  const currentCard = document.querySelector('.pokemon-card.expanded');
  if (!currentCard) return;
  const overlayActive = getOverlayState();
  closeCurrentCard(currentCard);
  navigateToNextCard(direction, overlayActive);
}


function navigateToNextCard(direction, overlayActive) {
  setTimeout(() => {
    const cards = Array.from(document.querySelectorAll('.pokemon-card'));
    originalPositions.clear();
    const { newIndex, newCard } = prepareNextCard(cards, direction);
    if (!newCard) return;
    saveCardPosition(newCard);
    openCard(newCard, newIndex, overlayActive);
  }, 50);
}


export function restoreCardPosition(card) {
  if (originalPositions.has(card)) {
    const { parent, nextSibling } = originalPositions.get(card);
    if (document.body.contains(parent)) {
      parent.insertBefore(card, nextSibling);
      return;
    }
  }
  const grid = document.querySelector('.grid');
  if (grid && !grid.contains(card)) grid.appendChild(card);
}
