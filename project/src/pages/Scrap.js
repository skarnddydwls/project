import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import xIcon from '../img/x-icon.svg';
import { Button, Col, Form, Row } from 'react-bootstrap';

const Scrap = () => {
  const navigate = useNavigate();

  const [scrapList, setScrapList] = useState([
    {
      id: 201,
      category: '경제',
      title: '원·달러 환율 급등, 우리 생활에 미치는 영향은?'
    },
    {
      id: 202,
      category: '사회',
      title: '청년층 주거 안정 대책, 어떤 내용이 담겼나'
    },
    {
      id: 203,
      category: '문화',
      title: '문화제 보호 정책이 일상에 미치는 영향'
    }
  ]);
  const scrapBtn = async (e, article) => {
    e.stopPropagation(); // li 클릭 이벤트 막기

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('로그인 후 이용 가능합니다.');
        return;
      }

      await axios.delete(`/mypage/scraped/${article.id}`, {
        data: { userId }
      });

      // 화면에서 목록에서도 제거
      setScrapList(prev =>
        prev.filter(item => item.id !== article.id)
      );

      alert('스크랩 해제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('스크랩 해제 중 오류가 발생했습니다.');
    }
  };

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
    

  const handleDelete = async (e, article) => {
    e.stopPropagation(); // 제목 클릭 이벤트 막기

    try {
      const userId = localStorage.getItem("userId");

      await axios.delete(`/mypage/scraped/${article.id}`, {
        data: { userId }
      });

      setScrapList(prev => prev.filter(item => item.id !== article.id));
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("스크랩 해제에 실패했습니다.");
    }
  };

  const handleClickTitle = (article) => {
    navigate(`/${article.category}/News/${article.id}`);
  };

  const deleteItem = (id) => {
  setScrapList(scrapList.filter(list => list.id !== id));
  }


  return (
    <div className="recent-box" style={{ marginBottom: '5000px' }}>
      <h4 className="recent-title">스크랩한 뉴스</h4>

      {scrapList.length === 0 ? (
        <p className="recent-empty">스크랩한 기사가 없습니다.</p>
      ) : (
        <ul className="recent-list">
          {scrapList.map((article) => (
            <li
              key={article.id}
              className="recent-item"
              // onClick={() => handleClickTitle(article)}
            > <span className="recent-item-title">{article.title}</span>
            <Button 
              className="scrap-delete-btn"
              onClick={()=>{
              deleteItem(article.id)
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
