import React, { useEffect, useState} from "react";
import axios from "axios";
import { Container, Row, Col, Card} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getOriginalImageUrl } from "./utils/getOriginalImageUrl";
import prevIcon from "../img/prevShift.svg";
import nextIcon from "../img/nextShift.svg";
import "../css/MainPage.css";

function clampText(text = "", max = 110) {
  const t = String(text).replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max) + "…";
}

const renderLabel = ({name, percent}) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

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

  const PartyPieChart = React.memo(({ partyStats }) => {
    return (
      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie
            data={partyStats.map((p) => ({
              name: p.name,
              value: p.mentionCount
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel} // 밖에서 만든 함수 사용
            outerRadius={160}
            fill="#8884d8"
            dataKey="value"
          >
            {partyStats.map((p, index) => (
              <Cell key={`cell-${index}`} fill={getPartyColor(p.name)} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
    );
  });

export default function MainPage() {
  const navigate = useNavigate();
  const [recommendList, setRecommendList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [todayPeople, setTodayPeople] = useState([]);
  const [partyStats, setPartyStats] = useState([]);
  const storedUser = localStorage.getItem("loginUser");

  useEffect(() => {
    axios
      .get("/api/article/recommand")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setRecommendList(data);
          setCurrentIndex(0);
        }
      })
      .catch(() => {
        console.error("추천 기사 불러오기 실패");
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
    }, 10000);
    return () => clearInterval(id);
  }, [recommendList, paused]);

  const current = recommendList[currentIndex];

  // 데이터 로딩 중
  if (!current) {
    return (
      <Container className="mp-wrap">
        <div style={{ textAlign: "center", padding: "100px 0", color: "#64748B" }}>
          데이터를 불러오는 중입니다...
        </div>
      </Container>
    );
  }

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
        onClick={() => {
          if(storedUser){
            goArticle(current)
          } else {
            alert("로그인 후 이용가능합니다.")
            navigate('/Signin');
          }
          }}
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
                  <div key={a.articleId} className="mp-topitem" role="button" tabIndex={0} onClick={() => {
                    if(storedUser){
                      goArticle(a)
                    } else {
                      alert("로그인 후 이용가능합니다.")
                      navigate('/Signin');
                    }
                    }}>
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
                    key={p.name}
                    className="mp-topitem"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/search?keyword=${encodeURIComponent(p.name)}`)}
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
              <PartyPieChart partyStats={partyStats} />
            </Card.Body>
          </Card>
          <div style={{ height: '32px' }}></div>
    </Container>
  );
}
