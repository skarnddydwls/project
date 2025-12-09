import { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/page.css';


const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");

    useEffect(() => {

        if (!keyword) return;

        setLoading(true);
        setError(null);

        axios.get(`/api/article/search/`, { params: { keyword :  keyword }})
         .then((res) => {
            const { articles } = res.data;
            setResults(articles || []);
         })
         .catch((error) => {
            console.error("검색 오류:", error);
         })
         .finally(() => {
            setLoading(false);
         });
    }, [keyword]);

    const handleClickArticle = (article) => {
        // 상세 페이지 이동 (기존 패턴 그대로)
        if (!article.category || !article.articleId) return;
        navigate(`/${article.category}/News/${article.articleId}`);
    };

return (
    <Container className="news-container">
        <h3>🔎 "{keyword}" 검색 결과</h3>
        {loading && (
            <div style={{ marginTop: '16px' }}>
            <Spinner animation="border" size="sm" /> 검색 중...
            </div>
        )}

        {error && (
            <p style={{ marginTop: '16px', color: 'red' }}>{error}</p>
        )}
        {!loading && !error && (
        <>
            <p style={{ marginTop: '8px' }}>총 {results.length}건</p>
            {results.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
            ) : (
                results.map((article) => (
                <Row key={article.articleId}
                        className="news-row"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleClickArticle(article)}>    
                <Col xs={9}>
                    <h5 className="newsTitle">{article.title}</h5>
                    {article.summary && (
                        <p className="news-summary">{article.summary}</p>
                    )}
                </Col>
                <Col xs={3}>    
                    <h2 className="section-title">{ keyword }</h2>
                    {article.img && (
                        <img
                            src={article.img}
                            alt={article.title}
                            className="news-thumb"
                            style={{ width: '100%' }}
                        />
                    )}
                </Col>
            </Row>
            )))}
        </>
    )}
    </Container>
    );
}

export default Search;