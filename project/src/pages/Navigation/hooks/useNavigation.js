import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export const useNavigation = () => {

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
  };
}; 