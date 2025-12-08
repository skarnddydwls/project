// src/recentWords/hooks/useRecentWords.js
import { useEffect, useState } from "react";

const RECENT_WORDS_KEY = "recent_word_meanings";      // 수정됨
const RECENT_WORDS_EVENT = "recent_words_updated";    // 수정됨

export const useRecentWords = () => {
  const [wordList, setWordList] = useState([]);       // 수정됨

  // localStorage에서 목록 읽어오기                          // 수정됨
  const loadFromStorage = () => {                     // 수정됨
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

  // 마운트 시 + 이벤트 발생 시마다 다시 로딩                 // 수정됨
  useEffect(() => {                                     // 수정됨
    loadFromStorage();                                  // 수정됨

    const handleUpdated = () => loadFromStorage();      // 수정됨
    window.addEventListener(RECENT_WORDS_EVENT, handleUpdated); // 수정됨

    return () => {
      window.removeEventListener(RECENT_WORDS_EVENT, handleUpdated); // 수정됨
    };
  }, []);                                               // 수정됨

  // 한 줄 삭제 (timestamp 기준)                            // 수정됨
  const deleteByTimestamp = (timestamp) => {            // 수정됨
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

    // 삭제 후에도 목록 갱신 이벤트 날려도 됨 (선택 사항)        // 수정됨
    window.dispatchEvent(new Event(RECENT_WORDS_EVENT)); // 수정됨
  };

  return {
    wordList,
    deleteByTimestamp,
  };
};
