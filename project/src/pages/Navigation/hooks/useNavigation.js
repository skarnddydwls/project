import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
    

  // 카테고리 목록
  const categories = ["경제", "과학", "사회", "세계", "문화"];

  // 더보기 계산용
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(categories.length);

  const calculateVisible = () => {
  if (!containerRef.current) return;

  // 컨테이너 실제 렌더 폭(소수 포함)
  const rawContainer = containerRef.current.getBoundingClientRect().width;

  // 소수 흔들림 방지: 컨테이너는 내림(=실제로 쓸 수 있는 안전 폭)
  const containerWidth = Math.floor(rawContainer);

  // 더보기 드롭다운 + 여유폭(경계에서 튀는 것 방지)
  const RESERVED = 130;

  const available = Math.max(0, containerWidth - RESERVED);

  let total = 0;
  let count = 0;

  for (let i = 0; i < categories.length; i++) {
    const btn = buttonRefs.current[i];
    if (!btn) continue;

    // 버튼은 올림(=버튼이 실제로 차지할 수 있는 최대 폭으로 보수적으로)
    const btnWidth = Math.ceil(btn.getBoundingClientRect().width);

    if (total + btnWidth <= available) {
      total += btnWidth;
      count++;
    } else {
      break;
    }
  }

  setVisibleCount(Math.max(1, count));
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
    navigate,

    categories,
    containerRef,
    buttonRefs,
    visibleCount,
    calculateVisible,
    handleClickCategory,

    loginUser,
    setLoginUser,
    keyword,
    setKeyword,
    handleSearch,
  };
};
