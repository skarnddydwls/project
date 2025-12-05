import React, { useEffect, useCallback, useState } from "react";
import "../../css/TextDrag.css";
import { useTextSelection } from "./hooks/useTextSelection";
import { useWordSummary } from "./hooks/useWordSummary";
import TextDragTriggerButton from "./components/TextDragTriggerButton";
import TextDragBubble from "./components/TextDragBubble";

const TextDrag = ({ text = "", articleId, section }) => {
  const {
    wrapperRef,
    textRef,
    selectedWord,
    selectedSentence,
    triggerPos,
    clearSelection,
    handleMouseUp,
  } = useTextSelection(text);

  const {
    bubbleText,
    isLoading,
    errorMessage,
    requestSummary,
    clearSummary,
  } = useWordSummary();

  const [showBubble, setShowBubble] = useState(false);

  const clearAll = useCallback(() => {
    clearSelection();
    clearSummary();
    setShowBubble(false);
  }, [clearSelection, clearSummary]);

  const handleSummary = () => {
    setShowBubble(true);
    requestSummary({
      word: selectedWord,
      sentence: selectedSentence,
      articleId,
      section,
    });
  };

  useEffect(() => {
    if (!triggerPos.visible && !showBubble) return;

    const handleClickOutside = (e) => {
      if (
        e.target.closest(".text-drag-bubble-floating") ||
        e.target.closest(".text-drag-start")
      ) {
        return;
      }
      clearAll();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [triggerPos.visible, showBubble, clearAll]);

  return (
    <div
      className="text-drag-wrapper"
      ref={wrapperRef}
      onMouseUp={handleMouseUp}
    >
      {/* 🔍 작은 돋보기 버튼 (선택했을 때만, 말풍선 열리기 전까지 노출) */}
      {triggerPos.visible && !showBubble && (
        <TextDragTriggerButton
          top={triggerPos.top}
          left={triggerPos.left}
          onClick={handleSummary}
        />
      )}

      {/* 320px 말풍선: 버튼 눌렀을 때만 등장 */}
      {showBubble && (
        <TextDragBubble
          top={triggerPos.top}
          left={triggerPos.left}
          isLoading={isLoading}
          bubbleText={bubbleText}
          errorMessage={errorMessage}
        />
      )}

      {/* 실제 기사 텍스트 */}
      <p ref={textRef} className="text-drag-content">
        {text}
      </p>
    </div>
  );
};

export default TextDrag;
