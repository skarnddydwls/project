import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {Row, Col} from 'react-bootstrap';
import { useNavigate, useLocation} from 'react-router-dom'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';

const ScrapPage = () => {
    const [scrapList, setScrapList] = useState([]);
    const [recentList, setRecentList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const initialTab = location.state && location.state.targetTab ? location.state.targetTab : 'recent';
    const [key,setKey] = useState(initialTab);

    useEffect(()=>{
        axios.get('/api/mypage/scraped', { withCredentials: true })
           .then((res) => {
            if(res){
                setScrapList(res.data);
            }
           })
           .catch(() => {})
        
           axios.get(`/api/mypage/recent`, { withCredentials: true })
           .then((res)=>{
            if(res){
                setRecentList(res.data);
            }
           })
           .catch(()=>{})
    },[])

    return (
    <>
        <Tabs id="fill-tab-example" activeKey={key} className="mb-3" onSelect={(k)=> setKey(k)} fill>
            <Tab eventKey="recent" title="최근 본 뉴스">
                {recentList.map((news) => (
                <Row key={news.id} className="news-row">
                    <Col md={6} xs={3}>
                    <h3 onClick={()=> {navigate(`/${news.category}/News/${news.articleId}`)}} className="newsTitle">{news.title}</h3>
                    </Col>
                </Row>
                ))}
            </Tab>

            <Tab eventKey="scrap" title="스크랩 한 뉴스">
                {scrapList.map((news) => (
                <Row key={news.id} className="news-row">
                    <Col md={6} xs={3}>
                    <h3 onClick={()=> {navigate(`/${news.category}/News/${news.articleId}`)}} className="newsTitle">{news.title}</h3>
                    </Col>
                </Row>
                ))}
            </Tab>
        </Tabs>

        {/* 처음 클릭 때는 잘 되는데 scrap 페이지 안에서 전체보기 눌러도 바뀌게끔 하고 싶음 */}
    </>
  );
}

export default ScrapPage;