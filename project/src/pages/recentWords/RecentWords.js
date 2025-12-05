// src/recentWords/RecentWords.js
import { useState } from "react";
import "../../css/RecentWords.css";
import { useRecentWords } from "./hooks/useRecentWords";
import RecentWordItem from "./components/RecentWordItem";
import RecentWordItem2 from "./components/RecentWordItem2";

const RecentWords = () => {
  const { wordList, deleteByTimestamp } = useRecentWords();
  const [activeTs, setActiveTs] = useState(null);

  const handleClickWord = (timestamp) => {
    setActiveTs((prev) => (prev === timestamp ? null : timestamp));
  };

  const handleDelete = (timestamp) => {
    if (activeTs === timestamp) {
      setActiveTs(null);
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
              summary={item.summary}
              timestamp={item.timestamp}
              isActive={activeTs === item.timestamp}
              onClickWord={handleClickWord}
              onDelete={handleDelete}
            />
          ))}
          {wordList.map((item) => (
            <RecentWordItem2
              summary={item.summary}
              isActive={activeTs === item.timestamp}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentWords;
