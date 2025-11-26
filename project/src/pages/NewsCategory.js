import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom'
import '../css/page.css';

const NewsCategory = ({category}) => {
    const [newsList, setNewsList] = useState([]);
    const [recentNews, setRecentNews] = useState([
        { id: 101, title: "초등학생도 이해하는 기준금리란?" },
        { id: 102, title: "용돈 모아서 투자하기 전에 알아야 할 것" },
        { id: 103, title: "물가가 오르면 왜 힘들어질까?" },
        { id: 104, title: "은행 적금이랑 예금은 뭐가 다를까?" }
    ]);
    let navigate = useNavigate();

    useEffect(() => {
        axios
        .get('/api/article',{params:{category: category}})
        .then(res => setNewsList(res.data))
        .catch(err => console.error(err));
    }, []);

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
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF24J9D2dpVJ97vJ63D0ZS5BoM2hJyOVz5gefsfF5SxPjeUT5ZIRcC7KpfBck2ks6Tlr8g2Vx_dRtUikBGUflgsNr5SENXZQzsDz_091TW&s=10"
        }
    ];

    return (
        <Container className="news-container">
            <Row>
            <Col className="news-main-col">
                <h2 className="section-title">{category}</h2>

                {dummyNews.map((news) => (
                <Row key={news.id} className="news-row">
                    <Col md={9} xs={8}>
                    <h3 onClick={()=> {navigate(`/${category}/News/${news.id}`)}} className="newsTitle">{news.title}</h3>
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
            </Row>
        </Container>
    );
}

export default NewsCategory;