const ARROW_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

function getGridColumnCount(container) {
  if (!container) return 1;

  const styles = window.getComputedStyle(container);
  const columns = styles.gridTemplateColumns
    .split(' ')
    .filter(Boolean).length;

  return Math.max(columns || 1, 1);
}

export function handleGridDirectionalNavigation({
  event,
  index,
  totalItems,
  container,
  itemSelector = '[data-tv-nav-item]'
}) {
  if (!event || !ARROW_KEYS.has(event.key) || totalItems <= 1) {
    return;
  }

  const columns = getGridColumnCount(container);
  let nextIndex = index;

  if (event.key === 'ArrowRight') nextIndex = Math.min(index + 1, totalItems - 1);
  if (event.key === 'ArrowLeft') nextIndex = Math.max(index - 1, 0);
  if (event.key === 'ArrowDown') nextIndex = Math.min(index + columns, totalItems - 1);
  if (event.key === 'ArrowUp') nextIndex = Math.max(index - columns, 0);

  if (nextIndex === index) {
    return;
  }

  const items = container?.querySelectorAll(itemSelector);
  const nextItem = items?.[nextIndex];

  if (nextItem && typeof nextItem.focus === 'function') {
    event.preventDefault();
    nextItem.focus();
  }
}