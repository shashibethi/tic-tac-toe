import { useState, useCallback, useRef } from 'react';
import Board from './Board.jsx';
import GameStatus from './GameStatus.jsx';
import { getWinner, getCpuMove } from '../lib/gameLogic.js';

const INITIAL_BOARD = () => Array(9).fill(null);
const CPU_DELAY_MS = 500;

function Game() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [humanSymbol] = useState('X');
  const [difficulty, setDifficulty] = useState('easy');
  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const cpuTimeoutRef = useRef(null);

  const cpuSymbol = humanSymbol === 'X' ? 'O' : 'X';

  const deriveWinner = useCallback((nextBoard) => {
    const w = getWinner(nextBoard);
    if (w) return w;
    const isFull = nextBoard.every((c) => c !== null);
    return isFull ? 'draw' : null;
  }, []);

  const applyMove = useCallback(
    (index) => {
      if (board[index] !== null || winner) return;
      const nextBoard = [...board];
      nextBoard[index] = currentPlayer;
      setBoard(nextBoard);

      const nextWinner = deriveWinner(nextBoard);
      setWinner(nextWinner);

      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);

      return { nextBoard, nextWinner, nextPlayer };
    },
    [board, currentPlayer, winner, deriveWinner]
  );

  const triggerCpuTurn = useCallback(
    (nextBoard, nextPlayer) => {
      if (nextPlayer !== cpuSymbol) return;
      if (cpuTimeoutRef.current) clearTimeout(cpuTimeoutRef.current);
      setIsCpuThinking(true);
      cpuTimeoutRef.current = setTimeout(() => {
        cpuTimeoutRef.current = null;
        const index = getCpuMove(nextBoard, difficulty, cpuSymbol);
        const after = [...nextBoard];
        after[index] = cpuSymbol;
        setBoard(after);
        const w = deriveWinner(after);
        setWinner(w);
        setCurrentPlayer(w ? nextPlayer : humanSymbol);
        setIsCpuThinking(false);
      }, CPU_DELAY_MS);
    },
    [cpuSymbol, difficulty, humanSymbol, deriveWinner]
  );

  const handleCellClick = useCallback(
    (index) => {
      if (currentPlayer !== humanSymbol || isCpuThinking || winner) return;
      const result = applyMove(index);
      if (result && !result.nextWinner) triggerCpuTurn(result.nextBoard, result.nextPlayer);
    },
    [currentPlayer, humanSymbol, isCpuThinking, winner, applyMove, triggerCpuTurn]
  );

  const handleRestart = useCallback(() => {
    if (cpuTimeoutRef.current) {
      clearTimeout(cpuTimeoutRef.current);
      cpuTimeoutRef.current = null;
    }
    setBoard(INITIAL_BOARD());
    setCurrentPlayer('X');
    setWinner(null);
    setIsCpuThinking(false);
  }, []);

  const boardDisabled = !!winner || isCpuThinking;

  return (
    <div className="game">
      <header className="game-header">
        <h1>Tic-Tac-Toe</h1>
        <div className="difficulty">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={!!winner || isCpuThinking}
          >
            <option value="easy">Easy</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </header>
      <GameStatus
        winner={winner}
        currentPlayer={currentPlayer}
        humanSymbol={humanSymbol}
        isCpuThinking={isCpuThinking}
        onRestart={handleRestart}
      />
      <Board board={board} onCellClick={handleCellClick} disabled={boardDisabled} />
    </div>
  );
}

export default Game;
