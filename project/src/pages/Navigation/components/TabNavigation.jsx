import "../../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useEffect } from "react";

const TabNavigation = (props) => {
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

  const handleLogout = () => {
    sessionStorage.removeItem("loginUser");
    sessionStorage.removeItem("recent_news");
    sessionStorage.removeItem("recent_word_meanings");

    setLoginUser(null);
    navigate("/");
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" style={{ height: "70px", padding: "0 12px" }}>
      <Nav className="me-auto" ref={containerRef} style={{ display: "flex", alignItems: "center" }}>
        <Nav.Link
          style={{ fontSize: "20px", marginRight: "12px" }}
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

      <Nav className="ms-auto">
        <Nav.Link
          onClick={() => {
            if (loginUser) {
              handleLogout();
            } else {
              navigate("/Signin");
            }
          }}
        >
          {loginUser ? "로그아웃" : "로그인"}
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default TabNavigation;
