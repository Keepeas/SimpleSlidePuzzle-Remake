const puzzle = document.getElementById('puzzle');
let tiles = [];

function createTiles() {
  puzzle.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.index = i;
    if (i < 15) {
      tile.textContent = i + 1;
    } else {
      tile.classList.add('empty');
    }
    tile.addEventListener('click', () => moveTile(i));
    tiles[i] = tile;
    puzzle.appendChild(tile);
  }
}

function moveTile(index) {
  const emptyIndex = tiles.findIndex(tile => tile.classList.contains('empty'));
  const validMoves = getAdjacentIndexes(emptyIndex);

  if (validMoves.includes(index)) {
    [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
    renderTiles();
  }
}

function getAdjacentIndexes(index) {
  const adj = [];
  if (index % 4 > 0) adj.push(index - 1); // left
  if (index % 4 < 3) adj.push(index + 1); // right
  if (index >= 4) adj.push(index - 4);    // up
  if (index < 12) adj.push(index + 4);    // down
  return adj;
}

function renderTiles() {
  puzzle.innerHTML = '';
  tiles.forEach((tile, i) => {
    tile.dataset.index = i;
    puzzle.appendChild(tile);
  });
}

function shuffleTiles() {
  do {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable());
  renderTiles();
}

function isSolvable() {
  const numbers = tiles.map(tile => tile.textContent).filter(n => n).map(Number);
  let inversions = 0;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] > numbers[j]) inversions++;
    }
  }

  const emptyRow = Math.floor(tiles.findIndex(t => t.classList.contains('empty')) / 4);
  return (inversions + emptyRow) % 2 === 0;
}

createTiles();
