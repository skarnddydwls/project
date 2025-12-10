import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMediaQuery } from "react-responsive";


import { useNavigation } from "./hooks/useNavigation";

// 3가지 반응형 전용 네비게이션
import DesNavigation from "./components/DesNavigation";
import MobNavigation from "./components/MobNavigation";
import TabNavigation from "./components/TabNavigation";

const Navigation = () => {
  // 공통 훅 (로그인, 검색, 카테고리 등 네비게이션 기능)
  const nav = useNavigation();

  // 반응형 조건
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  // const isDesktop = useMediaQuery({ minWidth: 1025 });

  // 화면 크기에 따라 렌더링
  if (isMobile) return <MobNavigation {...nav} />;
  if (isTablet) return <TabNavigation {...nav} />;
  return <DesNavigation {...nav} />; // 기본은 데스크탑
};

export default Navigation;