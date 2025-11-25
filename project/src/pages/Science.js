import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container } from 'react-bootstrap';

const Science = ({category}) => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    axios
      .get('/api/article',{params:{category: category}})
      .then(res => setNewsList(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container>
      <h2 style={{ fontWeight: '700', marginBottom: '25px' }}>과학 뉴스</h2>

      <Row>
        {newsList.map(news => (
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

export default Science;