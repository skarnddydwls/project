import { useState } from "react";
import "../../css/RecentWords.css";
import { useRecentWords } from "./hooks/useRecentWords";
import RecentWordItem from "./components/RecentWordItem";

const RecentWords = () => {
  const { wordList, deleteByTimestamp } = useRecentWords();
  const [user, setUser] = useState(sessionStorage.getItem('loginUser'));

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

  const renderContent = () => {
    if(!user) {
      return <p>로그인 후 이용가능합니다.</p>
    }

    if(wordList.length === 0) {
      return <p className="recent-words-empty">최근 본 단어가 없습니다.</p>
    }

    return(
      <ul className="recent-list">
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
    )
  }

  return (
    <div className="recent-box">
      <h4 className="recent-title">최근 본 단어</h4>

        {renderContent()}
    </div>
  );
};

export default RecentWords;
