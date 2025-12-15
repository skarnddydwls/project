  import { Button, Col, Form, Row } from 'react-bootstrap';
  import { useState } from 'react';
  import axios from 'axios';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import {useNavigate} from 'react-router-dom'

  const Signin = () => {
    let navigate = useNavigate();

    const [form, setForm] = useState({
      id: '',
      password: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({
         ...form, 
         [name]: value
        });
    };

    const handleSubmit = (e) => {
      e.preventDefault(); // 서버로 가는거 막아줌

      if(form.id === 'admin' && form.password === '1234'){
        const pw = prompt("암호를 입력하세요")
        if(pw === '123456789'){
          return navigate('/admin');
        } else if(pw === ''){
          alert("비밀번호를 입력하세요")
        } else {
          alert("땡!!")
          return;
        }
        
      }
      axios
        .post('/api/login', form, {withCredentials: true})
        .then((result) => {
          if (result.data === '로그인 성공') {
            alert('로그인 되었습니다');
            // sessionStorage.setItem('loginUser', form.id);
            const userInfo = {
              id: form.id,
              password: form.password,
            };
            sessionStorage.setItem('loginUser', JSON.stringify(userInfo));
            window.location.href = '/'; 
          } else {
            alert('이메일 또는 비밀번호가 일치하지 않습니다');
          }
        })
        .catch(() => {
          alert('로그인에 실패하였습니다'); 
        });

      
      }
    
    return (
  
      <div style={style.container}>
        <h1 style={style.title}>로그인</h1>
        <Form style={style.form} onSubmit={handleSubmit}>
          {/* ID */}
          <Form.Group as={Row} className="mb-3" controlId="id">
            <Form.Label column sm="2">
              ID
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
              />
            </Col>
          </Form.Group>

          {/* PASSWORD */}
          <Form.Group as={Row} className="mb-3" controlId="Password">
            <Form.Label column sm="2">
              PASSWORD
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
              />
            </Col>
          </Form.Group>

          <br />
          <br />
          <Button type="submit">로그인</Button> &emsp;
          <Button
            type="button"
            onClick={() => {
              window.location.href = './signup';
            }}
          >
            회원가입
          </Button>
        </Form>
      </div>
    );
  };

  const style = {
    container: {
      textAlign: 'center',
      marginTop: '30px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    form: {
      margin: '0 auto',
      width: '80%',
      marginTop: '65px',
    },
  };
  
  export default Signin;