const TextDragTriggerButton = ({ top, left, onClick }) => {
  return (
    <button
      type="button"
      className="text-drag-start"
      style={{ top, left }}
      onClick={onClick}
    >
      🔍
    </button>
  );
};

export default TextDragTriggerButton;
