import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {Container, Nav, Navbar, Row, Col, Button} from 'react-bootstrap';
import { Route, Routes, useNavigate} from 'react-router-dom'
import Signin from './pages/Signin';
import Signup from './pages/Signup';
<<<<<<< HEAD
import Economy from './pages/Economy';
import Science from './pages/Science';
import Society from './pages/Society';
import History from './pages/History';
import Environment from './pages/Environment';

=======
import History from './pages/History';
import Economy from './pages/Economy';
import Environment from './pages/Environment';
import Society from './pages/Society';
import Science from './pages/Science';
>>>>>>> fbdc2052fd20894e2e9d66d322d9f5ef3f514b76

function App() {
  const [tab, setTab] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  let navigate = useNavigate();
  
  // 

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" style={{height: '80px'}}>
        <Container style={{fontSize: '20px'}}>
          <Nav>
            <Nav.Link onClick={() => {navigate('/')}}>뉴스모아</Nav.Link>
<<<<<<< HEAD
            <Nav.Link onClick={() => {navigate('/')}}>경제</Nav.Link>
            <Nav.Link onClick={() => {navigate('/')}}>과학</Nav.Link>
            <Nav.Link onClick={() => {navigate('/')}}>사회</Nav.Link>
            <Nav.Link onClick={() => {navigate('/')}}>역사</Nav.Link>
            <Nav.Link onClick={() => {navigate('/')}}>환경</Nav.Link>

=======
            <Nav.Link onClick={() => {navigate('/Economy')}}>경제</Nav.Link>
            <Nav.Link onClick={() => {navigate('/Science')}}>과학</Nav.Link>
            <Nav.Link onClick={() => {navigate('/Society')}}>사회</Nav.Link>
            <Nav.Link onClick={() => {navigate('/History')}}>역사</Nav.Link>
            <Nav.Link onClick={() => {navigate('/Environment')}}>환경</Nav.Link>
>>>>>>> fbdc2052fd20894e2e9d66d322d9f5ef3f514b76
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
      
      <br/><br/><br/>

      <Routes>
        <Route path="/Signin" element={<Signin/>}></Route>
        <Route path="/Signup" element={<Signup/>}></Route>
        <Route path="/History" element={<History/>}></Route>
        <Route path="/Economy" element={<Economy/>}></Route>
        <Route path="/Environment" element={<Environment/>}></Route>
        <Route path="/Society" element={<Society/>}></Route>
        <Route path="/Science" element={<Science/>}></Route>
      </Routes>

    </>
  );
}

export default App;
