import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import fillScrap from '../img/fill-scrap.svg';
import blankScrap from '../img/blank-scrap.svg';
import TextDrag from "./TextDrag.js";

const News = () => {
  const {id} = useParams() ;
  const [news, setNews] = useState(null);
  const [showText, setShowText] = useState();
  const [readingState, setReadingState] = useState('simplified');
  const [isScraped, setIsScraped] = useState(false);
  

  const getUserId = () => {
    const storedUser = sessionStorage.getItem('loginUser');
    if(!storedUser) return null;
    try {
      return JSON.parse(storedUser).id
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    console.log(id)
    axios.get(`/api/article/id/${id}`)
         .then((response) => {
            setNews(response.data); 
            setShowText(response.data.simplified_content);
         })
         .catch((error) => {
          console.log(error);
         });

    if(userId) {
      axios.get(`/api/mypage/scraped`, { withCredentials: true })
           .then((res) => {
            const myScrapList = res.data;
            const isExist = myScrapList.some(item => item.articleId == id);
            setIsScraped(isExist);
           })
           .catch(() => {
            console.log("씨발 실패했다,,")
           })
    }
  }, [id]);

  if (!news) {
    return <div>Loading...</div>;
  }
  
  const handleScrap = async () => {
    try {
      const userId = getUserId();
      console.log(`userId: ${userId}`)

      if (!userId) {
        alert('로그인 후 이용 가능합니다.');
        return;
      }

      // 이미 스크랩한 상태 → 스크랩 해제
      if (isScraped) {
        await axios.delete(`/api/mypage/scraped?article_id=${id}`, {
          data: { userId: userId }
        });
        setIsScraped(false);
        alert('스크랩 해제되었습니다.');
        return;
      }

      // 스크랩되어 있지 않다면 → 스크랩 추가
      await axios.put(`/api/mypage/scraped?article_id=${id}`, {                
        userId: userId  // put은 두 번째 인자가 바로 바디라서 delete와 다르게 이렇게 보내야 됨
      });
      setIsScraped(true);

      alert('스크랩 완료!');
    } catch (err) {
      console.error(err);
      alert('스크랩 중 오류가 발생했습니다.');
    }
  };


  return(
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>

      <h1>{news.title}</h1> 
      <p style={{ color: '#666', fontSize: '14px' }}>
        {news.date}  {news.category}
      </p>

      <div className='news-btn-row' style={{ marginTop: '16px' }}>
        <Button variant="outline-success" onClick={() => {
          if(readingState === 'simplified'){
            setReadingState('content');
            setShowText(news.content);
          } else if(readingState === 'content'){
            setReadingState('simplified');
            setShowText(news.simplified)
          }
          }}>{readingState === 'simplified' ? '본문 보기' : '해석 보기'}</Button> &emsp;
        <Button variant="outline-success" onClick={() => {setShowText(news.summary)}}>요약 보기</Button> &emsp;

        <button onClick={handleScrap} className="scrap-btn">
          <img
            src={isScraped ? fillScrap : blankScrap}
            alt="scrap"
            className='scrap-icon'
          />
        </button>
      </div>

      <section style={{ marginTop: '32px' }}>
        <TextDrag
          text={showText}
          articleId={news.articleId}
          section={readingState}
        />
      </section>
  </div>
  )
}

export default News;
