import { useState } from "react";
import "../../css/RecentWords.css";
import { useRecentWords } from "./hooks/useRecentWords";
import RecentWordItem from "./components/RecentWordItem";

const RecentWords = () => {
  const { wordList, deleteByTimestamp } = useRecentWords();

  // 현재 열려 있는 단어의 timestamp
  const [activeTs, setActiveTs] = useState(null);

  // 단어 클릭 → 해당 timestamp 토글
  const handleClickWord = (timestamp) => {
    setActiveTs((prev) => (prev === timestamp ? null : timestamp));
  };

  // 삭제 시 열려 있던 항목이면 닫기
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
        </ul>
      )}
    </div>
  );
};

export default RecentWords;
