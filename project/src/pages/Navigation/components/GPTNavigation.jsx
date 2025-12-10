import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const DesNavigation = ({ navigate, category, setCategory }) => {
  const isNarrow = useMediaQuery({ maxWidth: 1100 });  // 좀 줄었을 때
  const isVeryNarrow = useMediaQuery({ maxWidth: 900 }); // 더 줄었을 때

  const categories = ["경제", "과학", "사회", "세계", "문화"];

  let visibleCount = 5; // 기본: 다 보이기
  if (isNarrow) visibleCount = 3;     // 폭이 줄면 3개만
  if (isVeryNarrow) visibleCount = 1; // 많이 줄면 1개만

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  const handleClickCategory = (name) => {
    setCategory(name);
    navigate(`/NewsCategory/${encodeURIComponent(name)}`);
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" style={{ height: "80px" }}>
      <Nav className="me-auto" style={{ marginLeft: "50px", alignItems: "center" }}>
        <Nav.Link style={{ fontSize: "30px" }} onClick={() => navigate("/")}>
          뉴스모아
        </Nav.Link>

        {visible.map((name) => (
          <Nav.Link
            key={name}
            active={category === name}
            onClick={() => handleClickCategory(name)}
          >
            {name}
          </Nav.Link>
        ))}

        {overflow.length > 0 && (
          <NavDropdown title="더보기" id="nav-more">
            {overflow.map((name) => (
              <NavDropdown.Item
                key={name}
                active={category === name}
                onClick={() => handleClickCategory(name)}
              >
                {name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        )}
      </Nav>
    </Navbar>
  );
};

export default DesNavigation;
