import "../../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, Button, Form, InputGroup, NavDropdown } from "react-bootstrap";

const DesNavigation = (props) => {
  const {
    navigate,
    categories,
    containerRef,
    measureBtnRefs,
    measureMoreRef,
    visibleCount,
    handleClickCategory,
    loginUser,
    handleLogout,
    keyword,
    setKeyword,
    handleSearch,
  } = props;

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  return (
    <>
      {/* 폭 측정 전용 DOM: 화면 밖에서 항상 5개 + 더보기 렌더 */}
      <div className="nav-measure">
        {categories.map((name, i) => (
          <span key={name} ref={(el) => (measureBtnRefs.current[i] = el)} className="nav-measure-item">
            {name}
          </span>
        ))}
        <span ref={measureMoreRef} className="nav-measure-item">더보기</span>
      </div>

      <Navbar bg="dark" data-bs-theme="dark" style={{ height: "80px", padding: "0 20px" }}>
        <Nav className="me-auto" ref={containerRef} style={{ display: "flex", alignItems: "center" }}>
          <Nav.Link style={{ fontSize: "24px", marginRight: "20px" }} onClick={() => navigate("/")}>
            뉴스모아
          </Nav.Link>

          {visible.map((name) => (
            <Nav.Link key={name} onClick={() => handleClickCategory(name)} style={{ whiteSpace: "nowrap" }}>
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

        <Form onSubmit={handleSearch} className="nav-search nav-search--desktop">
          <InputGroup>
            <Form.Control
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="secondary">🔍</Button>
          </InputGroup>
        </Form>

        <Nav className="ms-auto" style={{ marginRight: "100px" }}>
          <Nav.Link onClick={() => (loginUser ? handleLogout() : navigate("/Signin"))}>
            {loginUser ? "로그아웃" : "로그인"}
          </Nav.Link>
          <Nav.Link onClick={() => (!loginUser ? navigate("/Signup") : null)}>
            {loginUser ? "마이페이지" : "회원가입"}
          </Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
};

export default DesNavigation;
