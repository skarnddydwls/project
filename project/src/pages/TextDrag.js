// src/gamePages/TextDrag.js
import React, { useState, useRef } from "react";
import axios from "axios";
import '../css/TextDrag.css';

const TextDrag = ({ text = "", articleId, section }) => {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  const [selectedWord, setSelectedWord] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [bubbleText, setBubbleText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [bubblePos, setBubblePos] = useState({
    top: 0,
    left: 0,
    visible: false,
  });

  const hasBubble =
    bubblePos.visible &&
    (selectedWord || bubbleText || isLoading || errorMessage || selectedSentence);

  const clearBubble = () => {
    setSelectedWord("");
    setSelectedSentence("");
    setBubbleText("");
    setErrorMessage("");
    setIsLoading(false);
    setBubblePos((prev) => ({ ...prev, visible: false }));
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    // 이 컴포넌트 내부에서만 동작
    if (!textRef.current || !textRef.current.contains(selection.anchorNode)) {
      return;
    }

    const raw = selection.toString().trim();
    if (!raw) return;

    const fullText = text || "";

    // 🔥 드래그한 "전체 문자열(raw)" 기준으로 위치 찾기
    const wordIndex = fullText.indexOf(raw);
    if (wordIndex === -1) return;

    // UI에 표시할 "대표 단어"는 그냥 첫 단어로
    const word = raw.split(/\s+/)[0] || raw;

    // 🔹 . 기준으로 앞/뒤 문장 자르기 (원하면 ? ! 도 추가 가능)
    let start = fullText.lastIndexOf(".", wordIndex - 1);
    let end = fullText.indexOf(".", wordIndex + raw.length);

    if (start === -1) start = 0;
    else start = start + 1; // . 다음 문자부터 시작

    if (end === -1) end = fullText.length;

    const sentence = fullText.slice(start, end).trim();
    if (!sentence) return;

    // 🔹 선택 영역 기준 좌표 계산 (선택한 텍스트 위쪽 중앙)
    if (selection.rangeCount > 0 && wrapperRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();

      const BUBBLE_MARGIN = 8; // 선택 텍스트와 말풍선 사이 간격

      // 선택 영역의 "윗부분" 기준 Y좌표
      let top = rect.top - wrapperRect.top - BUBBLE_MARGIN;
      // 선택 영역의 "가운데" 기준 X좌표
      let left =
        rect.left - wrapperRect.left + rect.width / 2;

      // 화면 밖 보정
      if (top < 0) top = 0;
      if (left < 0) left = 0;
      if (left > wrapperRect.width) left = wrapperRect.width;

      setBubblePos({
        top,
        left,
        visible: true,
      });
    }

    setSelectedWord(word);
    setSelectedSentence(sentence);
    setBubbleText("");
    setErrorMessage("");
    setIsLoading(true);

    // 🔥 백엔드 연결 전이면 여기 axios 부분은 주석처리하고 더미 넣어서 테스트해도 됨
    axios
      .post("/api/text-drag", {
        word,
        sentence,
        articleId,
        section,
      })
      .then((res) => {
        const summary = res.data.summary || res.data.result || "";
        setBubbleText(summary);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("요약을 불러오지 못했어요.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className="text-drag-wrapper"
      ref={wrapperRef}
      onMouseUp={handleMouseUp}
    >
      {/* 선택 위치 근처에 떠 있는 말풍선 */}
      {hasBubble && (
        <div
          className="text-drag-bubble-floating"
          style={{ top: bubblePos.top, left: bubblePos.left }}
        >
          <div className="text-drag-bubble-header">
            <span className="text-drag-word">
              🔍 {selectedWord || "선택된 단어 없음"}
            </span>
            <button
              type="button"
              className="text-drag-close"
              onClick={clearBubble}
            >
              ✕
            </button>
          </div>

          {selectedSentence && (
            <p className="text-drag-sentence">
              <strong>문장:</strong> {selectedSentence}
            </p>
          )}

          <hr />

          {isLoading && (
            <p className="text-drag-loading">요약 만드는 중...</p>
          )}

          {bubbleText && (
            <p className="text-drag-result">
              <strong>요약:</strong> {bubbleText}
            </p>
          )}

          {errorMessage && (
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
