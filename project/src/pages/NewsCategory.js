import { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router-dom'
import '../css/page.css';
import Button from 'react-bootstrap/Button';


const NewsCategory = () => {
    const {category} = useParams();
    const [newsList, setNewsList] = useState([]);
    const [limit, setLimit] = useState(5);
    
    let navigate = useNavigate();

    useEffect(() => {
        axios
        .get(`/api/article/${category}`)
        .then((res) => {
            setNewsList(res.data)
        })
        .catch(err => console.error(err));

    }, [category]);

        return (
        <Container className="news-container">
            <Row>
            <Col >
                <h2 className="section-title">{category}</h2>

                {newsList.slice(0,limit).map((news) => (
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

                {limit < newsList.length && ( // limit가 list 크기보다 작을 때만 보여짐
                    <div className="d-grid mt-4">
                        <Button variant="secondary" size="lg" onClick={() => setLimit(limit + 5)}>
                            더 보기
                        </Button>
                    </div>
                )}
            </Col>
            </Row>
        </Container>
    );
}

export default NewsCategory;