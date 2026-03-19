import Cell from './Cell.jsx';

function Board({ board, onCellClick, disabled }) {
  return (
    <div className="board" role="grid" aria-label="Tic-tac-toe board">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default Board;
