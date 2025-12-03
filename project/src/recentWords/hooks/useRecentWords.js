// src/pages/recentWords/hooks/useRecentWords.js
import { useEffect, useState } from "react";

const RECENT_WORDS_KEY = "recent_word_meanings";

export const useRecentWords = () => {
  const [wordList, setWordList] = useState([]);

  useEffect(() => {
    // 개발용 더미 데이터 3개
    /*const dummyData = [
      { word: "금리", timestamp: 1 },
      { word: "환율", timestamp: 2 },
      { word: "인플레이션", timestamp: 3 },
    ];

    setWordList(dummyData);
    */
    // 🔽 실제 localStorage 버전 쓰고 싶으면 이 부분으로 교체
    
    try {
      const raw = localStorage.getItem(RECENT_WORDS_KEY);
      if (!raw) {
        setWordList([]);
        return;
      }

      const data = JSON.parse(raw);
      const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
      setWordList(sorted);
    } catch (e) {
      console.error("최근 단어 뜻 불러오기 실패:", e);
      setWordList([]);
    }
    
  }, []);

  // 한 줄 삭제 (timestamp 기준)
  const deleteByTimestamp = (timestamp) => {
    setWordList((prev) => prev.filter((item) => item.timestamp !== timestamp));

    // 나중에 localStorage까지 같이 지우고 싶으면 여기 추가하면 됨
    
    try {
      const raw = localStorage.getItem(RECENT_WORDS_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      const storedUpdated = stored.filter(
        (item) => item.timestamp !== timestamp
      );
      localStorage.setItem(RECENT_WORDS_KEY, JSON.stringify(storedUpdated));
    } catch (e) {
      console.error("최근 단어 뜻 삭제 실패:", e);
    }
    
  };

  return {
    wordList,
    deleteByTimestamp,
  };
};
