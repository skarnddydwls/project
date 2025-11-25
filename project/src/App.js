import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {Container, Nav, Navbar, Row, Col, Button} from 'react-bootstrap';
import Signin from './pages/Signin';
// import Signup from './pages/Signup';
import Signup1 from './pages/Signup1';

function App() {
  const [tab, setTab] = useState(null);
  
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" style={{height: '80px'}}>
        <Container style={{fontSize: '20px'}}>
          <Nav>
            <Nav.Link href="">경제</Nav.Link>
            <Nav.Link href="">정치</Nav.Link>
            <Nav.Link href="">사회</Nav.Link>
            <Nav.Link href="">IT</Nav.Link>
            <Nav.Link href="">연예</Nav.Link>
          </Nav>
          <Nav className='ms-auto'>
            <Nav.Link onClick={()=>{setTab(tab === 'Signin' ? null : 'Signin')}}>로그인</Nav.Link>
            <Nav.Link onClick={()=>{setTab(tab === 'Signup' ? null : 'Signup')}}>회원가입</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <br/><br/><br/>

      <Container>
        { tab === 'Signin' ? <Signin/> : null }
        { tab === 'Signup' ? <Signup1/> : null }
      </Container>
    </>
  );
}

export default App;
