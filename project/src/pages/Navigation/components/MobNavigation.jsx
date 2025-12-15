import "../../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

const MobNavigation = (props) => {
  const { navigate, categories, handleClickCategory, loginUser, handleLogout } = props;

  return (
    <Navbar bg="dark" data-bs-theme="dark" style={{ height: "60px", padding: "0 10px" }}>
      <Nav className="me-auto" style={{ display: "flex", alignItems: "center" }}>
        <Nav.Link style={{ fontSize: "18px" }} onClick={() => navigate("/")}>
          뉴스모아
        </Nav.Link>

        <NavDropdown title="카테고리">
          {categories.map((name) => (
            <NavDropdown.Item key={name} onClick={() => handleClickCategory(name)}>
              {name}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Nav>

      <Nav className="ms-auto">
        <Nav.Link onClick={() => (loginUser ? handleLogout() : navigate("/Signin"))}>
          {loginUser ? "로그아웃" : "로그인"}
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default MobNavigation;
