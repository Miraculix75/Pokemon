// HTML Template Funktionen für Pokemon Karten

export function createCardHTML(pokemon) {
  const { id, name, image } = pokemon;
  return `
    <span class="pokemon-number">#${formatId(id)}</span>
    <div class="pokemon-name">${name}</div>
    <div class="pokemon-image">
      <img src="${image}" alt="${name}" loading="lazy">
    </div>
    ${createTabButtons()}
    ${createStatsTab(pokemon)}
    ${createMovesTab(pokemon)}
    ${createShinyTab(pokemon)}
    ${createCardFooter()}
    <div class="close-button">×</div>
  `;
}


export function formatId(id) {
  return String(id).padStart(3, '0');
}


export function createTabButtons() {
  return `
    <div class="tab-buttons hidden">
      <button class="tab-btn active" data-tab="stats">Stats</button>
      <button class="tab-btn" data-tab="moves">Moves</button>
      <button class="tab-btn" data-tab="shiny">Shiny</button>
    </div>
  `;
}


export function createStatsTab(pokemon) {
  const hp = pokemon.stats[0].base_stat;
  const attack = pokemon.stats[1].base_stat;
  const defense = pokemon.stats[2].base_stat;
  const speed = pokemon.stats[5]?.base_stat ?? '—';
  const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');

  return `
    <div class="tab-content tab-stats">
      ${createTypeBadges(pokemon.types)}
      ${createStatsSection(hp, attack, defense, speed)}
      <div class="abilities"><strong>Abilities:</strong> ${abilities}</div>
    </div>
  `;
}


export function createTypeBadges(types) {
  const badges = types.map(t =>
    `<span class="type type-${t.type.name}">${t.type.name}</span>`
  ).join('');
  return `<div class="pokemon-types">${badges}</div>`;
}


export function createStatsSection(hp, attack, defense, speed) {
  return `
    <div class="pokemon-stats">
      <p><strong>HP:</strong> ${hp}</p>
      <p><strong>Attack:</strong> ${attack}</p>
      <p><strong>Defense:</strong> ${defense}</p>
      <p><strong>Speed:</strong> ${speed}</p>
    </div>
  `;
}


export function createMovesTab(pokemon) {
  const moves = pokemon.moves.slice(0, 10)
    .map(m => `<li>${m.move.name}</li>`).join('');
  return `
    <div class="tab-content tab-moves hidden">
      <ul>${moves}</ul>
    </div>
  `;
}


export function createShinyTab(pokemon) {
  const { name, sprites } = pokemon;
  return `
    <div class="tab-content tab-shiny hidden">
      <img src="${sprites.front_shiny}" alt="${name} shiny"
           style="width: 120px;" loading="lazy">
      <img src="${sprites.front_default}" alt="${name}"
           style="height: 200px; margin-top: 1rem;" loading="lazy">
    </div>
  `;
}


export function createCardFooter() {
  return `
    <div class="card-footer hidden">
      <div class="overlay-nav-buttons">
        <button class="prev-btn">←</button>
        <button class="next-btn">→</button>
      </div>
    </div>
  `;
}
