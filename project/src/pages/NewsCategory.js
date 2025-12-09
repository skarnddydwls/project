import { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router-dom'
import '../css/page.css';


const NewsCategory = () => {
    const {category} = useParams();
    const [newsList, setNewsList] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        axios
        .get(`/api/article/${category}`)
        .then(res => setNewsList(res.data))
        .catch(err => console.error(err));

        console.log(`newsCategory: ${sessionStorage.getItem('loginUser')}`)
    }, [category]);
    
        return (
        <Container className="news-container">
            <Row>
            <Col>
                <h2 className="section-title">{category}</h2>
                {newsList.map((news) => (
                <Row key={news.id} className="news-row">
                    <Col md={6} xs={3}>
                    <h3 onClick={()=> {navigate(`/${category}/News/${news.articleId}`)}} className="newsTitle">{news.title}</h3>
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