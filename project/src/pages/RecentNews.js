import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';

const RecentNews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [recentNews, setRecentNews] = useState([]);
    const storedUser = sessionStorage.getItem('loginUser');

    const fetchRecentNews = useCallback(()=>{
        axios.get(`/api/mypage/recent`, { withCredentials: true })
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
    }, [])
    
    useEffect(() => {
        fetchRecentNews();
        const handleView = () => {
            fetchRecentNews();
        };
        window.addEventListener('articleViewed', handleView);
        return () => {
            window.removeEventListener('articleViewed', handleView);
        }

    },[location.pathname, fetchRecentNews]);

    const handleClickTitle = (e, article) => {
        e.preventDefault(); 

        if(!article.category || !article.articleId) {
            alert(article);
            return;
        }
        navigate(`/${article.category}/News/${article.articleId}`);
    };

    const handleViewAll = () => {
        navigate('/scrap', {state: {targetTab: 'recent'}})
    }

    // 조건이 여러개일 경우는 함수로 이용하면 가독성이 좋아진다

    const renderContent = () => {
        // 조건1. 로그인
        if(!storedUser) {
            return <p style={{color: 'gray'}}>로그인 후 이용가능합니다.</p>
        }

        if(recentNews.length === 0) {
            return <p className="recent-empty">최근 본 뉴스가 없습니다.</p>
        }

        return(
            <ul className="recent-list">
            {recentNews.slice(0,5).map((item) => (
                <li key={item.articleId} className="recent-item">
                <span style={{cursor: 'pointer'}} className="recent-item-title" onClick={(e) => handleClickTitle(e, item)}>{item.title}</span>
                </li>
            ))}
            </ul>
        )
    }

    return(  
        <div className="recent-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 className="recent-title" style={{ margin: 0 }}>최근 본 뉴스</h4>
                <span 
                    onClick={handleViewAll} 
                    style={{ fontSize: '13px', color: '#242222ff', cursor: 'pointer' }}
                >
                    전체보기 &gt;
                </span>
            </div>
            {renderContent()}
        </div>
    )
}

export default RecentNews;