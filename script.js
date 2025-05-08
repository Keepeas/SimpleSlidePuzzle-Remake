const TL = []; // Global Tile List

const puzzle = {
  tiles: [],
  container: document.getElementById('puzzle'),

  createTiles() {
    TL.length = 0;
    for (let i = 0; i < 15; i++) {
      TL.push({ value: i + 1, index: i });
    }
    TL.push({ value: null, index: 15 }); // Empty tile

    this.tiles = [...TL];
    this.render();
  },

  render() {
    this.container.innerHTML = '';
    const highlightEnabled = document.getElementById('highlightToggle')?.checked;
    const emptyIndex = this.tiles.findIndex(t => t.value === null);

    this.tiles.forEach((tile, i) => {
      tile.index = i; // Assign visual position index here for reference

      const el = document.createElement('div');
      el.classList.add('tile');
      el.dataset.index = i;

      if (tile.value !== null) {
        el.textContent = tile.value;
        el.addEventListener('click', () => this.moveTile(tile));

        if (highlightEnabled && this.getAdjacentIndexes(emptyIndex).includes(i)) {
          el.classList.add('movable');
        }
      } else {
        el.classList.add('empty');
      }

      this.container.appendChild(el);
    });
  },

  moveTile(tileObj) {
    const tilePos = this.tiles.indexOf(tileObj);
    const emptyIndex = this.tiles.findIndex(t => t.value === null);
    const validMoves = this.getAdjacentIndexes(emptyIndex);

    if (validMoves.includes(tilePos)) {
      // Swap positions in the tiles array
      [this.tiles[tilePos], this.tiles[emptyIndex]] = [this.tiles[emptyIndex], this.tiles[tilePos]];
      this.render();
    }
  },

  getAdjacentIndexes(index) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const adj = [];

    if (col > 0) adj.push(index - 1);
    if (col < 3) adj.push(index + 1);
    if (row > 0) adj.push(index - 4);
    if (row < 3) adj.push(index + 4);

    return adj;
  },

  shuffleTiles() {
    do {
      for (let i = this.tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
      }
    } while (!this.isSolvable());

	// Update tile positions
    this.tiles.forEach((tile, i) => {
      tile.index = i; // Current visual position
    });

    this.updateTileList(); // Rebuild TL array: visual order, skipping empty tile
    this.render(); // This will update tile.index automatically
  },

  originalShuffle() {
	console.log("Original Shuffle not yet implemented.");
	// TODO: Add your custom shuffle logic here.
  },

  updateTileList() {
    TL.length = 0;
    this.tiles.forEach(tile => {
      if (tile.value !== null) {
        TL.push(tile);
      }
    });
  },

  isSolvable() {
    const nums = this.tiles.map(t => t.value).filter(n => n !== null);
    let inversions = 0;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) inversions++;
      }
    }

    const emptyIndex = this.tiles.findIndex(t => t.value === null);
    const emptyRowFromBottom = 3 - Math.floor(emptyIndex / 4);
    return (inversions + emptyRowFromBottom) % 2 === 0;
  }
};

puzzle.createTiles();
document.getElementById('highlightToggle').addEventListener('change', () => {
  puzzle.render(); // Re-render to apply/remove highlights
});