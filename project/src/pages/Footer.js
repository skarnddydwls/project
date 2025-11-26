import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer style={{ background: '#21252b', padding: '20px 0', marginTop: '170px' ,marginBottom:'0', height:'200px',color:'white'}}>
      <Container>
        <Row className="text-center">
          <Col>
            <p style={{ margin: 0 }}>© 2025 뉴스모아. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
