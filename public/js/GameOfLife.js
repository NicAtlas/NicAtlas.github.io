document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const gridSize = 10;
  const cellSize = 50;
  const cellPadding = 1;
  const gridColor = "#CCCCCC";
  let grid = [];
  let isInteractive = true;
  let isRunning = false;
  let isDrawing = false;

  // Predefined patterns
  const patterns = {
    pentomino: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ],
    pulsar: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    eyes: [
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    ]
  };

  initializeGrid();

  // Add event listeners to pattern images
  document.querySelectorAll('.pattern-card img').forEach(img => {
    img.addEventListener('click', (event) => {
      const patternName = event.target.dataset.pattern;
      if (patterns[patternName]) {
        loadPattern(patternName);
      }
    });
  });

  // Add event listener to start button
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', startGame);

  // Add event listener to reset button
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', resetGame);

  // Mouse event listeners for drawing
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  function startDrawing(event) {
    if (!isInteractive || isRunning) return;
    isDrawing = true;
    const { row, col } = getCellCoordinates(event);
    if (isValidCell(row, col)) {
      grid[row][col] = 1 - grid[row][col]; // Toggle cell state
      drawGrid();
    }
  }

  function draw(event) {
    if (!isDrawing || !isInteractive || isRunning) return;
    const { row, col } = getCellCoordinates(event);
    if (isValidCell(row, col)) {
      grid[row][col] = 1; // Set cell to alive while dragging
      drawGrid();
    }
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function getCellCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
      row: Math.floor(y / cellSize),
      col: Math.floor(x / cellSize)
    };
  }

  function isValidCell(row, col) {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
  }

  function loadPattern(patternName) {
    if (!isInteractive || isRunning) return;
    
    resetGame();
    const pattern = patterns[patternName];
    
    // Calculate center position for the pattern
    const startRow = Math.floor((gridSize - pattern.length) / 2);
    const startCol = Math.floor((gridSize - pattern[0].length) / 2);
    
    // Special case for eyes pattern which goes at the top
    const finalStartRow = patternName === 'eyes' ? 0 : startRow;
    
    // Load the pattern into the grid
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        if (finalStartRow + i < gridSize && startCol + j < gridSize) {
          grid[finalStartRow + i][startCol + j] = pattern[i][j];
        }
      }
    }
    drawGrid();
  }

  function initializeGrid() {
    grid = [];
    for (let row = 0; row < gridSize; row++) {
      grid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = 0;
      }
    }
    drawGrid();
  }

  function startGame() {
    isInteractive = false;
    isRunning = true;
    startButton.disabled = true;
    resetButton.disabled = false;
    runSimulation();
  }

  function resetGame() {
    isInteractive = true;
    isRunning = false;
    startButton.disabled = false;
    resetButton.disabled = true;
    initializeGrid();
  }

  function drawGrid() {
    ctx.fillStyle = gridColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        ctx.fillStyle = grid[row][col] === 1 ? 'black' : 'white';
        ctx.fillRect(
          col * cellSize + cellPadding,
          row * cellSize + cellPadding,
          cellSize - cellPadding * 2,
          cellSize - cellPadding * 2
        );
        ctx.strokeStyle = gridColor;
        ctx.strokeRect(
          col * cellSize + cellPadding,
          row * cellSize + cellPadding,
          cellSize - cellPadding * 2,
          cellSize - cellPadding * 2
        );
      }
    }
  }

  function runSimulation() {
    if (isRunning) {
      updateGrid();
      drawGrid();
      setTimeout(runSimulation, 200);
    }
  }

  function updateGrid() {
    let newGrid = [];
    for (let row = 0; row < gridSize; row++) {
      newGrid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        let liveNeighbors = countLiveNeighbors(row, col);
        if (grid[row][col] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
          newGrid[row][col] = 0;
        } else if (grid[row][col] === 0 && liveNeighbors === 3) {
          newGrid[row][col] = 1;
        } else {
          newGrid[row][col] = grid[row][col];
        }
      }
    }
    grid = newGrid;
  }

  function countLiveNeighbors(row, col) {
    let liveNeighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        let x = col + i;
        let y = row + j;
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
          liveNeighbors += grid[y][x];
        }
      }
    }
    return liveNeighbors;
  }
});
