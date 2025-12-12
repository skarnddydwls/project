import "../../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, Button, Form, InputGroup, NavDropdown } from "react-bootstrap";
import { useEffect } from "react";
import axios from "axios";

// ... import들 그대로

const DesNavigation = (props) => {
  const {
    navigate,
    categories,
    containerRef,
    buttonRefs,
    visibleCount,
    calculateVisible,
    handleClickCategory,
    loginUser,
    setLoginUser,
    keyword,
    setKeyword,
    handleSearch,
  } = props;

  useEffect(() => {
    calculateVisible();
    requestAnimationFrame(calculateVisible);

    window.addEventListener("resize", calculateVisible);
    return () => window.removeEventListener("resize", calculateVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  // loginUser가 문자열/객체/없음 어떤 경우든 안전하게 id만 뽑기
  const getLoginUserId = () => {
    try {
      if (!loginUser) return null;
      if (typeof loginUser === "string") return JSON.parse(loginUser).id;
      return loginUser.id; // 객체로 들고 있는 경우
    } catch {
      return null;
    }
  };

  const loginUserId = getLoginUserId();

  // 로그아웃 처리(네비에서만)
  const handleLogout = async () => {
    try {
      // 서버 세션/쿠키 정리 (있으면 의미 있고, 없어도 크게 손해 없음)
      await axios.get("/api/logout", { withCredentials: true });
    } catch (e) {
      // 서버 로그아웃이 실패해도 프론트 상태는 끊어주는 게 UX상 안전
    } finally {
      // 1) 저장된 로그인 정보 삭제
      sessionStorage.removeItem("loginUser");

      // 2) (선택) 사용자 관련 캐시 정리 - 너가 쓰는 키에 맞춰 유지/삭제
      sessionStorage.removeItem("recent_news");
      sessionStorage.removeItem("recent_word_meanings");

      // 3) 상태 갱신
      setLoginUser(null);

      // 4) 이동
      navigate("/");
    }
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" style={{ height: "80px", padding: "0 20px" }}>
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

      <Form onSubmit={handleSearch} className="nav-search nav-search--desktop">
        <InputGroup>
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="submit" variant="secondary">🔍</Button>
        </InputGroup>
      </Form>

      <Nav className="ms-auto" style={{ marginRight: "100px" }}>
        <Nav.Link
          onClick={() => {
            if (loginUser) {
              handleLogout();     // 로그아웃은 여기서만
            } else {
              navigate("/Signin");
            }
          }}
        >
          {loginUser ? "로그아웃" : "로그인"}
        </Nav.Link>

        <Nav.Link
          onClick={() => {
            if (!loginUser) navigate("/Signup");
          }}
        >
          {loginUser ? (loginUserId ?? "사용자") : "회원가입"}
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default DesNavigation;
