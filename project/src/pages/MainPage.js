import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getOriginalImageUrl } from "./utils/getOriginalImageUrl";
import prevIcon from "../img/prevShift.svg";
import nextIcon from "../img/nextShift.svg";
import "../css/MainPage.css";

const dummyList = [
  { articleId: 1, category: "경제", title: "더미: 환율이 크게 상승했습니다", img: "https://mimgnews.pstatic.net/image/origin/214/2025/12/11/1467368.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 2, category: "사회", title: "더미: 사회적 이슈가 커지고 있습니다", img: "https://mimgnews.pstatic.net/image/origin/079/2025/12/11/4095095.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 3, category: "과학", title: "더미: 새로운 기술 발표 소식", img: "https://mimgnews.pstatic.net/image/origin/656/2025/12/11/159039.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 4, category: "세계", title: "더미: 해외 정책 변화가 있었습니다", img: "https://mimgnews.pstatic.net/image/origin/025/2025/12/11/3489154.jpg?type=nf220_150", summary: "요약 더미" },
  { articleId: 5, category: "문화", title: "더미: 문화 콘텐츠 트렌드 변화", img: "https://mimgnews.pstatic.net/image/origin/421/2025/12/11/8656598.jpg?type=nf220_150", summary: "요약 더미" },
];

function clampText(text = "", max = 110) {
  const t = String(text).replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max) + "…";
}



export default function MainPage() {
  const navigate = useNavigate();

  const [recommendList, setRecommendList] = useState(dummyList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [todayPeople, setTodayPeople] = useState([]);
  const [partyStats, setPartyStats] = useState([
    { partyName: "더불어민주당", mentionCount: 380 },
    { partyName: "국민의힘", mentionCount: 450 },
    { partyName: "무소속", mentionCount: 120 }
  ]);

  // 정당별 색상 매핑
  const getPartyColor = (partyName) => {
    const colorMap = {
      "더불어민주당": "#003B96",
      "국민의힘": "#E61E2B", 
      "조국혁신당": "#0073CF",
      "개혁신당": "#FF7210",
      "진보당": "#D6001C",
      "기본소득당": "#00D2C3",
      "사회민주당": "#F58400",
      "무소속": "#808080"
    };
    return colorMap[partyName] || "#808080";
  };


  useEffect(() => {
    axios
      .get("/api/article/recommand")
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


    // 오늘의 인물 API (언급 순위)
    axios
      .get("/api/stat/ranked-person")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setTodayPeople(res.data);
        }
      })
      .catch(() => {});

    // 정당별 언급 통계 API
    axios
      .get("/api/stat/party")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPartyStats(res.data);
        }
      })
      .catch(() => {});

  }, []);



  useEffect(() => {
    if (!recommendList.length || paused) return;
    const id = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % recommendList.length);
    }, 1000);
    return () => clearInterval(id);
  }, [recommendList, paused]);

  const current = recommendList[currentIndex] || dummyList[0];

  const goPrev = () => {
    setCurrentIndex((p) => (p - 1 + recommendList.length) % recommendList.length);
  };

  const goNext = () => {
    setCurrentIndex((p) => (p + 1) % recommendList.length);
  };


  
  
  const goArticle = (a) => {
    const category = a?.category;
    const id = a?.articleId;
    if (!category || !id) return;
    navigate(`/${encodeURIComponent(category)}/News/${id}`);
  };

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
          <div className="mp-hero-gradient" />
          <button
            type="button"
            className="mp-hero-arrow mp-hero-prev"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="이전"
          >
            <img src={prevIcon} alt="이전" />
          </button>
          <button
            type="button"
            className="mp-hero-arrow mp-hero-next"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="다음"
          >
            <img src={nextIcon} alt="다음" />
          </button>
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
              <div className="mp-card-title">조회수 Top 5</div>
              <div className="mp-toplist news-top5">
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

        <Col lg={6}>
          <Card className="mp-card">
            <Card.Body>
              <div className="mp-card-title">오늘의 인물</div>
              <div className="mp-toplist">
                {todayPeople.map((p, i) => (
                  <div
                    key={p.personName}
                    className="mp-topitem"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/search?keyword=${encodeURIComponent(p.personName)}`)}
                  >
                    <div className="mp-rank">
                      {todayPeople.filter((item, idx) => idx < i && item.mentionCount > p.mentionCount).length + 1}
                    </div>

                    <div className="mp-toptext">
                      {p.name} 
                      <span style={{ color: '#64748B', fontSize: '12px' }}>&ensp; {p.mentionCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          

        </Col>
      </Row>
                      <div style={{ height: '16px' }}></div>
      <Card className="mp-card">
            <Card.Body>
              <div className="mp-card-title">정당별 언급 통계</div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={partyStats.map((p) => ({
                      name: p.partyName,
                      value: p.mentionCount
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={125}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {partyStats.map((p, index) => (
                      <Cell key={`cell-${index}`} fill={getPartyColor(p.partyName)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
          <div style={{ height: '32px' }}></div>
    </Container>
  );
}
