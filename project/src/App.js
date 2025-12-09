import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import {Container, Nav, Navbar, Row, Col, Button, Form, InputGroup} from 'react-bootstrap';
import { Route, Routes, useNavigate} from 'react-router-dom'
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import News from './pages/News';
import NewsCategory from './pages/NewsCategory';
import Footer from './pages/Footer';
import RecentNews from './pages/RecentNews';
import Scrap from './pages/Scrap';
import RecentWords from './pages/recentWords/RecentWords';
import Search from './pages/Search';


function App() {
  const [loginUser, setLoginUser] = useState(sessionStorage.getItem('loginUser'));
  const [category, setCategory] = useState('');
  let navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  // 클릭 시 실행할 함수 (텍스트 전달됨)
  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const trimmed = keyword.trim();
    if (!trimmed) return;
    
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      {console.log("App: "+sessionStorage.getItem('loginUser'))}
      <Navbar bg="dark" data-bs-theme="dark" style={{height: '80px'}}>
        <Nav style={{marginLeft:"50px", alignItems:'center'}}>
          <Nav.Link style={{fontSize:'30px'}} onClick={() => {navigate('/')}}>뉴스모아</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory/경제'); setCategory('경제')}}>경제</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory/과학'); setCategory('과학')}}>과학</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory/사회'); setCategory('사회')}}>사회</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory/세계'); setCategory('세계')}}>세계</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory/문화'); setCategory('문화')}}>문화</Nav.Link>
        </Nav>
        <Nav className="nav-search ms-auto">
          <Form inline onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Search"
                aria-label="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}/>
              <Button type="submit" variant="secondary">🔍</Button>
            </InputGroup>
          </Form>
        </Nav>
        <Nav className='ms-auto' style={{marginRight:'100px'}}>
          
          <Nav.Link onClick={()=> {
            if(loginUser) {
              sessionStorage.removeItem('loginUser');
              setLoginUser(null);
              navigate('/');
            } else {
              navigate('/Signin');
            }
            }}>{loginUser ? '로그아웃' : '로그인'}</Nav.Link>
            <Nav.Link onClick={()=>{
            if(!loginUser) {
              navigate('/Signup')
            }
          }}>{loginUser ? loginUser.id : "회원가입"}</Nav.Link>
        </Nav>
      </Navbar>
      <Container>
        <Row>
          <Col md={9}>
            <br/>  
            <Routes>
              <Route path="/Signin" element={<Signin/>}></Route>
              <Route path="/Signup" element={<Signup/>}></Route>
              <Route path="/NewsCategory/:category" element={<NewsCategory/>}></Route>
              <Route path='/:category/News/:id' element={<News/>}></Route>
              <Route path='/search' element={<Search/>}></Route>
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
    </>
  );
}

export default App;
