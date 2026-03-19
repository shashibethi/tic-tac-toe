/**
 * Board is an array of 9 elements: index 0-2 = row 0, 3-5 = row 1, 6-8 = row 2.
 * Each cell is null | 'X' | 'O'.
 */

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * @param {Array<null | 'X' | 'O'>} board
 * @returns {'X' | 'O' | null}
 */
export function getWinner(board) {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

/**
 * @param {Array<null | 'X' | 'O'>} board
 * @returns {number[]}
 */
export function getEmptyIndices(board) {
  return board.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0);
}

/**
 * Easy: pick a random empty cell.
 * @param {Array<null | 'X' | 'O'>} board
 * @param {'X' | 'O'} cpuSymbol
 * @returns {number}
 */
function getCpuMoveEasy(board, cpuSymbol) {
  const empty = getEmptyIndices(board);
  return empty[Math.floor(Math.random() * empty.length)];
}

/**
 * Hard: minimax. CPU (cpuSymbol) maximizes, opponent minimizes.
 * @param {Array<null | 'X' | 'O'>} board
 * @param {'X' | 'O'} cpuSymbol
 * @returns {number}
 */
function getCpuMoveHard(board, cpuSymbol) {
  const humanSymbol = cpuSymbol === 'X' ? 'O' : 'X';

  function minimax(b, isMax) {
    const w = getWinner(b);
    if (w === cpuSymbol) return 1;
    if (w === humanSymbol) return -1;
    const empty = getEmptyIndices(b);
    if (empty.length === 0) return 0;

    if (isMax) {
      let best = -Infinity;
      for (const i of empty) {
        const next = [...b];
        next[i] = cpuSymbol;
        best = Math.max(best, minimax(next, false));
      }
      return best;
    } else {
      let best = Infinity;
      for (const i of empty) {
        const next = [...b];
        next[i] = humanSymbol;
        best = Math.min(best, minimax(next, true));
      }
      return best;
    }
  }

  const empty = getEmptyIndices(board);
  let bestScore = -Infinity;
  let bestIndex = empty[0];

  for (const i of empty) {
    const next = [...board];
    next[i] = cpuSymbol;
    const score = minimax(next, false);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestIndex;
}

const strategies = {
  easy: getCpuMoveEasy,
  hard: getCpuMoveHard,
};

/**
 * @param {Array<null | 'X' | 'O'>} board
 * @param {'easy' | 'hard'} difficulty
 * @param {'X' | 'O'} cpuSymbol
 * @returns {number}
 */
export function getCpuMove(board, difficulty, cpuSymbol) {
  const fn = strategies[difficulty] ?? strategies.easy;
  return fn(board, cpuSymbol);
}
