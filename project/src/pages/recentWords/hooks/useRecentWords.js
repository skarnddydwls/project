// src/recentWords/hooks/useRecentWords.js
import { useEffect, useState } from "react";

const RECENT_WORDS_KEY = "recent_word_meanings";
const RECENT_WORDS_EVENT = "recent_words_updated";

export const useRecentWords = () => {
  const [wordList, setWordList] = useState([]);

  // localStorage에서 목록 읽어오기
  const loadFromStorage = () => {
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
  };

  // 마운트 시 + 이벤트 발생 시마다 다시 로딩 
  useEffect(() => {
    loadFromStorage(); 

    const handleUpdated = () => loadFromStorage(); 
    window.addEventListener(RECENT_WORDS_EVENT, handleUpdated);

    return () => {
      window.removeEventListener(RECENT_WORDS_EVENT, handleUpdated); 
    };
  }, []);

  // 한 줄 삭제 (timestamp 기준)
  const deleteByTimestamp = (timestamp) => {
    setWordList((prev) => prev.filter((it) => it.timestamp !== timestamp));

    try {
      const raw = localStorage.getItem(RECENT_WORDS_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      const updated = stored.filter((it) => it.timestamp !== timestamp);
      localStorage.setItem(RECENT_WORDS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("최근 단어 뜻 삭제 실패:", e);
    }

    // 삭제 후에도 목록 갱신 이벤트 날려도 됨 (선택 사항)
    window.dispatchEvent(new Event(RECENT_WORDS_EVENT));
  };

  return {
    wordList,
    deleteByTimestamp,
  };
};
