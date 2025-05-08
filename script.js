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
    // 1. Reset to solved state
    this.tiles = [];
    for (let i = 0; i < 15; i++) {
      this.tiles.push({ value: i + 1, index: i });
    }
    const emptyTile = { value: null, index: 15 };
    this.tiles.push(emptyTile);

    // Apply initial indexes
    this.tiles.forEach((tile, i) => tile.index = i);

    // Initial render + TL setup
    this.render();
    this.updateTileList();

    // 2. Define reverse of the known solution moves
    const moveSequence = [
      "down", "right", "up", "right", "down", "left", "up", "up", "left", "up",
      "left", "down", "right", "down", "left", "up", "right", "up", "right", "down",
      "right", "down", "left", "left", "up", "up", "right", "down", "right", "up",
      "left", "left", "left", "down", "right", "right", "down", "down", "left", "up",
      "right", "down", "right", "up", "up", "left", "down", "down", "left", "left",
      "up", "right", "down", "right", "right"
    ];

    // 3. Reverse the moves to create the scramble
    const reverseMoves = [...moveSequence].reverse();

    const directionToOffset = {
      "up": 4,
      "down": -4,
      "left": 1,
      "right": -1
    };

    // 4. Execute reverse moves by simulating "sliding blank" in opposite direction
    reverseMoves.forEach(dir => {
      const blankIndex = this.tiles.findIndex(t => t.value === null);
      const offset = directionToOffset[dir];

      const targetIndex = blankIndex + offset;

      // Guard: ensure target is within bounds
      const validMove = (i, d) => {
        if (i < 0 || i > 15) return false;
        const row = Math.floor(blankIndex / 4);
        const col = blankIndex % 4;
        if (d === "left" && col === 3) return false;
        if (d === "right" && col === 0) return false;
        return true;
      };

      if (validMove(targetIndex, dir)) {
        [this.tiles[blankIndex], this.tiles[targetIndex]] = [this.tiles[targetIndex], this.tiles[blankIndex]];
      }
    });

    // 5. Apply correct .index to each tile
    this.tiles.forEach((tile, i) => tile.index = i);

    // 6. Rebuild TL to reflect current layout
    this.updateTileList();
    this.render();
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