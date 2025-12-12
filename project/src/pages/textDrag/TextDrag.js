// src/pages/textDrag/TextDrag.js
import { useEffect, useState, useCallback } from "react";
import "../../css/TextDrag.css";
import { useTextSelection } from "./hooks/useTextSelection";
import { useWordSummary } from "./hooks/useWordSummary";
import TextDragTriggerButton from "./components/TextDragTriggerButton";
import TextDragBubble from "./components/TextDragBubble";
import linkOut from '../../img/link-out.svg';

const RECENT_WORDS_KEY = "recent_word_meanings";
const RECENT_WORDS_EVENT = "recent_words_updated"; 

const TextDrag = ({ text = "", articleId, section, news}) => {
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

  // 말풍선/선택 모두 한 번에 닫는 함수
  const clearAll = useCallback(() => {
    clearSelection();
    clearSummary();
    setShowBubble(false);
  }, [clearSelection, clearSummary]);

  // 🔍 버튼 눌렀을 때 요약 요청
  const handleClickTrigger = () => {
    if (!selectedWord && !selectedSentence) return;

    setShowBubble(true);
    requestSummary({
      word: selectedWord,
      sentence: selectedSentence,
      articleId,
      section,
    });
  };

  // 말풍선/돋보기 밖을 클릭하면 모두 닫기
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

  // 요약 완료되면 localStorage에 저장 + RecentWords 새로고침 이벤트 발행
  useEffect(() => {
    if (!bubbleText || !selectedWord) return;

    const newItem = {
      word: selectedWord,
      sentence: selectedSentence || "",
      summary: bubbleText,
      articleId,
      section,
      timestamp: Date.now(),
    };

    try {
      const raw = localStorage.getItem(RECENT_WORDS_KEY);
      const prev = raw ? JSON.parse(raw) : [];

      // 같은 단어+문장+기사+섹션은 하나만 유지
      const filtered = prev.filter(
        (item) =>
          !(
            item.word === newItem.word &&
            item.sentence === newItem.sentence &&
            item.articleId === newItem.articleId &&
            item.section === newItem.section
          )
      );

      const updated = [newItem, ...filtered].slice(0, 50);
      localStorage.setItem(RECENT_WORDS_KEY, JSON.stringify(updated));

      // RecentWords 훅에게 "업데이트됨" 알림
      window.dispatchEvent(new Event(RECENT_WORDS_EVENT));
    } catch (e) {
      console.error("최근 단어 저장 실패:", e);
    }
  }, [bubbleText, selectedWord, selectedSentence, articleId, section]);

  return (
    <div
      className="text-drag-wrapper"
      ref={wrapperRef}
      onMouseUp={(e) => {
        // 🔍 버튼이나 말풍선 위에서 mouseup이면 selection 유지
        if (
          e.target.closest(".text-drag-start") ||
          e.target.closest(".text-drag-bubble-floating")
        ) {
          return;
        }
        handleMouseUp(e);}}
    >
      {/* 🔍 작은 돋보기 버튼: 선택했을 때만, 말풍선 열리기 전까지 */} 
      {triggerPos.visible && !showBubble && (
        <TextDragTriggerButton
          top={triggerPos.top}
          left={triggerPos.left}
          onClick={handleClickTrigger}
        />
      )}

      {/* 320px 말풍선: 버튼 눌렀을 때만 */} 
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
        <br/><br/><br/>
        <a href={news.url} target="_blank" rel="noopener noreferrer">
          <button className="link-out">
            기사 원문 사이트로 이동
            <img src={linkOut} alt={news.url} />
          </button>
          </a>
      </p>
    </div>
  );
};

export default TextDrag;
