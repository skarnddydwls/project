import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import DaumPostCode from 'react-daum-postcode';

const Signup = (() => {

    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        birthday: '',
        gender: '',
        phone: '',
        address: '',
        detailAddress: ''
    });


    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({
            ...form,
            [name] : value
        })
        if(name === 'email') {
            setEmailCheckMessage('');
            setIsEmailChecked(false);
        }
    } 

    const [emailCheckMessage, setEmailCheckMessage] = useState('');
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [showPostCode, setShowPostCode] = useState(false);
    
    const checkEmail = () => {
        axios.get('/react/email-check', {params: {email : form.email}})
             .then(result => {
                if(result.data) {
                    setEmailCheckMessage('사용할 수 있는 이메일입니다');
                    setIsEmailChecked(true);
                } else {
                    setEmailCheckMessage('사용할 수 없는 이메일입니다');
                    setIsEmailChecked(false);
                }
             })
             .catch(() => {
                alert('이메일 확인 중 오류 발생!!!');
             })
    }

    const handleComplete = (data) => {
        setForm({...form, address: data.address})
        setShowPostCode(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isEmailChecked !== true){
            alert("이메일 중복 확인을 해주세요")
            return;
        }
        axios.post('/react/signup', form)
             .then(() => {
                alert("회원가입 성공")
                window.location.href='/';
             })
             .catch (() => alert("회원가입 실패띠"))
    }
    return(
        <div>
            <h2>회원가입</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="email">
                    <Form.Label column sm="2">Email</Form.Label>
                    <Col sm="6">
                    <Form.Control placeholder="elelte991@gmail.com" onChange={handleChange} name="email"/>
                    </Col>

                    <Col sm="2">
                    <Button onClick={checkEmail}>중복확인</Button>
                    </Col>
                    {
                        emailCheckMessage && (
                            <span style={{color: isEmailChecked ? 'green' : 'red', fontSize: '0.6em', marginTop: '5px'}}>
                                {emailCheckMessage}
                            </span>
                        )
                    }
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="Password">
                    <Form.Label column sm="2">Password</Form.Label>
                    <Col sm="6">
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="Name">
                    <Form.Label column sm="2">Name</Form.Label>
                    <Col sm="6">
                    <Form.Control placeholder="Name" name="name" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="Birthday">
                    <Form.Label column sm="2">Birthday</Form.Label>
                    <Col sm="6">
                    <Form.Control placeholder="Birthday" type="date" name="birthday" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="Gender">
                    <Form.Label column sm="2">Gender</Form.Label>
                    <Col sm="6">
                    <Form.Select name="gender" onChange={handleChange}>
                        <option>성별</option>
                        <option value="남자">남자</option>
                        <option value="여자">여자</option>
                    </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="Phone">
                    <Form.Label column sm="2">Phone</Form.Label>
                    <Col sm="6">
                    <Form.Control placeholder="Phone" name="phone" onChange={handleChange}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="Address">
                    <Form.Label column sm="2">Address</Form.Label>
                    <Col sm="6">
                    <Form.Control placeholder="Address" name="address" value={form.address} readOnly />
                    </Col>

                    <Col sm="2">
                    <Button onClick={() => setShowPostCode(true)}>주소 검색</Button>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="detailAddress">
                    <Form.Label column sm="2">DetailAddress</Form.Label>
                    <Col sm="6">
                    <Form.Control placeholder="detailAddress" name="detailAddress" onChange={handleChange}/>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3" controlId="submit">
                    <Col sm="8">
                    <Button type='submit'>회원가입</Button>
                    </Col>
                </Form.Group>

                <Modal show={showPostCode} onHide={() => setShowPostCode(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>주소 검색</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DaumPostCode onComplete={handleComplete}/>
                    </Modal.Body>
                </Modal>
            </Form>
        </div>
    )
})

export default Signup;