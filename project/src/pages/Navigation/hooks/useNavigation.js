import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecentWords from "../../recentWords/RecentWords";

const CATEGORIES = ["경제", "과학", "사회", "세계", "문화"];

export const useNavigation = () => {
  const navigate = useNavigate();
  const categories = CATEGORIES;

  // 레이아웃 실측용 refs
  const navbarRef = useRef(null);
  const brandRef = useRef(null);
  const rightRef = useRef(null);
  const searchRef = useRef(null);

  // 오프스크린 측정용 refs (항상 렌더)
  const measureBtnRefs = useRef([]);
  const measureMoreRef = useRef(null);

  const [visibleCount, setVisibleCount] = useState(categories.length);

  const [loginUser, setLoginUser] = useState(sessionStorage.getItem("loginUser"));
  const user = JSON.parse(loginUser);
  const [keyword, setKeyword] = useState("");

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch (e) {
      console.error("logout api error", e);
    } finally {
      sessionStorage.removeItem("loginUser");
      sessionStorage.removeItem("recent_news");
      localStorage.removeItem("recent_word_meanings");
      RecentWords.wordList = [];
      setLoginUser(null);
      window.dispatchEvent(new Event("logout"));
      navigate("/");
    }
  }, [navigate]);

  const handleSearch = useCallback(
    (e) => {
      if (e) e.preventDefault();
      const trimmed = keyword.trim();
      if (!trimmed) return;
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    },
    [keyword, navigate]
  );

  const handleClickCategory = useCallback(
    (name) => {
      navigate(`/NewsCategory/${encodeURIComponent(name)}`);
    },
    [navigate]
  );

const calculateVisible = useCallback(() => {
  const brand = brandRef.current;
  const right = rightRef.current;
  const search = searchRef.current;

  if (!brand || !right || !search) return;

  const br = brand.getBoundingClientRect();
  const rt = right.getBoundingClientRect();
  const se = search.getBoundingClientRect();

  // 카테고리가 실제로 시작하는 위치
  const startX = br.right;

  // 카테고리가 늘어날 수 있는 최대 오른쪽 한계(우측 메뉴 시작 전까지만)
  const endX = rt.left;

  // 검색창이 “막는” 시작점(왼쪽 경계)
  const blockX = se.left;

  // 카테고리는 startX부터 연속으로만 쌓이니까
  // 실제로 쓸 수 있는 폭은 "startX ~ min(endX, blockX)" 뿐임
  const hardStop = Math.min(endX, blockX);

  const GAP = 0;   // 약간의 여유(패딩/캐럿/반올림)
  const EPS = 0;   // 경계에서 가려지는 현상 방지용(2보다 크게)

  const available = Math.max(0, hardStop - startX - GAP);

  // 버튼 폭 측정(오프스크린)
  const btnWidths = categories.map((_, i) => {
    const el = measureBtnRefs.current[i];
    return el ? el.getBoundingClientRect().width : 0;
  });

  const moreW = measureMoreRef.current
    ? measureMoreRef.current.getBoundingClientRect().width
    : 0;

  let best = 0;
  for (let k = categories.length; k >= 0; k--) {
    const sum = btnWidths.slice(0, k).reduce((a, b) => a + b, 0);
    const needMore = k < categories.length ? moreW : 0;
    const need = sum + needMore;

    if (need <= available - EPS) {
      best = k;
      break;
    }
  }

  setVisibleCount(best);
}, [categories]);



  useEffect(() => {
    calculateVisible();
    const r1 = requestAnimationFrame(calculateVisible);
    const r2 = requestAnimationFrame(calculateVisible);

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(calculateVisible);
    });

    if (navbarRef.current) ro.observe(navbarRef.current);
    window.addEventListener("resize", calculateVisible);

    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      ro.disconnect();
      window.removeEventListener("resize", calculateVisible);
    };
  }, [calculateVisible]);

  return {
    navigate,
    categories,

    navbarRef,
    brandRef,
    rightRef,
    searchRef,

    measureBtnRefs,
    measureMoreRef,
    visibleCount,

    loginUser,
    user,
    setLoginUser,
    handleLogout,

    keyword,
    setKeyword,
    handleSearch,

    handleClickCategory,
  };
};
