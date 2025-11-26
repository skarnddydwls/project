import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {Container, Nav, Navbar, Row, Col, Button} from 'react-bootstrap';
import { Route, Routes, useNavigate} from 'react-router-dom'
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import News from './pages/News';
import NewsCategory from './pages/NewsCategory';
import Footer from './pages/Footer';
import RecentNews from './pages/RecentNews';


function App() {
  // const [tab, setTab] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const [category, setCategory] = useState('');
  let navigate = useNavigate();
  
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" style={{height: '80px'}}>
        <Nav style={{marginLeft:"50px", alignItems:'center'}}>
          <Nav.Link style={{fontSize:'30px'}} onClick={() => {navigate('/')}}>뉴스모아</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory'); setCategory('경제')}}>경제</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory'); setCategory('과학')}}>과학</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory'); setCategory('사회')}}>사회</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory'); setCategory('역사')}}>역사</Nav.Link>
          <Nav.Link onClick={() => {navigate('/NewsCategory'); setCategory('환경')}}>환경</Nav.Link>
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
          {/* <Nav.Link onClick={()=>{navigate('/Signup')}}>회원가입</Nav.Link> */}
        </Nav>
      </Navbar>
      <Container>
        <Row>
          <Col md={9}>
            <br/>  
            <Routes>
              <Route path="/Signin" element={<Signin/>}></Route>
              <Route path="/Signup" element={<Signup/>}></Route>
              <Route path="/NewsCategory" element={<NewsCategory category={category}/>}></Route>

              <Route path='/:category/News/:id' element={<News/>}></Route>
            </Routes>
          </Col>
          {
            !loginUser ? <RecentNews/> : null
          }
        </Row>
      </Container>
      <Footer/>
    </>
  );
}

export default App;
