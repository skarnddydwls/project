import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Search from './Search';
import fillScrap from '../img/fill-scrap.svg';
import blankScrap from '../img/blank-scrap.svg';


const dummyNews = [
    {
      article_id: 1,
      category: `economy`,
      date: `2025. 11. 21`,
      url: `https://v.daum.net/v/20251121200606474`,
      title: `환율 급등 직격탄…유학생 가정·원자재 수입 업체 '한숨'`,
      content: "서울 아파트값이 다시 오름세를 보이고 있다. 한국부동산원이 발표한 자료에 따르면, 10월 첫째 주 서울 아파트값은 한 주 만에 0.43% 상승했다. 특히 강남, 마포 등 주요 지역에서 가격 오름폭이 컸다. 저금리와 대출 규제 완화 영향으로 2030세대의 ‘영끌’(영혼까지 끌어모은 대출) 수요도 다시 늘어나는 추세다. 전문가들은 하반기에도 거래 회복세가 이어질 것으로 내다본다. 한편, 정부는 부동산 금융 리스크에 대비해 대출 총량 관리 등 추가 대책을 내놓을 계획이다.",
      simplified_content: "최근 서울의 아파트 가격이 다시 오르고 있다. 한국부동산원이 발표한 조사에 따르면 이번 달 들어서만 강남구와 마포구 같은 인기 지역을 중심으로 집값이 빠르게 비싸졌다고 한다. 이 때문에 집을 사려는 2030세대(20~30대)들이 대출을 많이 받아 무리하게 집을 사려는 ‘영끌’이 또 다시 늘고 있다. 전문가들은 금리가 낮고 대출 규제가 조금 풀리면서 이런 현상이 나타난다고 설명한다. 올해 가을에도 이런 집값 오름세와 거래가 이어질 거라는 예측이 많다. 정부는 만일의 위험에 대비해 전체 대출 관리와 같은 대책을 추가로 내놓겠다고 했다.",
      summary_content: "서울 아파트값이 다시 오르고 있다. 강남, 마포 등에서 가격이 많이 올랐다. 2030세대의 대출을 활용한 주택 매수도 증가하는 추세다. 금리와 대출 규제 영향이 크다고 전문가들은 분석한다. 정부는 금융 리스크 관리 방안을 준비 중이다."
    } 
  ];

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
  
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   const found = dummyNews.find(item => String(item.article_id) === id);
  //   setNews(found);
  //   if(found) {
  //     setShowText(found.simplified_content);
  //   }
  // }, [id]);

  // 스크랩 버튼 눌렀을 때 호출되는 함수
  const handleScrap = async () => {
    try {
      const userId = localStorage.getItem('userId'); // 로그인 시 저장해둔 값이라고 가정

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
      await axios.put('mypage/scraped', {                // 나중에 목록 수정 요
        userId: userId,           // your_article.user_id
        articleId: news.article_id // your_article.article_id
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
      {/* <button onClick={handleScrap} className="scrap-btn">
        <img
          src={isScraped ? fillScrap : blankScrap}
          alt="scrap"
          className='scrap-icon'
        />
      </button> */}
      <section style={{ marginTop: '32px' }}>
         <Search content={showText} />
      </section>
  </div>
  )
}

export default News;
