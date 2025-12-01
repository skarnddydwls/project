import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Search from './Search';
import fillScrap from '../img/fill-scrap.svg';
import blankScrap from '../img/blank-scrap.svg';

const News = () => {
  const {id} = useParams();
  const [news, setNews] = useState(null);
  const [showText, setShowText] = useState();
  const [readingState, setReadingState] = useState('simplified');
  const [isScraped, setIsScraped] = useState(false);

  useEffect(() => {
    axios.get(`/api/article/id/${id}`)
         .then((response) => {
            setNews(response.data); 
         })
         .catch((error) => {
          console.log(error);
         });
  }, [id]);

  if (!news) {
    return <div>Loading...</div>;
  }

  const handleScrap = async () => {
    try {
      const userId = localStorage.getItem('userId'); 

      if (!userId) {
        alert('로그인 후 이용 가능합니다.');
        return;
      }
      // 이미 스크랩한 상태 → 스크랩 해제
      if (isScraped) {
        await axios.delete(`mypage/scraped/${news.article_id}`, {
          data: { userId }
        });
        setIsScraped(false);
        alert('스크랩 해제되었습니다.');
        return;
      }
      // 스크랩되어 있지 않다면 → 스크랩 추가
      await axios.put('mypage/scraped', {                
        userId: userId,           
        articleId: news.article_id 
      });
      setIsScraped(true);
      alert('스크랩 완료!');
    } catch (err) {
      console.error(err);
      alert('스크랩 중 오류가 발생했습니다.');
    }
  };

  if (!news) {
    return null;
  }

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
            setShowText(news.simplified_content)
          }
          }}>{readingState === 'simplified' ? '본문 보기' : '해석 보기'}</Button> &emsp;
        <Button variant="outline-success" onClick={() => {setShowText(news.summary_content)}}>요약 보기</Button> &emsp;

        {/* <Button variant="outline-success">본문 보기</Button> */}
        <button onClick={handleScrap} className="scrap-btn">
          <img
            src={isScraped ? fillScrap : blankScrap}
            alt="scrap"
            className='scrap-icon'
          />
        </button>
      </div>

      <section style={{ marginTop: '32px' }}>
         <Search content={showText} />
      </section>
  </div>
  )
}

export default News;
