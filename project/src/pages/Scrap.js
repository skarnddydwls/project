import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import xIcon from '../img/x-icon.svg';
import { Button} from 'react-bootstrap';

const Scrap = () => {
  const navigate = useNavigate();
  const [scrapList, setScrapList] = useState([]);
  const storedUser = sessionStorage.getItem('loginUser');
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    axios
      .get('/api/mypage/scraped')
      .then((res) => {
        if (res && res.data) {
          setScrapList(res.data);
        }
      })
      .catch((err) => {
        console.error('스크랩 목록 조회 실패:', err);
      });
  }, []);

  const handleDelete = async (e, articleId) => {
    e.stopPropagation(); // 제목 클릭 이벤트 막기

    try {
      await axios.delete(`/api/mypage/scraped?article_id=${articleId}`, {
        data: { userId: userId }
      });
      setScrapList(prev => prev.filter(item => item.articleId !== articleId));
    } catch (err) {
      
    }
  };

  const handleClickTitle = (e, article) => { // 넘겨주는건 e를 같이 넘겨줬는데 안 받아서 그럼
    navigate(`/${article.category}/News/${article.articleId}`);
  };

  return (
    <div className="recent-box" style={{ marginBottom: '500px' }}>
      <h4 className="recent-title">스크랩한 뉴스</h4>

      {scrapList.length === 0 ? (
        <p className="recent-empty">스크랩한 기사가 없습니다.</p>
      ) : (
        <ul className="recent-list">
          {scrapList.map((article) => (
            <li
              key={article.articleId}
              className="recent-item"
              onClick={(e) => handleClickTitle(e, article)}
            > <span className="recent-item-title">{article.title}</span>

            <Button 
              className="scrap-delete-btn"
              onClick={(e)=>{
              handleDelete(e, article.articleId)
            }}
            >
              <img src={xIcon} alt="delete" className="scrap-delete-icon" />
            </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Scrap;
