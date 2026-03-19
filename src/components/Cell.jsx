function Cell({ value, onClick, disabled }) {
  return (
    <button
      type="button"
      className="cell"
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell ${value}` : 'Empty cell'}
    >
      {value ?? ''}
    </button>
  );
}

export default Cell;
