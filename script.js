const puzzle = document.getElementById('puzzle');
let tiles = [];

function createTiles() {
  tiles = [];
  puzzle.innerHTML = '';

  for (let i = 0; i < 15; i++) {
    tiles.push({ value: i + 1 });
  }
  tiles.push({ value: null }); // Empty tile

  renderTiles();
}

function renderTiles() {
  puzzle.innerHTML = '';
  tiles.forEach((tile, index) => {
    const tileEl = document.createElement('div');
    tileEl.classList.add('tile');
    tileEl.dataset.index = index;

    if (tile.value !== null) {
      tileEl.textContent = tile.value;
      tileEl.addEventListener('click', () => moveTile(index));
    } else {
      tileEl.classList.add('empty');
    }

    puzzle.appendChild(tileEl);
  });
}

function moveTile(index) {
  const emptyIndex = tiles.findIndex(t => t.value === null);
  const validMoves = getAdjacentIndexes(emptyIndex);

  if (validMoves.includes(index)) {
    [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
    renderTiles();
  }
}

function getAdjacentIndexes(index) {
  const adj = [];
  const row = Math.floor(index / 4);
  const col = index % 4;

  if (col > 0) adj.push(index - 1);     // left
  if (col < 3) adj.push(index + 1);     // right
  if (row > 0) adj.push(index - 4);     // up
  if (row < 3) adj.push(index + 4);     // down

  return adj;
}

function shuffleTiles() {
  do {
    // Fisher–Yates shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable());

  renderTiles();
}

function isSolvable() {
  const numbers = tiles.map(t => t.value).filter(n => n !== null);
  let inversions = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] > numbers[j]) inversions++;
    }
  }

  const emptyIndex = tiles.findIndex(t => t.value === null);
  const emptyRowFromBottom = 3 - Math.floor(emptyIndex / 4); // row from bottom (0-based)
  return (inversions + emptyRowFromBottom) % 2 === 0;
}

createTiles();
