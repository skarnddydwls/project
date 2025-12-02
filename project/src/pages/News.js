import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
// import Search from './Search';
import fillScrap from '../img/fill-scrap.svg';
import blankScrap from '../img/blank-scrap.svg';
import TextDrag from "./TextDrag.js";



const News = () => {
  const {id} = useParams();
  const [news, setNews] = useState(null);
  const [showText, setShowText] = useState();
  const [readingState, setReadingState] = useState('simplified');
  const [isScraped, setIsScraped] = useState(false);

  // useEffect(() => {
  //   axios.get(`/api/article/id/${id}`)
  //        .then((response) => {
  //           setNews(response.data); 
  //           setShowText(response.data.simplified_content);
  //        })
  //        .catch((error) => {
  //         console.log(error);
  //        });
  // }, [id]);

  useEffect(() => {
    // 1. 임시 더미데이터
    const dummyNews = {
      article_id: 999,
      title: "더미 기사 제목입니다",
      date: "2025-12-02",
      category: "경제",
      content: `반감기 이후 12~18개월까지 상승장이 이어진다는 4년 주기 비트코인 사이클이 이번에도 반복돼 직전 반감기(2024년 4월)에서 18개월이 지난 올해 10월부터 하락장이 시작됐을 확률을 65~80%로 보고 있다. 챗GPT는 75~80%라고 하더라(웃음).

→ 비트코인은 보통 ‘반감기’(채굴 보상이 절반으로 줄어드는 시기) 뒤에 1년에서 1년 반 정도 가격이 오르는 장이 이어지는, 이른바 ‘4년 주기’ 패턴이 있습니다. 이번에도 그 패턴이 다시 나타나서, 2024년 4월 반감기 이후 18개월이 지난 2025년 10월쯤부터 하락장이 시작됐을 가능성이 65~80% 정도 된다고 본다는 뜻입니다. 챗GPT에 물어보니 75~80%라고 나오더라는 농담을 덧붙인 말입니다.

“비트코인 가격이 26일 오후 12시 30분 기준 8만7913달러(약 1억2900만 원)까지 후퇴하며 올해 상승분을 모두 반납한 상황에서 올가을 대두됐던 ‘사이클 연장론’의 실현을 기대하기는 어렵다는 것이다.”

→ 11월 26일 낮 12시 30분 기준으로 비트코인 가격이 8만7913달러(약 1억2900만 원)까지 떨어지면서, 올해 오른 폭을 사실상 전부 되돌려 놓은 상황이 되었습니다. 이런 상황에서는 올가을에 나왔던 ‘이번에는 상승장이 10월 이후까지 더 길게 이어질 것’이라는 주장(사이클 연장론)이 실제로 맞을 거라고 기대하기 어렵다는 의미입니다.

“올해 10월 6일 찍은 사상 최고치 12만6251달러(약 1억8600만 원)는 빨라도 2027년은 돼야 회복할 수 있을 것”이라며 “고점에 물린 사람들은 단기적 반등이 왔을 때 팔고 손 터는 게 낫다”고 조언했다.

→ 2025년 10월 6일에 기록한 비트코인 사상 최고가 12만6251달러(약 1억8600만 원)는, 아무리 빨라도 2027년 정도가 되어야 다시 그 수준까지 올라갈 수 있을 것이라고 본다는 말입니다. 그래서 비싼 가격(고점) 근처에서 비트코인을 산 사람들은, 이후에 잠깐 가격이 튀어 오를 때 정리를 하고 나오는 것이 낫다고 조언하는 것입니다.

“9월까지만 해도 비트코인 시장에서 2개 이론이 팽팽히 맞섰다. 과거 되풀이됐던 4년 주기 사이클이 올해도 실현된다는 이론과 사이클이 연장돼 상승장이 10월 이후에도 이어진다는 이론이었다. 현 상황을 보면 전자가 맞는 것 같다.”

→ 2025년 9월까지만 해도 비트코인 시장에는 크게 두 가지 주장이 있었습니다. 하나는 예전처럼 4년 주기 사이클이 그대로 반복된다는 주장이고, 다른 하나는 이번에는 예전보다 상승장이 더 길게 가서 10월 이후에도 오름세가 이어질 거라는 ‘사이클 연장’ 주장입니다. 지금 상황을 보면, 결국 예전처럼 4년 주기가 반복된다는 쪽이 맞는 것 같다는 뜻입니다.

“떨어진 가격 폭의 절반 정도를 회복하고 다시 떨어지는 모습은 비트코인뿐 아니라 대다수 자산의 하락장에서 흔히 발견된다. 따라서 사상 최고치에서 8만 달러대까지 약 4만5000달러 하락한 상황에서 비트코인 가격이 10만4000달러까지 회복되는 것은 상승 추세의 기미로 해석하기 어렵다.`,
      simplified_content: `를 엿보고 있었을 것이다. 그러다 10월 초 도널드 트럼프 미국 대통령이 중국에 추가 관세를 매기겠다는 발언을 했을 때 매도를 시작한 것 같다. 2023~2024년에는 고래가 비트코인을 많이 팔아도 기관투자자들이 매수해 가격이 크게 떨어지지 않았다. 이번에는 시장에 유동성이 부족해 가격 하락을 막아줄 매수 세력이 없었다.”

→ 10~15년 전부터 비트코인에 투자해 온 큰손(‘고래’) 투자자들은 4년 주기가 반복되는 모습을 실제로 여러 번 봐 온 사람들이라, 2025년 10월이 되자 ‘이제 팔 때가 온다’고 보면서 기회를 보고 있었을 것이라는 뜻입니다. 그러다가 10월 초, 도널드 트럼프 미국 대통령이 중국에 추가 관세를 부과하겠다고 말했을 때를 계기로 매도를 시작한 것으로 보인다는 설명입니다. 2023~2024년에는 고래들이 비트코인을 많이 팔아도 기관투자자들이 그 물량을 사들여서 가격이 크게 떨어지지 않았지만, 이번에는 시장에 돈(유동성)이 부족해서 이렇게 받아주는 세력이 없었고, 그 결과 가격 하락이 더 크게 나타났다는 이야기입니다.

“올해 하반기부터 유동성이 본격적으로 늘어나면 비트코인 상승장도 올해 말이나 내년 초까지 연장될 수 있다는 논리였다. 그런데 글로벌 M2(광의통화)가 6월 30일까지 늘어나다가 이후 횡보하고 있다.”

→ ‘사이클 연장론’은 이렇게 설명합니다. 2025년 하반기부터 전 세계에 돈이 많이 풀리기 시작하면, 비트코인 상승장도 올해 말이나 내년 초까지 길게 이어질 수 있다는 논리였습니다. 그런데 실제 데이터를 보면, 세계 전체 통화량을 나타내는 지표인 글로벌 M2(광의 통화)가 6월 30일까지는 늘다가, 그 이후에는 거의 늘어나지 않고 옆으로 기는 모습이라 이 논리가 깨졌다는 뜻입니다.

“그럴 가능성은 적다. 금리인하 하나로는 당장 글로벌 통화량을 급진적으로 늘리기 어렵기 때문이다. 통화량이 크게 늘려면 ①연준이 12월에 양적긴축(QT)을 종료하고 ②기준금리를 내리며 ③미국 정부가 양적완화 정책을 시행해 시장에 돈을 풀고 ④금융기관이 대출을 많이 내줘야 하며 ⑤이런 일을 미국뿐 아니라 유럽, 중국, 일본 등 다른 나라도 함께해야 한다. 그런데 요즘 유럽이나 중국도 경기가 좋은 편이 아니라서 금융기관이 한동안은 대출을 잘 내주지 않을 것 같다.”

→ “단지 금리를 조금 내리는 것만으로는 세계 전체 돈의 양을 빠르게 크게 늘리기는 어렵기 때문에, 상승장이 다시 길게 이어질 가능성은 낮다”는 말입니다. 돈의 양이 확 늘어나려면, 첫째 미국 중앙은행(연준)이 12월에 양적긴축(QT)을 멈추고, 둘째 기준금리를 내리고, 셋째 미국 정부가 양적완화로 시장에 돈을 직접 풀고, 넷째 은행들이 대출을 적극적으로 내주고, 다섯째 이런 일들이 미국만이 아니라 유럽·중국·일본 등 주요 나라에서도 함께 일어나야 합니다. 그런데 유럽과 중국 경제가 요즘 좋지 않아, 은행들이 당분간은 대출을 공격적으로 늘리기 어렵다고 보는 것입니다.`,
      summary_content: `도로 추정된다. 10년 뒤 비트코인 보급률이 60~80%가 되면 비트코인 가격은 100만 달러까지 오를 수 있다.”

→ 지금은 전 세계 사람들 중 약 8% 정도만 비트코인을 갖고 있는 것으로 추정됩니다. 그런데 10년 후에는 비트코인을 가진 사람이 전 세계 인구의 60~80% 수준까지 늘어날 수 있다고 보고, 그렇게 보급률이 크게 오르면 비트코인 가격도 100만 달러까지 갈 수 있다는 논리입니다. 인터넷, 스마트폰, 넷플릭스 등 다른 신기술도 보급률이 8%를 넘고 나서 10~12년 사이에 60~80%까지 확 퍼졌다는 점을 근거로 듭니다.

“현재 비트코인을 갖고 있나. ‘하나도 없다. 비트코인 가격이 10만8000달러대로 내려왔을 때 절반 이상 팔고 10만3000달러대에서 나머지를 모두 팔았다. 원래는 가격이 120일 이동평균선 아래로 내려오면 파는데 이번에는 더 늦게 팔았다. 비트코인이 원래 10월에 강세를 보였던 터라 가격이 다시 오르리라고 생각한 게 패착이었다. 앞으로 가격이 120일 이동평균선 위로 올라오거나 글로벌 M2가 고점을 뚫으면 다시 매수할 계획이다.’”

→ 지금은 비트코인을 한 개도 가지고 있지 않다고 말합니다. 비트코인 가격이 10만8000달러대로 내려왔을 때 보유 물량의 절반 이상을 팔고, 10만3000달러대에서 나머지도 전부 팔았다고 합니다. 원래 본인 매매 원칙은 “가격이 120일 이동평균선 아래로 내려오면 판다”인데, 이번에는 그 기준보다 더 늦게 팔았다고 합니다. 비트코인이 예전부터 10월에 강한 모습을 보였기 때문에, 이번에도 다시 오를 것이라고 생각한 것이 실수였다고 평가합니다. 앞으로는 가격이 120일 이동평균선 위로 다시 올라오거나, 글로벌 M2가 이전 고점을 뚫고 늘어나는 게 확인되면 다시 비트코인을 살 계획이라고 덧붙입니다.`,
      debugExamples: [
        { word: "inflation", sentence: "The inflation rate increased last month." },
        { word: "economy", sentence: "The economy is showing signs of recovery." }
      ],
    };

    // 2. 바로 더미로 상태 세팅
    setNews(dummyNews);
    setShowText(dummyNews.simplified_content); // 처음에는 해석본 보여주기

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

        <button onClick={handleScrap} className="scrap-btn">
          <img
            src={isScraped ? fillScrap : blankScrap}
            alt="scrap"
            className='scrap-icon'
          />
        </button>
      </div>

      <section style={{ marginTop: '32px' }}>
        {/*<Search content={showText} />*/}
        <TextDrag
          text={showText}
          articleId={news.article_id}
          section={readingState}
        />
      </section>
  </div>
  )
}

export default News;
