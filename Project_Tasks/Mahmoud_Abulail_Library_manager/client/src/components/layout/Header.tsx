import { Link } from "react-router";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

const Header = () => {
  const { isMobile } = useSidebar();
  return (
    <header
      className={`${!isMobile && "hidden"} p-2 shadow w-full flex gap-2 items-center`}
    >
      <SidebarTrigger />
      <Link to="/" className="font-medium text-xl text-gray-800">
        MyLib
      </Link>
    </header>
  );
};

export default Header;
