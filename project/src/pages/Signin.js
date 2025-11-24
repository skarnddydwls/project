import {Button, Col, Form, Row, Container} from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signin = () => {
    const [form, setForm] = useState ({
            id: '',
            password: ''
        }
    )

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name] : value});
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // 서버로 가는거 막아줌
        axios.post('/react/login', form)
             .then(result => {
                if(result.data) {
                    alert('로그인 되었습니다');
                    const userInfo = {
                        name: result.data.name,
                        email: result.data.email
                    }
                    sessionStorage.setItem('loginUser', JSON.stringify(userInfo));
                    window.location.href='/';
                } else {
                    alert('이메일 또는 비밀번호가 일치하지 않습니다')
                }
             })
             .catch(() => {
                alert('로그인에 실패하였습니다'); // 서버 측 오류
             })
    }
    return(
        <Container>
            <div class="login">
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="id">
                        <Form.Label column sm="2">아이디</Form.Label>
                        <Col sm="6">
                        <Form.Control name="id" onChange={handleChange}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="Password">
                        <Form.Label column sm="2">비밀번호</Form.Label>
                        <Col sm="6">
                        <Form.Control type="password" name="password" onChange={handleChange}/>
                        </Col>
                    </Form.Group>

                    <Button type="submit">로그인</Button> &emsp;
                    <Button type="button" onClick={() => {window.location.href='./signup'}}>회원가입</Button>
                </Form>
            </div>
        </Container>
    )
}

export default Signin;