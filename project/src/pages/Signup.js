import axios from 'axios';
import { useState } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [form, setForm] = useState({
    id: '',
    password: '',
  });

  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // 아이디가 바뀌면 중복 확인 상태 초기화
    if (name === 'id') {
      setIdCheckMessage('');
      setIsIdChecked(false);
    }
  };

  const checkId = () => {
    if (!form.id) {
      alert('아이디를 먼저 입력하세요.');
      return;
    }

    axios
      .get('/react/id-check', { params: { id: form.id } })
      .then((result) => {
        if (result.data) {
          setIdCheckMessage('사용 가능한 아이디 입니다.');
          setIsIdChecked(true);
        } else {
          setIdCheckMessage('이미 사용 중인 아이디 입니다.');
          setIsIdChecked(false);
        }
      })
      .catch(() => {
        alert('아이디 확인 중 오류가 발생했습니다.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isIdChecked) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    axios
      .post('/react/signup', form)
      .then(() => {
        alert('회원가입 성공');
        window.location.href = '/';
      })
      .catch(() => alert('회원가입 실패'));
  };

  return (
    <div style={style.container}>
      <h2 style={style.title}>회원가입</h2>
      <Form style={style.form} onSubmit={handleSubmit}>
        {/* ID */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            ID
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              required
            />
          </Col>
          <Col sm="2">
            <Button type="button" onClick={checkId}>
              중복확인
            </Button>
          </Col>
          {idCheckMessage && (
            <div style={{ marginTop: '5px' }}>
              <span
                style={{
                  color: isIdChecked ? 'green' : 'red',
                  fontSize: '0.8em',
                }}
              >
                {idCheckMessage}
              </span>
            </div>
          )}
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            PASSWORD
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>
          <br/><br/>
        <Button type="submit">회원가입</Button> &emsp;
        <Button type="reset">다시입력</Button>
      </Form>
    </div>
  );
};

const style = {
  container: {
    textAlign: 'center',
    marginTop: '40px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    margin: '0 auto',
    width: '80%',
  },
};

export default Signup;
