const TL = []; // Global Tile List

const puzzle = {
  tiles: [],
  container: document.getElementById('puzzle'),

  createTiles() {
    TL.length = 0;
    this.tiles = [];
    this.container.innerHTML = '';

    for (let i = 0; i < 15; i++) {
      TL.push({ value: i + 1, index: i });
    }
    TL.push({ value: null, index: 15 }); // Empty tile

    this.tiles = [...TL];
    this.render();
  },

  render() {
    this.container.innerHTML = '';
    TL.length = 0; // Reset global tile list

    this.tiles.forEach((tileObj, i) => {
      tileObj.index = i; // Keep position info updated

      const el = document.createElement('div');
      el.classList.add('tile');
      el.dataset.index = i;

      if (tileObj.value !== null) {
        el.textContent = tileObj.value;
        el.addEventListener('click', () => this.moveTile(tileObj));
        TL[i] = tileObj; // Add to TL by visual grid index
      } else {
        el.classList.add('empty');
        TL[i] = tileObj; // Optional: include empty tile in TL
      }

      this.container.appendChild(el);
    });
  },

  moveTile(tileObj) {
    const fromIndex = tileObj.index;
    const emptyIndex = this.tiles.findIndex(t => t.value === null);
    const validMoves = this.getAdjacentIndexes(emptyIndex);

    if (validMoves.includes(fromIndex)) {
      [this.tiles[emptyIndex], this.tiles[fromIndex]] = [this.tiles[fromIndex], this.tiles[emptyIndex]];
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

    this.render();
  },

  originalShuffle() {
	console.log("Original Shuffle not yet implemented.");
	// TODO: Add your custom shuffle logic here.
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
