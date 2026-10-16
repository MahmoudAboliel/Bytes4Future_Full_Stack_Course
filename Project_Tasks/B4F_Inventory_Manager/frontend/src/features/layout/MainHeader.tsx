import { Link, NavLink } from "react-router";

const MainHeader = () => {
    const routes = [
        {
            id: 1,
            href: "/",
            label: "Dashboard"
        },
        {
            id: 2,
            href: "/products",
            label: "Products"
        },
        {
            id: 3,
            href: "/movements",
            label: "Movements"
        },
    ]
  return (
    <header className="flex sticky inset-0 z-100  h-12 justify-between items-center p-3 dark:bg-slate-900 dark:text-white shadow-sm shadow-slate-700">
      <Link to={"/"} className="font-medium text-lg text-indigo-600">
        Inventra
      </Link>
      <ul className="flex items-center gap-2 text-slate-300">
        {routes.map((route) => (
          <li key={route.id}>
            <NavLink
              to={route.href}
              className={({ isActive }) =>
                [
                  isActive
                    ? "font-medium text-[16px]"
                    : "font-normal text-sm hover:font-medium hover:text-sm duration-150",
                ].join(" ")
              }
            >
              {route.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="px-2 py-1 rounded-lg bg-indigo-600 text-sm">Sign in</div>
    </header>
  );
}

export default MainHeader