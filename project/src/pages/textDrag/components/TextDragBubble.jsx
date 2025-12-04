// src/pages/components/TextDragBubble.jsx
const TextDragBubble = ({ top, left, isLoading, bubbleText, errorMessage }) => {
  // 아무 상태도 없으면 굳이 안 그려도 됨
  if (!isLoading && !bubbleText && !errorMessage) return null;

  return (
    <div
      className="text-drag-bubble-floating"
      style={{ top, left }}
    >
      {isLoading && (
        <p className="text-drag-loading">요약 만드는 중...</p>
      )}

      {!isLoading && bubbleText && (
        <p className="text-drag-result">
          <strong>요약:</strong> {bubbleText}
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="text-drag-error">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextDragBubble;
