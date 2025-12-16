import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Badge, Card, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getOriginalImageUrl } from "./utils/getOriginalImageUrl";

import RecentNews from "./RecentNews";
import Scrap from "./Scrap";
import RecentWords from "./recentWords/RecentWords";

import "../css/MainPage.css";

const dummyList = [
  { articleId: 1, category: "경제", title: "더미: 환율이 크게 상승했습니다", img: "https://mimgnews.pstatic.net/image/origin/214/2025/12/11/1467368.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 2, category: "사회", title: "더미: 사회적 이슈가 커지고 있습니다", img: "https://mimgnews.pstatic.net/image/origin/079/2025/12/11/4095095.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 3, category: "과학", title: "더미: 새로운 기술 발표 소식", img: "https://mimgnews.pstatic.net/image/origin/656/2025/12/11/159039.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 4, category: "세계", title: "더미: 해외 정책 변화가 있었습니다", img: "https://mimgnews.pstatic.net/image/origin/025/2025/12/11/3489154.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 5, category: "문화", title: "더미: 문화 콘텐츠 트렌드 변화", img: "https://mimgnews.pstatic.net/image/origin/421/2025/12/11/8656598.jpg?type=nf220_150", summary: "요약 더미" },
];

const CATEGORIES = ["경제", "과학", "사회", "세계", "문화"];

function clampText(text = "", max = 110) {
  const t = String(text).replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max) + "…";
}



export default function MainPage() {
  const navigate = useNavigate();

  const [recommendList, setRecommendList] = useState(dummyList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [keyword, setKeyword] = useState("");

  const loginUser = useMemo(() => sessionStorage.getItem("loginUser"), []);

  useEffect(() => {
    axios
      .get("/api/article/recommend")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setRecommendList(data);
          setCurrentIndex(0);
        } else {
          setRecommendList(dummyList);
          setCurrentIndex(0);
        }
      })
      .catch(() => {
        setRecommendList(dummyList);
        setCurrentIndex(0);
      });
  }, []);

  useEffect(() => {
    if (!recommendList.length || paused) return;
    const id = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % recommendList.length);
    }, 9000);
    return () => clearInterval(id);
  }, [recommendList, paused]);

  const current = recommendList[currentIndex] || dummyList[0];


  const goSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    navigate(`/search?keyword=${encodeURIComponent(q)}`);
  };

  const goCategory = (name) => {
    navigate(`/NewsCategory/${encodeURIComponent(name)}`);
  };
  
  const goArticle = (a) => {
    const category = a?.category;
    const id = a?.articleId;
    if (!category || !id) return;
    navigate(`/${encodeURIComponent(category)}/News/${id}`);
  };

  const todayKeywords = ["환율", "금리", "AI", "물가", "반도체", "부동산"];

  return (
    <Container className="mp-wrap">
      <div
        className="mp-hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => goArticle(current)}
        role="button"
        tabIndex={0}
      >
        <div className="mp-hero-media">
          <img className="mp-hero-img" src={getOriginalImageUrl(current.img)} alt={current.title} />
          <div className="mp-hero-badges">
          </div>
          <div className="mp-hero-gradient" />
        </div>

        <div className="mp-hero-body">
          <div className="mp-hero-title">{current.title}</div>
          <div className="mp-hero-desc">{clampText(current.summary || current.simplified || "요약 준비 중")}</div>

          <div className="mp-dots" onClick={(e) => e.stopPropagation()}>
            {recommendList.slice(0, 6).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`mp-dot ${idx === currentIndex ? "is-on" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`추천 ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>



      <Row className="mp-bottom">
        <Col lg={6}>
          <Card className="mp-card">
            <Card.Body>
              <div className="mp-card-title">오늘의 키워드</div>
              <div className="mp-chips">
                {todayKeywords.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="mp-kchip"
                    onClick={() => navigate(`/search?keyword=${encodeURIComponent(k)}`)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="mp-card">
            <Card.Body>
              <div className="mp-card-title">Top 5</div>
              <div className="mp-toplist">
                {recommendList.slice(0, 5).map((a, i) => (
                  <div key={a.articleId} className="mp-topitem" role="button" tabIndex={0} onClick={() => goArticle(a)}>
                    <div className="mp-rank">{i + 1}</div>
                    <div className="mp-toptext">{a.title}</div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
