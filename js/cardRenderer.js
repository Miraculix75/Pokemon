import { setCurrentExpandedIndex } from './config.js';
import { setupTabFunctionality } from './tabSystem.js';
import { navigateOverlay, restoreCardPosition, originalPositions } from './navigation.js';
import { resetTabsToStats } from './tabSystem.js';
import { createCardHTML } from './templates.js';


function closeCard(card) {
  const overlay = document.querySelector('#overlay');
  if (overlay) overlay.classList.remove('active');
  resetTabsToStats(card);
  card.classList.remove('expanded');
  document.body.classList.remove('no-scroll');
  card.querySelector('.card-footer')?.classList.add('hidden');
  setCurrentExpandedIndex(-1);
  restoreCardPosition(card);
}


function handleCardClick(container, e) {
  if (e.target.closest('button')) return;
  const isExpanded = container.classList.contains('expanded');
  if (isExpanded) return;
  closeOtherCards(container);
  expandCard(container);
}


function closeOtherCards(currentCard) {
  document.querySelectorAll('.pokemon-card.expanded').forEach(card => {
    if (card !== currentCard) closeCard(card);
  });
}


function expandCard(container) {
  saveOriginalPosition(container);
  activateOverlay();
  moveCardToBody(container);
  updateExpandedState(container);
}


function saveOriginalPosition(container) {
  if (!originalPositions.has(container)) {
    const parent = container.parentNode;
    const nextSibling = container.nextSibling;
    originalPositions.set(container, { parent, nextSibling });
  }
}


function activateOverlay() {
  const overlay = document.querySelector('#overlay');
  if (overlay) overlay.classList.add('active');
}


function moveCardToBody(container) {
  document.body.appendChild(container);
}


function updateExpandedState(container) {
  container.classList.add('expanded');
  document.body.classList.add('no-scroll');
  const allCards = Array.from(document.querySelectorAll('.pokemon-card'));
  setCurrentExpandedIndex(allCards.indexOf(container));
  const footer = container.querySelector('.card-footer');
  if (footer) footer.classList.remove('hidden');
}


function attachEventListeners(container) {
  container.addEventListener('click', (e) => handleCardClick(container, e));
  attachCloseButton(container);
  attachNavigationButtons(container);
  setupTabFunctionality(container);
}


function attachCloseButton(container) {
  container.querySelector('.close-button').addEventListener('click', e => {
    e.stopPropagation();
    closeCard(container);
  });
}


function attachNavigationButtons(container) {
  container.querySelector('.prev-btn').addEventListener('click', e => {
    e.stopPropagation();
    navigateOverlay(-1);
  });
  container.querySelector('.next-btn').addEventListener('click', e => {
    e.stopPropagation();
    navigateOverlay(1);
  });
}


export function createPokemonCard(pokemon) {
  const type = pokemon.types[0].type.name;
  const container = document.createElement('div');
  container.className = `pokemon-card bg-${type}`;
  const cardData = prepareCardData(pokemon);
  container.innerHTML = createCardHTML(cardData);
  attachEventListeners(container);
  document.querySelector('.grid').appendChild(container);
}


function prepareCardData(pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other['official-artwork'].front_default,
    types: pokemon.types,
    stats: pokemon.stats,
    abilities: pokemon.abilities,
    moves: pokemon.moves,
    sprites: pokemon.sprites
  };
}
