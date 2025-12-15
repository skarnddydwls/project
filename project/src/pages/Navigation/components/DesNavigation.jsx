import "../../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, Button, Form, InputGroup, Dropdown } from "react-bootstrap";

const DesNavigation = (props) => {
  const {
    navigate,
    categories,

    navbarRef,
    brandRef,
    rightRef,
    searchRef,

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
    <div className="nav-root">
      {/* 오프스크린 측정 DOM */}
      <div className="nav-measure" aria-hidden="true">
        {categories.map((name, i) => (
          <span
            key={name}
            ref={(el) => (measureBtnRefs.current[i] = el)}
            className="nav-cat nav-measure-link"
          >
            {name}
          </span>
        ))}

        {/* 실제 토글과 최대한 동일한 스타일로 측정 */}
        <button
          ref={measureMoreRef}
          type="button"
          className="nav-cat nav-measure-link dropdown-toggle"
        >
          ...
        </button>
      </div>

      <Navbar ref={navbarRef} bg="dark" data-bs-theme="dark" className="nav-bar">
        {/* 좌측 */}
        <Nav className="me-auto nav-left">
          <Nav.Link ref={brandRef} className="nav-brand" onClick={() => navigate("/")}>
            <b>뉴스모아</b>
          </Nav.Link>

          {visible.map((name) => (
            <Nav.Link
              key={name}
              onClick={() => handleClickCategory(name)}
              className="nav-cat"
            >
              {name}
            </Nav.Link>
          ))}

          {overflow.length > 0 && (
            <Dropdown align="end">
              <Dropdown.Toggle as={Nav.Link} className="nav-cat dropdown-toggle">
                ...
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {overflow.map((name) => (
                  <Dropdown.Item key={name} onClick={() => handleClickCategory(name)}>
                    {name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>

        {/* 검색(absolute 유지) */}
        <Form onSubmit={handleSearch} className="nav-search nav-search--desktop" ref={searchRef}>
          <InputGroup>
            <Form.Control
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="secondary">
              🔍
            </Button>
          </InputGroup>
        </Form>

        {/* 우측 */}
        <Nav ref={rightRef} className="ms-auto nav-right">
          <Nav.Link onClick={() => (loginUser ? handleLogout() : navigate("/Signin"))}>
            {loginUser ? "로그아웃" : "로그인"}
          </Nav.Link>

          <Nav.Link onClick={() => (!loginUser ? navigate("/Signup") : navigate("/Mypage"))}>
            {loginUser ? "마이페이지" : "회원가입"}
          </Nav.Link>
        </Nav>
      </Navbar>
    </div>
  );
};

export default DesNavigation;
