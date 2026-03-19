function GameStatus({ winner, currentPlayer, humanSymbol, isCpuThinking, onRestart }) {
  const isHumanTurn = currentPlayer === humanSymbol && !isCpuThinking;

  let message = '';
  if (winner === 'draw') {
    message = "It's a draw!";
  } else if (winner) {
    message = winner === humanSymbol ? 'You win!' : 'CPU wins!';
  } else if (isCpuThinking) {
    message = 'CPU is thinking...';
  } else {
    message = isHumanTurn ? `Your turn (${currentPlayer})` : `CPU's turn (${currentPlayer})`;
  }

  return (
    <div className="game-status">
      <p className="status-message" role="status" aria-live="polite">
        {message}
      </p>
      <button type="button" className="restart-btn" onClick={onRestart}>
        {winner ? 'Play again' : 'Restart'}
      </button>
    </div>
  );
}

export default GameStatus;
