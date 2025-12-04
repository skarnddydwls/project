import { useEffect, useState } from 'react';
import axios from 'axios';

const RecentNews = () => {

    const [recentNews, setRecentNews] = useState([]);

    useEffect(() => {
        axios.get(`/api/mypage/recent`)
         .then(result => {
            if(result){
                setRecentNews(result.data);
            } else {
                alert("오류 발생");
            }
         })
    
         .catch((error) => {
            setRecentNews([
                console.log(`${error}났다 씨발,,,`)
            ])
         })
    },[])

    return(  
        <div className="recent-box" style={{marginTop:'50px'}}>
        <h4 className="recent-title">최근 본 뉴스</h4>
        {recentNews.length === 0 ? (
            <p className="recent-empty">최근 본 뉴스가 없습니다.</p>
        ) : (
            <ul className="recent-list">
            {recentNews.map((item) => (
                <li key={item.id} className="recent-item">
                <span className="recent-item-title">{item.title}</span>
                </li>
            ))}
            </ul>
        )}
        </div>
    )
}

export default RecentNews;