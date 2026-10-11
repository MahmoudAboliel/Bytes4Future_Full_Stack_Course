import { routes } from "@/lib/constants";
import { Link, NavLink } from "react-router";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SquareArrowRightExit } from "lucide-react";

const Header = () => {
  const { user, setUser } = useUser();
  return (
    <header className="flex sticky top-0 z-100 bg-white h-12 justify-between items-center p-3 border-b border-b-slate-200 shadow-sm">
      <Link to={"/"} className="font-medium text-sm">
        MD
      </Link>
      <ul className="flex items-center gap-2">
        {routes.map((route) => (
          <li key={route.id}>
            <NavLink
              to={route.href}
              className={({ isActive }) =>
                [
                  isActive
                    ? "font-medium text-sm"
                    : "font-normal text-xs hover:font-medium hover:text-sm duration-150",
                ].join(" ")
              }
            >
              {route.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 border rounded-lg py-1 px-3">
        <p className="p-0 text-sm">{user?.username}</p>
        <Avatar size="sm">
          <AvatarImage
            src={`https://i.pravatar.cc/150?u=${user?.email ?? "guest"}`}
            alt={user?.name ?? "user"}
          />
          <AvatarFallback>UP</AvatarFallback>
        </Avatar>
        <SquareArrowRightExit 
          onClick={() => setUser(null)} 
          color="red"
          size={18}
        />
      </div>
    </header>
  );
};

export default Header;
