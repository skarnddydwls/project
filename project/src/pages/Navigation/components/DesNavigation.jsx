import '../../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Button, Form, InputGroup, NavDropdown  } from 'react-bootstrap';
import { useNavigation } from "../hooks/useNavigation"
import { useNavigate } from 'react-router-dom'


const Navigation = () => {


  const navigate = useNavigate();
  const {
    setKeyword, keyword,
    setLoginUser, loginUser,
    handleSearch,
    calculateVisible
  } = useNavigation();

  
  const categories = ["경제", "과학", "사회", "세계", "문화"];

  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(categories.length);

  const handleClickCategory = (name) => {
    setCategory(name);
    navigate(`/NewsCategory/${encodeURIComponent(name)}`);
  };

  // ⭐ 핵심 알고리즘: 버튼 width + 컨테이너 width 비교
  
  

  return(
    <Navbar bg="dark" data-bs-theme="dark" style={{height: '80px',padding: "0 20px" }}>
      <Nav className="me-auto" ref={containerRef} style={{ display: "flex", alignItems: "center" }}>
        <Nav.Link style={{ fontSize: "24px", marginRight: "20px" }} onClick={() => navigate("/")}>
          뉴스모아
        </Nav.Link>

        {categories.map((name, i) => (
          <Nav.Link
            key={name}
            ref={(el) => (buttonRefs.current[i] = el)}
            onClick={() => handleClickCategory(name)}
            style={{
              whiteSpace: "nowrap",
              display: visible.includes(name) ? "block" : "none",
            }}
          >
            {name}
          </Nav.Link>
        ))}

        {overflow.length > 0 && (
          <NavDropdown title="더보기">
            {overflow.map((name) => (
              <NavDropdown.Item key={name} onClick={() => handleClickCategory(name)}>
                {name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        )}
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