// src/components/TextDrag.js (경로는 원하는 대로)
import React, { useState, useRef } from "react";
import axios from "axios";

const TextDrag = ({ text = "", articleId, section }) => {
  const textRef = useRef(null);

  const [selectedWord, setSelectedWord] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [bubbleText, setBubbleText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 말풍선 초기화
  const clearBubble = () => {
    setSelectedWord("");
    setSelectedSentence("");
    setBubbleText("");
    setErrorMessage("");
    setIsLoading(false);
  };

  // 드래그 후 마우스 뗄 때 실행
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    // 이 컴포넌트 영역 안에서 드래그된 것만 처리
    if (!textRef.current || !textRef.current.contains(selection.anchorNode)) {
      return;
    }

    const raw = selection.toString().trim();
    if (!raw) return;

    // 여러 단어 드래그해도 첫 단어만 사용 (원하면 수정 가능)
    const word = raw.split(/\s+/)[0];
    if (!word) return;

    // 전체 텍스트 기준으로 단어가 포함된 문장 찾기
    const fullText = text;
    const wordIndex = fullText.indexOf(word);

    if (wordIndex === -1) {
      // 같은 단어가 여러 번 나올 때 정확히 못 찾는 경우도 있으니 그냥 무시
      return;
    }

    // 이전 . 과 다음 . 사이를 문장으로 잡기 (없으면 시작/끝으로 처리)
    let start = fullText.lastIndexOf(".", wordIndex - 1);
    let end = fullText.indexOf(".", wordIndex + word.length);

    if (start === -1) start = 0;
    else start = start + 1; // . 뒤부터 시작

    if (end === -1) end = fullText.length;

    const sentence = fullText.slice(start, end).trim();
    if (!sentence) return;

    setSelectedWord(word);
    setSelectedSentence(sentence);
    setBubbleText("");
    setErrorMessage("");
    setIsLoading(true);

    // ==== 백엔드 요청 (URL은 백엔드랑 맞춰서 변경) ====
    axios
      .post("/util/word-meaning", {
        word,
        sentence,
        articleId, // 옵션: 기사 id 필요하면 사용
        section,   // 옵션: "content" | "simplified" | "summary" 등
      })
      .then((res) => {
        // 응답 형식에 맞게 수정 (예: res.data.summary)
        const summary = res.data.summary || res.data.result || "";
        setBubbleText(summary);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("요약을 불러오지 못했어요.");
        setErrorMessage(word);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="text-drag-wrapper">
      {/* 말풍선 영역 (스크랩 위에 고정으로 떠 있는 느낌으로 사용) */}
      {(selectedWord || bubbleText || isLoading || errorMessage) && (
        <div className="text-drag-bubble">
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

      {/* 실제 뉴스 텍스트 영역 */}
      <p
        ref={textRef}
        className="text-drag-content"
        onMouseUp={handleMouseUp}
      >
        {text}
      </p>
    </div>
  );
};

export default TextDrag;
