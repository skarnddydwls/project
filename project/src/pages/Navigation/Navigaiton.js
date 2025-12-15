import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DesNavigation from "./components/DesNavigation";
import { useNavigation } from "./hooks/useNavigation";

const Navigation = () => {
  const nav = useNavigation();
  return <DesNavigation {...nav} />;
};

export default Navigation;

