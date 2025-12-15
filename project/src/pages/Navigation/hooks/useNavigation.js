import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = ["경제", "과학", "사회", "세계", "문화"];

export const useNavigation = () => {
  const navigate = useNavigate();

  const categories = useMemo(() => CATEGORIES, []);

  // 실제로 "보이는 영역" 폭을 재는 컨테이너
  const containerRef = useRef(null);

  // 폭 측정 전용(항상 5개 렌더) 버튼 refs
  const measureBtnRefs = useRef([]);
  const measureMoreRef = useRef(null);

  const [visibleCount, setVisibleCount] = useState(categories.length);

  const [loginUser, setLoginUser] = useState(sessionStorage.getItem("loginUser"));
  const [keyword, setKeyword] = useState("");

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch (e) {
      console.error(e);
    } finally {
      sessionStorage.removeItem("loginUser");
      sessionStorage.removeItem("recent_news");
      sessionStorage.removeItem("recent_word_meanings");
      setLoginUser(null);
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
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.getBoundingClientRect().width;

    const btnWidths = categories.map((_, i) => {
      const el = measureBtnRefs.current[i];
      if (!el) return 0;
      return el.getBoundingClientRect().width;
    });

    const moreWidth = measureMoreRef.current
      ? measureMoreRef.current.getBoundingClientRect().width
      : 0;

    // 경계 흔들림 완충
    const EPS = 2;

    // 5 -> 4 -> 3 ... 순으로 내려가며 "들어가는 최대치" 찾기
    let best = 1;

    for (let k = categories.length; k >= 1; k--) {
      const sum = btnWidths.slice(0, k).reduce((a, b) => a + b, 0);
      const needMore = k < categories.length ? moreWidth : 0;

      if (sum + needMore <= containerWidth - EPS) {
        best = k;
        break;
      }
    }

    setVisibleCount(best);
  }, [categories]);

  useEffect(() => {
    // 초기 렌더 직후 폰트/부트스트랩 적용 타이밍 때문에 2프레임 보정
    calculateVisible();
    const r1 = requestAnimationFrame(calculateVisible);
    const r2 = requestAnimationFrame(calculateVisible);

    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(calculateVisible);
    });

    if (el) ro.observe(el);
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

    containerRef,
    measureBtnRefs,
    measureMoreRef,
    visibleCount,

    loginUser,
    setLoginUser,
    handleLogout,

    keyword,
    setKeyword,
    handleSearch,

    handleClickCategory,
  };
};
