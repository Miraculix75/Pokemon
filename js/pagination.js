import { 
  POKEMON_LIMIT, currentOffset, totalPokemonCount, 
  setCurrentOffset 
} from './config.js';
import { loadData } from './api.js';

export function renderPagination(totalPokemonCount, currentOffset, limit, onPageChange) {
  const container = document.getElementById('pagination-container');
  container.innerHTML = '';

  const totalPages = Math.ceil(totalPokemonCount / limit);
  const currentPage = Math.floor(currentOffset / limit) + 1;

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
      const newOffset = (start - 2) * limit;
      onPageChange(newOffset);
    });
    container.appendChild(prevArrow);
  }

  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      const newOffset = (i - 1) * limit;
      onPageChange(newOffset);
    });
    container.appendChild(btn);
  }

  if (end < totalPages) {
    const nextArrow = document.createElement('button');
    nextArrow.textContent = '»';
    nextArrow.addEventListener('click', () => {
      const newOffset = end * limit;
      onPageChange(newOffset);
    });
    container.appendChild(nextArrow);
  }

  console.log('Pagination:', totalPokemonCount, currentOffset, limit);
}