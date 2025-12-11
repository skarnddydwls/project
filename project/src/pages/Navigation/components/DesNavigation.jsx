// src/pages/Navigation/components/DesNavigation.jsx (혹은 Navigation.jsx)
import "../../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Nav,
  Navbar,
  Button,
  Form,
  InputGroup,
  NavDropdown,
} from "react-bootstrap";
import { useEffect } from "react";
import { useNavigation } from "../hooks/useNavigation";

const Navigation = () => {
  const {
    // 네비 공통
    navigate,

    // 카테고리 + 더보기
    categories,
    containerRef,
    buttonRefs,
    visibleCount,
    calculateVisible,
    handleClickCategory,

    // 로그인/검색
    loginUser,
    setLoginUser,
    keyword,
    setKeyword,
    handleSearch,
  } = useNavigation();

  useEffect(() => {
    calculateVisible();
    window.addEventListener("resize", calculateVisible);
    return () => window.removeEventListener("resize", calculateVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      style={{ height: "80px", padding: "0 20px" }}
    >
      {/* 왼쪽: 로고 + 카테고리 + 더보기 */}
      <Nav
        className="me-auto"
        ref={containerRef}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Nav.Link
          style={{ fontSize: "24px", marginRight: "20px" }}
          onClick={() => navigate("/")}
        >
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
              <NavDropdown.Item
                key={name}
                onClick={() => handleClickCategory(name)}
              >
                {name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        )}
      </Nav>

      {/* 가운데: 검색 */}
      <Form inline="true" onSubmit={handleSearch} className="nav-search">
        <InputGroup>
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            🔍
          </Button>
        </InputGroup>
      </Form>

      {/* 오른쪽: 로그인/회원가입 */}
      <Nav className="ms-auto" style={{ marginRight: "100px" }}>
        <Nav.Link
          onClick={() => {
            if (loginUser) {
              sessionStorage.removeItem("loginUser");
              setLoginUser(null);
              navigate("/");
            } else {
              navigate("/Signin");
            }
          }}
        >
          {loginUser ? "로그아웃" : "로그인"}
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            if (!loginUser) {
              navigate("/Signup");
            }
          }}
        >
          {loginUser ? loginUser.id : "회원가입"}
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
