// src/gamePages/TextDrag.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../css/TextDrag.css";

const TextDrag = ({ text = "", articleId, section }) => {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  const [selectedWord, setSelectedWord] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [bubbleText, setBubbleText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔍 버튼 위치 + 노출 여부
  const [triggerPos, setTriggerPos] = useState({
    top: 0,
    left: 0,
    visible: false,
  });

  // 320px 말풍선 노출 여부
  const [showBubble, setShowBubble] = useState(false);

  const clearAll = () => {
    setSelectedWord("");
    setSelectedSentence("");
    setBubbleText("");
    setErrorMessage("");
    setIsLoading(false);
    setTriggerPos((prev) => ({ ...prev, visible: false }));
    setShowBubble(false);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const anchorNode = selection.anchorNode;
    if (!anchorNode) return;

    // wrapper 안에서만 동작
    if (!textRef.current || !textRef.current.contains(anchorNode)) {
      clearAll();
      return;
    }

    const raw = selection.toString();
    if (!raw.trim()) return;

    const fullText = text || "";

    // 선택 영역 오프셋 계산
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(textRef.current);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preCaretRange.toString().length;

    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const endOffset = preCaretRange.toString().length;

    if (startOffset >= endOffset) return;

    const selectedText = fullText.slice(startOffset, endOffset);
    const trimmedText = selectedText.trim();
    if (!trimmedText) return;

    const word = trimmedText;

    // 문장 추출 (. ? ! 기준)
    let sentenceStart = fullText.lastIndexOf(".", startOffset);
    if (sentenceStart === -1) sentenceStart = 0;
    else sentenceStart += 1;

    let sentenceEnd = fullText.indexOf(".", endOffset);
    if (sentenceEnd === -1) sentenceEnd = fullText.length;

    const exMarkIndex = fullText.indexOf("!", endOffset);
    const qMarkIndex = fullText.indexOf("?", endOffset);

    const candidates = [
      sentenceEnd,
      exMarkIndex > -1 ? exMarkIndex : Infinity,
      qMarkIndex > -1 ? qMarkIndex : Infinity,
    ];
    const sentenceEndPunct = Math.min(...candidates);
    if (sentenceEndPunct !== Infinity) sentenceEnd = sentenceEndPunct;

    let sentence = fullText.slice(sentenceStart, sentenceEnd + 1).trim();
    if (sentence && !/[.!?]$/.test(sentence)) {
      const nextPunct = fullText.slice(sentenceEnd).search(/[.!?]/);
      if (nextPunct > -1) {
        sentenceEnd += nextPunct + 1;
        sentence = fullText.slice(sentenceStart, sentenceEnd).trim();
      }
    }

    // 선택한 문장이 없으면 그냥 단어만 사용
    if (!sentence) {
      sentence = word;
    }

    // 🔍 버튼 위치 잡기
    if (range && wrapperRef.current) {
      const rect = range.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const MARGIN = 10;

      const top = rect.top - wrapperRect.top - MARGIN;
      const left = rect.left - wrapperRect.left + rect.width / 2;

      setTriggerPos({
        top: Math.max(0, top),
        left: Math.max(0, Math.min(left, wrapperRect.width)),
        visible: true,
      });

      // 새로 드래그하면 말풍선은 닫고 버튼만 보이게
      setShowBubble(false);
    }

    setSelectedWord(word);
    setSelectedSentence(sentence);
    setBubbleText("");
    setErrorMessage("");
    setIsLoading(false);
  };

  // 🔍 눌렀을 때: 버튼 사라지고 말풍선 + 요약 시작
  const handleSummary = async () => {
    if (!selectedWord && !selectedSentence) return;

    setShowBubble(true);
    setIsLoading(true);
    setErrorMessage("");
    setBubbleText("");

    try {
      const res = await axios.get("/util/word-meaning", {
        params: {
          word: selectedWord,
          sentence: selectedSentence,
          articleId,
          section,
        },
      });

      const summary = res.data.summary || res.data.result || "";
      setBubbleText(summary);
    } catch (err) {
      console.error(err);
      setErrorMessage("요약을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 말풍선/버튼 열려 있을 때, 바깥 클릭하면 닫기
  useEffect(() => {
    if (!triggerPos.visible && !showBubble) return;

    const handleClickOutside = (e) => {
      // 말풍선이나 🔍 버튼 안을 클릭하면 유지
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
  }, [triggerPos.visible, showBubble]);

  return (
    <div
      className="text-drag-wrapper"
      ref={wrapperRef}
      onMouseUp={handleMouseUp}
    >
      {/* 🔍 작은 돋보기 버튼 (선택했을 때만, 말풍선 열리기 전까지 노출) */}
      {triggerPos.visible && !showBubble && (
        <button
          type="button"
          className="text-drag-start"
          style={{ top: triggerPos.top, left: triggerPos.left }}
          onClick={handleSummary}
        >
          🔍
        </button>
      )}

      {/* 320px 말풍선: 버튼 눌렀을 때만 등장 */}
      {showBubble && (
        <div
          className="text-drag-bubble-floating"
          style={{ top: triggerPos.top, left: triggerPos.left }}
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
      )}

      {/* 실제 기사 텍스트 */}
      <p ref={textRef} className="text-drag-content">
        {text}
      </p>
    </div>
  );
};

export default TextDrag;
