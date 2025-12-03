// src/pages/RecentWords.js
import React, { useState } from "react";
import "../css/RecentWords.css";
import axios from "axios";
import { useRecentWords } from "./hooks/useRecentWords";
import RecentWordItem from "./components/RecentWordItem";

const RecentWords = () => {
  const { wordList, deleteByTimestamp } = useRecentWords();

  const [activeTs, setActiveTs] = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClickWord = async (word, timestamp) => {
    // 같은 항목을 다시 누르면 토글(닫기)
    if (activeTs === timestamp) {
      setActiveTs(null);
      setSummary("");
      setError("");
      setIsLoading(false);
      return;
    }

    setActiveTs(timestamp);
    setSummary("");
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.get("/util/word-meaning", {
        params: {
          word,
          // sentence: "", // 나중에 문장까지 저장하면 같이 넘겨도 됨
        },
      });

      const s = res.data.summary || res.data.result || "";
      setSummary(s || "뜻을 찾지 못했어요.");
    } catch (e) {
      console.error(e);
      setError("뜻을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (timestamp) => {
    // 삭제 중에 활성화된 말풍선이면 같이 닫기
    if (activeTs === timestamp) {
      setActiveTs(null);
      setSummary("");
      setError("");
      setIsLoading(false);
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
              summary={activeTs === item.timestamp ? summary : ""}
              error={activeTs === item.timestamp ? error : ""}
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
