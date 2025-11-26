import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container } from 'react-bootstrap';

const RecentNews = () => {

    const [recentNews, setRecentNews] = useState([
        { id: 101, title: "초등학생도 이해하는 기준금리란?" },
        { id: 102, title: "용돈 모아서 투자하기 전에 알아야 할 것" },
        { id: 103, title: "물가가 오르면 왜 힘들어질까?" },
        { id: 104, title: "은행 적금이랑 예금은 뭐가 다를까?" }
    ]);

    // useEffect(() => {
    //     axios.get(``)
    //      .then(result => {
    //         if(result){
    //             setRecentNews(result.data);
    //         } else {
    //             alert("오류 발생");
    //         }
    //      })
    //      .catch((error) => {
    //         setRecentNews([

    //         ])
    //      })
    // },[])

    return(
        <>
            <Col md="auto" className="news-recent-col" style={{marginTop: '50px'}}>
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
        </>
    )
}

export default RecentNews;