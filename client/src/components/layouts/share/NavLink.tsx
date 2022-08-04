import { Link } from "react-router-dom";

interface Props {
  to: string;
  children: ReactNode;
}

const NavLink: Component<Props> = ({ to, children }) => {
  return (
    <li className="hover:shadow-xl duration-300 transition">
      <Link to={to}>{children}</Link>
    </li>
  );
};
