import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../css/page.css';

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

  useEffect(() => {
    axios
      .get('/api/mypage/scraped')
      .then((res) => {
        if (res && res.data) {
          // 백엔드에서 { id, category, title, ... } 배열 준다고 가정
          setScrapList(res.data);
        }
      })
      .catch((err) => {
        console.error('스크랩 목록 조회 실패:', err);
        // 에러 나면 더미 데이터 유지
      });
  }, []);

  const handleClickTitle = (article) => {
    navigate(`/${article.category}/News/${article.id}`);
  };

  return (
    <div className="recent-box" style={{ marginBottom: '5000px' }}>
      <h4 className="recent-title">스크랩한 뉴스</h4>

      {scrapList.length === 0 ? (
        <p className="recent-empty">스크랩한 기사가 없습니다.</p>
      ) : (
        <ul className="recent-list">
          {scrapList.map((article) => (
            <li
              key={article.id} /* 스크랩뉴스 반응형 */
              className="recent-item"
              onClick={() => handleClickTitle(article)}
            > <span className="recent-item-title">{article.title}</span><button className="btn btn-secondary btn-sm btn-scrap">X</button>{/* 스크랩뉴스 반응형 여기까지*/}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Scrap;
