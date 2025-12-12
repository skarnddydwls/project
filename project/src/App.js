import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, } from "react-bootstrap";
import { Route, Routes, } from 'react-router-dom'
import { Signin, Signup, News, NewsCategory, Footer, RecentNews, Scrap,
   ScrapPage, Search, MainPage, RecentWords, Navigation } from './pages';
import { useNavigation } from "./pages/Navigation/hooks/useNavigation"

function App() {
  const { loginUser } = useNavigation();

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navigation/>
      <Container className='flex-grow-1 mt-5'>
        <Row>
          <Col md={9} className=''>
            <br/>  
            <Routes>
              <Route path="/" element={<MainPage/>}></Route>
              <Route path="/Signin" element={<Signin/>}></Route>
              <Route path="/Signup" element={<Signup/>}></Route>
              <Route path="/NewsCategory/:category" element={<NewsCategory/>}></Route>
              <Route path='/:category/News/:id' element={<News/>}></Route>
              <Route path='/scrap' element={<ScrapPage/>}></Route>
              <Route path='/search' element={<Search />}/>
            </Routes>
          </Col>

          <Col md={3} className="news-recent-col">
          {/* 스크랩한 뉴스 */}
          { loginUser ? (
            <>
              <RecentNews/>
              <hr/>
              <Scrap/>
              <hr/>
              <RecentWords/>
            </>
              ) : null }
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
}

export default App;
