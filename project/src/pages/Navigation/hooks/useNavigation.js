import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export const useNavigation = () => {
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
        // 80px: 더보기 드롭다운 여유 공간
        totalWidth += btnWidth;
        count++;
      } else break;
    }

    setVisibleCount(count);
  };
  

  const [loginUser, setLoginUser] = useState(sessionStorage.getItem('loginUser'));
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  // 클릭 시 실행할 함수 (텍스트 전달됨)
  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const trimmed = keyword.trim();
    if (!trimmed) return;
    
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };
  return{
    setKeyword, keyword,
    setLoginUser, loginUser,
    handleSearch,
    calculateVisible
  };
}; 