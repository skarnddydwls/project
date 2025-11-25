// src/pages/Economy.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap';
import '../pages/page.css';

const Economy = ({ category }) => {
  const [newsList, setNewsList] = useState([]);

  // 메인 기사용 더미 데이터
  const dummyNews = [
    {
      article_id:null,
      id: 1,
      category:null,
      date:null,
      url:null,
      title:null,
      content:null,
      simplified_content:null,
      summary_content:null,
      title: "연말 앞두고 초콜릿·케이크… 디저트 가격 경쟁!",
      img: "https://cdn.mediatoday.co.kr/news/photo/202511/330317_471899_445.jpg"
    },
    {
      article_id:null,
      id: 2,
      category:null,
      date:null,
      url:null,
      title:null,
      content:null,
      simplified_content:null,
      summary_content:null,
      title: "원·달러 1500원 막자…정부 ‘환율 방어’ 총력",
      img: "https://kita.net/editordata/20251124/4DCEBE4014D1448C97E60456FBEC592E"
    },
    {
      article_id:null,
      id: 3,
      category:null,
      date:null,
      url:null,
      title:null,
      content:null,
      simplified_content:null,
      summary_content:null,
      title: "기업 실적 반등 조짐…내년 경기 회복 기대감↑",
      img: "https://img.newspim.com/news/2023/11/01/2311011126502320.jpg"
    }
  ];

  // 오른쪽 “최근 본 뉴스”용 더미
  const recentNews = [
    { id: 101, title: "초등학생도 이해하는 기준금리란?" },
    { id: 102, title: "용돈 모아서 투자하기 전에 알아야 할 것" },
    { id: 103, title: "물가가 오르면 왜 힘들어질까?" },
    { id: 104, title: "은행 적금이랑 예금은 뭐가 다를까?" },
  ];

  useEffect(() => {
    axios
      .get('https://bold-seal-only.ngrok-free.app/test', {
        headers: { 'ngrok-skip-browser-warning': '1' },
        params: { category }
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNewsList(res.data);
        } else if (Array.isArray(res.data.data)) {
          setNewsList(res.data.data);
        } else {
          console.error('응답 구조를 알 수 없음 → 더미 사용');
          setNewsList(dummyNews);
        }
      })
      .catch((err) => {
        console.error('API 실패 → 더미 사용:', err);
        setNewsList(dummyNews);
      });
  }, [category]);

  return (
    <Container className="news-container">
      <Row>
        {/* 왼쪽: 메인 뉴스 리스트 */}
        <Col className="news-main-col">
          <h2 className="section-title">경제</h2>

          {newsList.map((news) => (
            <Row key={news.id} className="news-row">
              <Col md={9} xs={8}>
                <h3 className="newsTitle">{news.title}</h3>
                {/* 필요하면 요약/날짜 나중에 추가 */}
              </Col>
              <Col md={3} xs={4}>
                <img
                  src={news.img}
                  alt={news.title}
                  className="news-thumb"
                />
              </Col>
            </Row>
          ))}
        </Col>

        {/* 오른쪽: 최근 본 뉴스 (폭 300px 정도) */}
        <Col md="auto" className="news-recent-col">
          <div className="recent-box">
            <h4 className="recent-title">최근 본 뉴스</h4>
            <ul className="recent-list">
              {recentNews.map((item) => (
                <li key={item.id} className="recent-item">
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Economy;
