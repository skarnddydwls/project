import '../../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigation } from "../hooks/useNavigation"
import { useNavigate } from 'react-router-dom'


const Navigation = () => {


  const navigate = useNavigate();
  const {
    setKeyword, keyword,
    setLoginUser, loginUser,
    handleSearch,
  } = useNavigation();
  
  const categories = ["경제", "과학", "사회", "세계", "문화"];
  const Categorylink = (name) => {
    navigate(`/NewsCategory/${ categories[name] }`);

  };

  return(
    <Navbar bg="dark" data-bs-theme="dark" style={{height: '80px'}}>
      <Nav className='me-auto' style={{marginLeft:"50px", alignItems:'center'}}>
        <Nav.Link style={{fontSize:'30px'}} onClick={() => {navigate('/')}}>뉴스모아</Nav.Link>
        <Nav.Link onClick={() => Categorylink}>경제</Nav.Link>
        <Nav.Link onClick={() => {navigate('/NewsCategory/과학')}}>과학</Nav.Link>
        <Nav.Link onClick={() => {navigate('/NewsCategory/사회')}}>사회</Nav.Link>
        <Nav.Link onClick={() => {navigate('/NewsCategory/세계')}}>세계</Nav.Link>
        <Nav.Link onClick={() => {navigate('/NewsCategory/문화')}}>문화</Nav.Link>
      </Nav>
        <Form inline onSubmit={handleSearch} className="nav-search">
          <InputGroup>
            <Form.Control
              placeholder="Search"
              aria-label="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}/>
            <Button type="submit" variant="secondary">🔍</Button>
          </InputGroup>
        </Form>
      <Nav   className='ms-auto' style={{marginRight:'100px'}}>
        
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
  );
};
export default Navigation;