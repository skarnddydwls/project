// src/pages/hooks/useTextSelection.js
import { useState, useRef } from "react";

export const useTextSelection = (text) => {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  const [selectedWord, setSelectedWord] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [triggerPos, setTriggerPos] = useState({
    top: 0,
    left: 0,
    visible: false,
  });


  // 🔹 기존 하이라이트 지우기
  const clearHighlights = () => {
    if (!textRef.current) return;
    const spans = textRef.current.querySelectorAll(".drag-selected");
    spans.forEach((span) => {
      const parent = span.parentNode;
      // span 안의 텍스트를 다시 부모로 빼내기
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
      parent.normalize(); // 텍스트 노드 합치기
    });
  };

  // 🔹 새 하이라이트 적용
  const highlightSelection = (range) => {
    const span = document.createElement("span");
    span.className = "drag-selected";
    try {
      range.surroundContents(span);
    } catch (e) {
      console.warn("하이라이트 실패", e);
    }
  };

  const clearSelection = () => {
    clearHighlights(); // ✅ 선택 지울 때 하이라이트도 같이 제거
    setSelectedWord("");
    setSelectedSentence("");
    setTriggerPos((prev) => ({ ...prev, visible: false }));
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const anchorNode = selection.anchorNode;
    if (!anchorNode) return;

    // 말풍선/버튼 안에서 선택한 경우 무시
    const startElement =
      anchorNode.nodeType === Node.ELEMENT_NODE
        ? anchorNode
        : anchorNode.parentNode;

    if (startElement && startElement.closest) {
      const insideBubble = startElement.closest(".text-drag-bubble-floating");
      const insideTrigger = startElement.closest(".text-drag-start");
      if (insideBubble || insideTrigger) {
        return;
      }
    }

    // 실제 본문 영역 안에서만 동작
    if (!textRef.current || !textRef.current.contains(anchorNode)) {
      clearSelection();
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

    if (!sentence) {
      sentence = word;
    }

    // 🔍 버튼 위치 계산
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
    }
    setSelectedWord(word);
    setSelectedSentence(sentence);
    highlightSelection(range);
  };

  return {
    wrapperRef,
    textRef,
    selectedWord,
    selectedSentence,
    triggerPos,
    clearSelection,
    handleMouseUp,
  };
};
