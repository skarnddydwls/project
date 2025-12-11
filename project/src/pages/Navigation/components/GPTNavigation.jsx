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









// 개별포장


import { useEffect, useRef, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

const DesNavigation = ({ navigate, category, setCategory }) => {
  const categories = ["경제", "과학", "사회", "세계", "문화"];

  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(categories.length);

  const handleClickCategory = (name) => {
    setCategory(name);
    navigate(`/NewsCategory/${encodeURIComponent(name)}`);
  };

  // ⭐ 핵심 알고리즘: 버튼 width + 컨테이너 width 비교
  const calculateVisible = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < categories.length; i++) {
      const btn = buttonRefs.current[i];
      if (!btn) continue;

      const btnWidth = btn.offsetWidth;
      if (totalWidth + btnWidth < containerWidth - 80) {
        // 80px: 더보기 드롭다운 여유 공간
        totalWidth += btnWidth;
        count++;
      } else break;
    }

    setVisibleCount(count);
  };

  // 처음 렌더링 및 리사이즈 시 재계산
  useEffect(() => {
    calculateVisible();
    window.addEventListener("resize", calculateVisible);
    return () => window.removeEventListener("resize", calculateVisible);
  }, []);

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  return (
    <Navbar bg="dark" variant="dark" style={{ height: "80px", padding: "0 20px" }}>
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
    </Navbar>
  );
};

export default DesNavigation;


import { useEffect, useRef, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

const DesNavigation = ({ navigate, category, setCategory }) => {
  const categories = ["경제", "과학", "사회", "세계", "문화"];

  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(categories.length);

  const handleClickCategory = (name) => {
    setCategory(name);
    navigate(`/NewsCategory/${encodeURIComponent(name)}`);
  };

  // ⭐ 핵심 알고리즘: 버튼 width + 컨테이너 width 비교
  const calculateVisible = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < categories.length; i++) {
      const btn = buttonRefs.current[i];
      if (!btn) continue;

      const btnWidth = btn.offsetWidth;
      if (totalWidth + btnWidth < containerWidth - 80) {
        // 80px: 더보기 드롭다운 여유 공간
        totalWidth += btnWidth;
        count++;
      } else break;
    }

    setVisibleCount(count);
  };

  // 처음 렌더링 및 리사이즈 시 재계산
  useEffect(() => {
    calculateVisible();
    window.addEventListener("resize", calculateVisible);
    return () => window.removeEventListener("resize", calculateVisible);
  }, []);

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  return (
    <Navbar bg="dark" variant="dark" style={{ height: "80px", padding: "0 20px" }}>
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
    </Navbar>
  );
};

export default DesNavigation;
