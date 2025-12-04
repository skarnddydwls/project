import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const RecentNews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [recentNews, setRecentNews] = useState([]);

    useEffect(() => {
        axios.get(`/api/mypage/recent`, { withCredentials: true }) // { withCredentials: true }
         .then(result => {
            if(result){
                setRecentNews(result.data);
            } else {
                alert("오류 발생");
            }
         })
         .catch((error) => {
            console.log(`${error} 발생`)
            setRecentNews([])
         })
    },[location.pathname]);

    const handleClickTitle = (e, article) => {
        e.preventDefault(); 

        if(!article.category || !article.articleId) {
            alert("오류오류!!", article);
            return;
        }

        console.log(`/${article.category}/News/${article.articleId} 로 갈게요 뿅!`)
        navigate(`/${article.category}/News/${article.articleId}`);
    };

    return(  
        <div className="recent-box" style={{marginTop:'50px'}}>
        <h4 className="recent-title">최근 본 뉴스</h4>
        {recentNews.length === 0 ? (
            <p className="recent-empty">최근 본 뉴스가 없습니다.</p>
        ) : (
            <ul className="recent-list">
            {recentNews.map((item) => (
                <li key={item.articleId} className="recent-item">
                <span style={{cursor: 'pointer'}} className="recent-item-title" onClick={(e) => handleClickTitle(e, item)}>{item.title}</span>
                </li>
            ))}
            </ul>
        )}
        </div>
    )
}

export default RecentNews;