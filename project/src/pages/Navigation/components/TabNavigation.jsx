import "../../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

const TabNavigation = (props) => {
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
  } = props;

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  return (
    <>
      <div className="nav-measure">
        {categories.map((name, i) => (
          <span key={name} ref={(el) => (measureBtnRefs.current[i] = el)} className="nav-measure-item">
            {name}
          </span>
        ))}
        <span ref={measureMoreRef} className="nav-measure-item">더보기</span>
      </div>

      <Navbar bg="dark" data-bs-theme="dark" style={{ height: "70px", padding: "0 12px" }}>
        <Nav className="me-auto" ref={containerRef} style={{ display: "flex", alignItems: "center" }}>
          <Nav.Link style={{ fontSize: "20px", marginRight: "12px" }} onClick={() => navigate("/")}>
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

        <Nav className="ms-auto">
          <Nav.Link onClick={() => (loginUser ? handleLogout() : navigate("/Signin"))}>
            {loginUser ? "로그아웃" : "로그인"}
          </Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
};

export default TabNavigation;
