import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getOriginalImageUrl } from "./utils/getOriginalImageUrl";
import "../css/MainPage.css";



const MainPage = () => {
    const navigate = useNavigate();
    const [recommendList, setRecommendList] = useState([]);

    useEffect(() => {
        const timer = setTimeout(()=>{
            axios
                .get("/api/article/recommend")
                .then((res) => {
                    setRecommendList(res.data || []);
                })
                .catch((err) => {
                    console.error(err);
                    setRecommendList([]);
                });
            }, 300);

        return () => clearTimeout(timer);
    },[navigate]);

    if (recommendList.length === 0) {
        return null; // 또는 로딩/placeholder
    }

    const [first, ...rest] = recommendList;

    return (
        <>
            <Row>
            {/* 왼쪽: 가장 상단 1개 크게 */}
                <Col md={6} className="main-hero-col">
                    <div
                    className="main-hero-card"
                    onClick={() => navigate(`/${first.category}/News/${first.articleId}`)}
                    >
                    <h2 className="main-hero-title">{first.title}</h2>
                    <div className="main-hero-image-wrapper">
                        <img
                        src={getOriginalImageUrl(first.img)}
                        alt={first.title}
                        className="main-hero-image"
                        />
                    </div>
                    </div>
                </Col>

                {/* 오른쪽: 2,3,4,5… 리스트로 쭉 */}
                <Col md={6} className="main-right-col">
                    {rest.map((news) => (
                    <div
                        key={news.articleId}
                        className="main-small-item"
                        onClick={() =>
                        navigate(`/${news.category}/News/${news.articleId}`)
                        }
                    >
                        <h4 className="main-small-title">{news.title}</h4>
                        <img
                        src={getOriginalImageUrl(news.img)}
                        alt={news.title}
                        className="main-small-thumb"
                        />
                    </div>
                    ))}
                </Col>
            </Row>
        </>
    );
};



export default MainPage;

