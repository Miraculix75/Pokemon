import { currentExpandedIndex, setCurrentExpandedIndex } from './config.js';
import { setupTabFunctionality } from './tabSystem.js';
import { navigateOverlay, restoreCardPosition, originalPositions } from './navigation.js';
import { resetTabsToStats } from './tabSystem.js';

export function createPokemonCard(pokemon) {
  const id = pokemon.id;
  const name = pokemon.name;
  const image = pokemon.sprites.other['official-artwork'].front_default;
  const type = pokemon.types[0].type.name;
  const hp = pokemon.stats[0].base_stat;
  const attack = pokemon.stats[1].base_stat;
  const defense = pokemon.stats[2].base_stat;
  const speed = pokemon.stats[5]?.base_stat ?? '—';
  const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');

  const container = document.createElement('div');
  container.className = `pokemon-card bg-${type}`;
  container.innerHTML = `
    <span class="pokemon-number">#${String(id).padStart(3, '0')}</span>
    <div class="pokemon-name">${name}</div>
    <div class="pokemon-image"><img src="${image}" alt="${name}"></div>

    <div class="tab-buttons hidden">
      <button class="tab-btn active" data-tab="stats">Stats</button>
      <button class="tab-btn" data-tab="moves">Moves</button>
      <button class="tab-btn" data-tab="shiny">Shiny</button>
    </div>

    <div class="tab-content tab-stats">
      <div class="pokemon-types">
        ${pokemon.types.map(t => `<span class="type type-${t.type.name}">${t.type.name}</span>`).join('')}
      </div>
      <div class="pokemon-stats">
        <p><strong>HP:</strong> ${hp}</p>
        <p><strong>Attack:</strong> ${attack}</p> 
        <p><strong>Defense:</strong> ${defense}</p>
        <p><strong>Speed:</strong> ${speed}</p>
      </div>
      <div class="abilities"><strong>Abilities:</strong> ${abilities}</div>
    </div>

    <div class="tab-content tab-moves hidden">
      <ul>${pokemon.moves.slice(0, 10).map(m => `<li>${m.move.name}</li>`).join('')}</ul>
    </div>

    <div class="tab-content tab-shiny hidden">
      <img src="${pokemon.sprites.front_shiny}" alt="${name} shiny" style="width: 120px;">
      <img src="${pokemon.sprites.front_default}" alt="${name}" style="height: 200px; margin-top: 1rem;">
    </div>

    <div class="card-footer hidden">
      <div class="overlay-nav-buttons">
        <button class="prev-btn">←</button>
        <button class="next-btn">→</button>
      </div>
    </div>

    <div class="close-button">×</div>
  `;

  // Doppelklick-Handler für das Erweitern der Karte
  container.addEventListener('dblclick', () => {
    const isExpanded = container.classList.contains('expanded');
    
    // Schließe andere geöffnete Karten
    document.querySelectorAll('.pokemon-card.expanded').forEach(card => {
      if (card !== container) {
        card.classList.remove('expanded');
      }
    });
    
    // Toggle expanded Zustand der aktuellen Karte
    container.classList.toggle('expanded', !isExpanded);
    
    if (!isExpanded) {
      // Karte wird expandiert
      
      // Speichere die ursprüngliche Position vor dem Verschieben
      if (!originalPositions.has(container)) {
        const parent = container.parentNode;
        const nextSibling = container.nextSibling;
        originalPositions.set(container, { parent, nextSibling });
      }
      
      // Overlay aktivieren
      const overlay = document.querySelector('#overlay');
      if (overlay) overlay.classList.add('active');
      
      // WICHTIG: Karte ans Ende des body verschieben, damit sie über allem liegt
      document.body.appendChild(container);
      
      document.body.classList.add('no-scroll');
      
      // Finde den Index der aktuellen Karte
      const allCards = Array.from(document.querySelectorAll('.pokemon-card'));
      setCurrentExpandedIndex(allCards.indexOf(container));
      
      // Footer und Buttons einblenden
      const footer = container.querySelector('.card-footer');
      if (footer) {
        footer.classList.remove('hidden');
      }
    } else {
      // Karte wird geschlossen
      // Sicherer Zugriff auf Overlay-Element
      const overlay = document.querySelector('#overlay');
      if (overlay) overlay.classList.remove('active');
      
      document.body.classList.remove('no-scroll');
      
      resetTabsToStats(container); // Reset tabs to stats
      setCurrentExpandedIndex(-1);
      const footer = container.querySelector('.card-footer');
      if (footer) {
        footer.classList.add('hidden');
      }
      
      // Wichtig: Karte an ihren ursprünglichen Platz im Grid zurückverschieben
      restoreCardPosition(container);
    }
  });

  // Close Button Handler
  container.querySelector('.close-button').addEventListener('click', e => {
    e.stopPropagation();
    // Sicherer Zugriff auf Overlay-Element
    const overlay = document.querySelector('#overlay');
    if (overlay) overlay.classList.remove('active');
    
    resetTabsToStats(container); // Reset tabs to stats
    container.classList.remove('expanded');
    document.body.classList.remove('no-scroll');
    container.querySelector('.card-footer')?.classList.add('hidden');
    setCurrentExpandedIndex(-1);
    
    // Wichtig: Karte an ihren ursprünglichen Platz im Grid zurückverschieben
    restoreCardPosition(container);
  });

  // Navigationsbuttons
  container.querySelector('.prev-btn').addEventListener('click', e => {
    e.stopPropagation();
    navigateOverlay(-1);
  });

  container.querySelector('.next-btn').addEventListener('click', e => {
    e.stopPropagation();
    navigateOverlay(1);
  });

  // Tab-Funktionalität aktivieren
  setupTabFunctionality(container);

  document.querySelector('.grid').appendChild(container);
}