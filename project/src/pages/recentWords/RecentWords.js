// src/pages/RecentWords.js
import React, { useState } from "react";
import "../../css/RecentWords.css";
import { useRecentWords } from "./hooks/useRecentWords";
import RecentWordItem from "./components/RecentWordItem";
import { useWordSummary } from "../textDrag/hooks/useWordSummary";

const RecentWords = () => {
  const { wordList, deleteByTimestamp } = useRecentWords();

  // 요약 API 훅 불러오기 // 수정됨
  const {
    bubbleText,
    isLoading,
    errorMessage,
    requestSummary,
    clearSummary,
  } = useWordSummary(); // 수정됨

  const [activeTs, setActiveTs] = useState(null);

  const handleClickWord = async (word, timestamp) => {
    // 같은 것을 눌렀다면 닫기
    if (activeTs === timestamp) {
      setActiveTs(null);
      clearSummary(); // 수정됨
      return;
    }

    setActiveTs(timestamp);
    clearSummary(); // 수정됨
 
    // 요약 API 호출 // 수정됨
    requestSummary({ word, sentence: "" }); 
  };

  const handleDelete = (timestamp) => {
    if (activeTs === timestamp) {
      setActiveTs(null);
      clearSummary(); // 수정됨
    }
    deleteByTimestamp(timestamp);
  };

  return (
    <div className="recent-box recent-words-box">
      <h4 className="recent-title recent-words-title">최근 본 단어 뜻</h4>

      {wordList.length === 0 ? (
        <p className="recent-words-empty">최근 본 단어가 없습니다.</p>
      ) : (
        <ul className="recent-list recent-words-list">
          {wordList.map((item) => (
            <RecentWordItem
              key={item.timestamp}
              word={item.word}
              timestamp={item.timestamp}
              isActive={activeTs === item.timestamp}
              isLoading={isLoading && activeTs === item.timestamp}
              summary={activeTs === item.timestamp ? bubbleText : ""}
              error={activeTs === item.timestamp ? errorMessage : ""}
              onClickWord={handleClickWord}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentWords;
