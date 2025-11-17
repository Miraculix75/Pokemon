import { currentExpandedIndex, setCurrentExpandedIndex, currentExpandedPokemonId, setCurrentExpandedPokemonId } from './config.js';
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
  // Filter to only cards in the grid (not the expanded card in body)
  const gridCards = cards.filter(card => document.querySelector('.grid').contains(card));

  if (gridCards.length === 0) return { newIndex: -1, newCard: null };

  // Find current expanded card's index in the grid
  const currentCard = document.querySelector('.pokemon-card.expanded');
  let currentIndex = gridCards.findIndex(card => card === currentCard || card.dataset.pokemonId === currentExpandedPokemonId);

  if (currentIndex === -1) {
    // If not found, start from beginning or end based on direction
    currentIndex = direction > 0 ? -1 : gridCards.length;
  }

  // Calculate next index
  let newIndex = currentIndex + direction;
  if (newIndex < 0) newIndex = gridCards.length - 1;
  if (newIndex >= gridCards.length) newIndex = 0;

  return { newIndex, newCard: gridCards[newIndex] };
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
  if (card.dataset.pokemonId) setCurrentExpandedPokemonId(card.dataset.pokemonId);
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
