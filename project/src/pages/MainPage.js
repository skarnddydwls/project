import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getOriginalImageUrl } from "./utils/getOriginalImageUrl";
import "../css/MainPage.css";

const dummyList = [
  {
    articleId: 1,
    category: "경제",
    title: "더미 뉴스 1: 환율이 크게 상승했습니다",
    img: "https://mimgnews.pstatic.net/image/origin/214/2025/12/11/1467368.jpg?type=nf220_150",
  },
  {
    articleId: 2,
    category: "사회",
    title: "더미 뉴스 2: 사회적 이슈가 커짐",
    img: "https://mimgnews.pstatic.net/image/origin/079/2025/12/11/4095095.jpg?type=nf220_150",
  },
  {
    articleId: 3,
    category: "과학",
    title: "더미 뉴스 3: 새로운 기술 발표",
    img: "https://mimgnews.pstatic.net/image/origin/656/2025/12/11/159039.jpg?type=nf220_150",
  },
  {
    articleId: 4,
    category: "세계",
    title: "더미 뉴스 4: 해외 정책 변화",
    img: "https://mimgnews.pstatic.net/image/origin/025/2025/12/11/3489154.jpg?type=nf220_150",
  },
  {
    articleId: 5,
    category: "문화",
    title: "더미 뉴스 5: 해외 정책 변화",
    img: "https://mimgnews.pstatic.net/image/origin/421/2025/12/11/8656598.jpg?type=nf220_150",
  },
];

export default function MainPage() {
  const navigate = useNavigate();

  const [recommendList, setRecommendList] = useState(dummyList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // 마우스 오버 시 true

  // 🔸 추천 뉴스 API 호출 (성공하면 API 데이터, 실패하면 더미 유지)
  useEffect(() => {
    axios
      .get("/api/article/recommend")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setRecommendList(data);
          setCurrentIndex(0);
        } else {
          // 데이터 없으면 더미 유지
          setRecommendList(dummyList);
          setCurrentIndex(0);
        }
      })
      .catch((err) => {
        console.error("추천 기사 API 오류, 더미데이터 사용:", err);
        setRecommendList(dummyList);
        setCurrentIndex(0);
      });
  }, []);

  // 10초마다 자동 순환 (마우스 오버 시 일시정지)
  useEffect(() => {
    if (recommendList.length === 0 || isPaused) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendList.length);
    }, 900); // 10초

    return () => clearInterval(intervalId);
  }, [recommendList, isPaused]);

  if (!recommendList || recommendList.length === 0) {
    return null;
  }

  const current = recommendList[currentIndex];

  const handleClickArticle = (article) => {
    if (!article.category || !article.articleId) return;
    navigate(`/${article.category}/News/${article.articleId}`);
  };

  return (
    <Row className="main-container">
      {/* 왼쪽: 메인 큰 카드 */}
      <Col md={6} className="main-hero-col">
        <div
          key={current.articleId} // 키 바뀔 때마다 페이드 애니메이션 재생
          className="main-hero-card fade-in"
          onClick={() => handleClickArticle(current)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <br/><br/><br/>
          <div className="main-hero-image-wrapper">
            <img
              src={getOriginalImageUrl(current.img)}
              alt={current.title}
              className="main-hero-image"
            />
          </div>
          <h2 className="main-hero-title">{current.title}</h2>
        </div>
      </Col>

      {/* 오른쪽: 나머지 리스트 */}
      <Col md={6} className="main-right-col">
        <h2><b>오늘의 조회수 Top 5</b></h2>
        <br/><br/>
        {recommendList.map((news) => (
          <div
            key={news.articleId}
            className="main-small-item"
            onClick={() => handleClickArticle(news)}
          >
            <h4 className="main-small-title">{news.title}</h4>
          </div>
        ))}
      </Col>
    </Row>
  );
}
