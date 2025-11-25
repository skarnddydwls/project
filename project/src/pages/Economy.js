import React from 'react';
import axios from 'axios';
import { Card, Row, Col, Container } from 'react-bootstrap';

const dummyNews = [
  {
    id: 1,
    title: "한국 경제성장률 2.2% 전망",
    summary: "전문가들은 글로벌 경기 회복에 따라 올해 한국의 경제성장률이 2%대를 유지할 것으로 예상하고 있다.",
    img: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    title: "원·달러 환율 급등",
    summary: "환율 변동성이 커지면서 수출 기업들의 대응 전략이 중요해지고 있다.",
    img: "https://via.placeholder.com/150"
  }
];

export default function Economy() {
  return (
    <Container>
      <h2 style={{ fontWeight: '700', marginBottom: '25px' }}>경제 뉴스</h2>

      <Row>
        {dummyNews.map(news => (
          <Col key={news.id} md={6} style={{ marginBottom: '20px' }}>
            <Card style={{ cursor: 'pointer' }}>
              <Row className="g-0">
                <Col md={4}>
                  <Card.Img src={news.img} />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>{news.title}</Card.Title>
                    <Card.Text style={{ fontSize: '14px', color: '#555' }}>
                      {news.summary}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
