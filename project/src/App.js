import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {Container, Nav, Navbar, Row, Col, Button} from 'react-bootstrap';
import { Route, Routes, useNavigate} from 'react-router-dom'
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import History from './pages/History';
import Economy from './pages/Economy';
import Environment from './pages/Environment';
import Society from './pages/Society';
import Science from './pages/Science';


function App() {
  const [tab, setTab] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const [category, setCategory] = useState('');
  let navigate = useNavigate();
  
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" style={{height: '80px'}}>
        <Container style={{fontSize: '20px'}}>
          <Nav>
            <Nav.Link onClick={() => {navigate('/')}}>뉴스모아</Nav.Link>
            <Nav.Link onClick={() => {navigate('/Economy'); setCategory('Economy')}}>경제</Nav.Link>
            <Nav.Link onClick={() => {navigate('/Science'); setCategory('Science')}}>과학</Nav.Link>
            <Nav.Link onClick={() => {navigate('/Society'); setCategory('Society')}}>사회</Nav.Link>
            <Nav.Link onClick={() => {navigate('/History'); setCategory('History')}}>역사</Nav.Link>
            <Nav.Link onClick={() => {navigate('/Environment'); setCategory('Environment')}}>환경</Nav.Link>

          </Nav>
          <Nav className='ms-auto'>
            <Nav.Link onClick={()=> {
              if(loginUser) {
                sessionStorage.removeItem('loginUser');
                setLoginUser(null);
                navigate('/');
              } else {
                navigate('/Signin');
              }
              }}>{loginUser ? '로그아웃' : '로그인'}</Nav.Link>
            <Nav.Link onClick={()=>{navigate('/Signup')}}>회원가입</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      
      <br/><br/>
      <Routes>
        <Route path="/Signin" element={<Signin/>}></Route>
        <Route path="/Signup" element={<Signup/>}></Route>
        <Route path="/History" element={<History category={category}/>}></Route>
        <Route path="/Economy" element={<Economy category={category}/>}></Route>
        <Route path="/Environment" element={<Environment category={category}/>}></Route>
        <Route path="/Society" element={<Society category={category}/>}></Route>
        <Route path="/Science" element={<Science category={category}/>}></Route>
      </Routes>
    </>
  );
}

export default App;
