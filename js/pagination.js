import { 
  POKEMON_LIMIT, currentOffset, totalPokemonCount, 
  setCurrentOffset 
} from './config.js';
import { loadData } from './api.js';

export function renderPagination() {
  const container = document.getElementById('pagination-container');
  container.innerHTML = '';

  const totalPages = Math.ceil(totalPokemonCount / POKEMON_LIMIT);
  const currentPage = Math.floor(currentOffset / POKEMON_LIMIT) + 1;

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > 1) {
    const prevArrow = document.createElement('button');
    prevArrow.textContent = '«';
    prevArrow.addEventListener('click', () => {
      setCurrentOffset((start - 2) * POKEMON_LIMIT);
      loadData();
    });
    container.appendChild(prevArrow);
  }

  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      setCurrentOffset((i - 1) * POKEMON_LIMIT);
      loadData();
    });
    container.appendChild(btn);
  }

  if (end < totalPages) {
    const nextArrow = document.createElement('button');
    nextArrow.textContent = '»';
    nextArrow.addEventListener('click', () => {
      setCurrentOffset(end * POKEMON_LIMIT);
      loadData();
    });
    container.appendChild(nextArrow);
  }
}