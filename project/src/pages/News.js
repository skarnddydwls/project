import { useParams } from 'react-router-dom';
import { use, useEffect, useState} from 'react';
import axios from 'axios';


const News = () => {
  const { category, id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

{/* 서버에서 받을 경우 */}
/* const News = () => {
  const { category, id } = useParams();
  const [news, setNews] = useState(null);
  
  useEffect(() => {
    axios.get(`/api/news/${category}/${id}`)
    .then((response) => {
        setNews(response.data); 
    })
    .catch((error) => {
      console.log(error);
    });
  }, [id, category]);
  if (!news) {
    return <div>Loading...</div>;
  }*/



  const dummyNews = [
    {
      article_id:1,
      category:`economy`,
      date:`2025. 11. 21`, 
      url:`https://v.daum.net/v/20251121200606474`,
      title:`환율 급등 직격탄…유학생 가정·원자재 수입 업체 '한숨'`,
      content:null,
      simplified_content:`유학생 자녀가 있는 집에서는 환율이 많이 오르면서 바로 돈이 더 드는 느낌을 받고 있다. 가공식품을 만드는 회사나, 해외에서 재료를 사 오는 회사들도 비용이 늘어 걱정이 커지고 있다.
        2년 전부터 미국에 아들 두 명을 유학 보낸 A 씨는 요즘 한숨을 쉬는 일이 많아졌다. 2년 전에는 1달러를 사려면 천2백90원 정도였는데, 지금은 천4백90원 정도가 되어 15% 넘게 올랐기 때문이다. 한 명당 매년 학비, 생활비, 용돈 등으로 수천만 원이 드는데, 그 큰 비용이 환율 때문에 더 늘어나 부담이 훨씬 크게 느껴지고 있다. A 씨는 물가까지 올라서 실제로는 25%에서 30% 정도 더 비싸진 기분이라고 말했다. 그래서 아이들에게 최대한 아껴 쓰라고 자주 말하고 있다.
        A 씨 주변의 다른 학부모들과 유학 관련 인터넷 모임에서도 비슷한 걱정이 나오고 있다. 만약 환율이 1달러당 1천6백 원대까지 올라가면 정말 감당하기 힘들 것 같다는 이야기와 유학을 다시 고민해야겠다는 말이 많이 나오고 있다.
        원재료 대부분을 해외에서 들여오는 회사들도 상황이 좋지 않다. 국내에서 가장 큰 초콜릿 판매 회사는 작년에 크게 올랐던 카카오 가격이 조금 내려 안정됐지만, 환율이 올라서 재료비가 여전히 비싸진 탓에 좋아진 점이 전혀 없다. 라면이나 식용유를 만드는 회사들도 비슷한 어려움을 겪고 있다. 대두유나 팜유 같은 재료를 사오는 데 드는 돈은 늘었는데, 제품을 해외로 파는 양은 그만큼 늘지 않아서 힘들어하고 있다. 식품업계 관계자는 환율 때문에 이익이 줄어드는데 수출은 천천히 늘어 전체적으로 회사들이 돈 벌기가 더 어려워지고 있다고 설명했다.
        옷감 등을 만드는 섬유업계도 걱정이 많다. 해외에서 사 오는 실의 가격이 오르고, 물건을 실어나르는 컨테이너 비용도 계속 올라 회사의 부담이 크다. 섬유업계 관계자인 이동규 씨는 환율이 10원만 올라도 한 달에 수백만 원에서 수천만 원까지 비용이 더 드는 상황이라고 말했다.
        이렇게 회사들의 비용이 늘고 수익이 줄면, 결국 제품 가격을 올릴 수밖에 없는 상황이 될 수 있다. 그렇게 되면 소비자들이 사야 하는 물건 값이 더 비싸져서 물가가 높아질 가능성이 있다는 걱정이 나오고 있다.`,
      summary_content:`환율이 많이 오르면서 유학 보낸 집들은 학비와 생활비가 더 비싸져서 걱정이 커지고 있다. A 씨처럼 미국에 두 아들을 보낸 부모들은 환율 때문에 몇 년 사이 비용이 크게 늘었다고 말하고 있다. 주변 부모들도 환율이 더 오르면 유학을 계속할지 고민해야겠다는 분위기다.
        또한 초콜릿 회사나 라면·식용유 회사처럼 원재료를 외국에서 사오는 업체들은 재료 값과 운송비가 올라 힘들어하고 있다. 섬유업계도 환율이 조금만 올라가도 큰 추가 비용이 생겨 부담이 크다.
        이런 상황 때문에 회사들의 수익이 줄어들고, 결국 물건값이 더 오를 수 있다는 걱정이 나오고 있다.`
      }
  ];





  const news = dummyNews.find(item => item.article_id == id);

  return(
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>

      <h1>{news.title}</h1>  {/*  */}
      <p style={{ color: '#666', fontSize: '14px' }}>
        {news.date}  {news.category}
      </p>

      <section style={{ marginTop: '24px' }}>
        <h2>요약</h2>
        <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {news.summary_content}
        </p>
      </section>

      <section style={{ marginTop: '32px' }}>
        <h2>해석 본문</h2>
        <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {news.simplified_content}
        </p>
      </section>
  </div>
  )
}

export default News;