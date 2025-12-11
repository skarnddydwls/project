// src/pages/Navigation/hooks/useNavigation.js
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();

  // 카테고리 목록
  const categories = ["경제", "과학", "사회", "세계", "문화"];

  // 더보기 계산용 ref & 상태
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(categories.length);

  const calculateVisible = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < categories.length; i++) {
      const btn = buttonRefs.current[i];
      if (!btn) continue;

      const btnWidth = btn.offsetWidth;

      if (totalWidth + btnWidth < containerWidth - 80) {
        totalWidth += btnWidth;
        count++;
      } else {
        break;
      }
    }

    if (count === 0) {
      setVisibleCount(1);
    } else {
      setVisibleCount(count);
    }
  };

  const [loginUser, setLoginUser] = useState(
    sessionStorage.getItem("loginUser")
  );
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const trimmed = keyword.trim();
    if (!trimmed) return;

    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleClickCategory = (name) => {
    navigate(`/NewsCategory/${encodeURIComponent(name)}`);
  };

  return {
    // 네비 공통
    navigate,

    // 카테고리/더보기 관련
    categories,
    containerRef,
    buttonRefs,
    visibleCount,
    calculateVisible,
    handleClickCategory,

    // 로그인/검색 관련
    loginUser,
    setLoginUser,
    keyword,
    setKeyword,
    handleSearch,
  };
};
