import { NavLink, useLocation } from "react-router-dom";
import { navByRole } from "./navConfig";
import Logo from "../common/Logo";
import Avatar from "../common/Avatar";
import { roleLabel } from "../../utils";
import { useAuth } from "../../context/auth";

/**
 * Dark sidebar with grouped navigation. Used both as the desktop rail and
 * inside the mobile drawer (see Layout).
 */
const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;
  const groups = navByRole[user.role] || [];

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
        <Logo variant="full" onLight />
      </div>

      <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-white/35">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  location.pathname === item.to ||
                  (item.to !== `/${user.role}` &&
                    location.pathname.startsWith(`${item.to}/`));
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onNavigate}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                        active
                          ? "bg-brand-blue text-white shadow-sm"
                          : "text-white/65 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {!active && (
                        <span className="absolute inset-y-2 start-0 w-0.5 scale-y-0 rounded-full bg-brand-blue transition-transform duration-150 group-hover:scale-y-100" />
                      )}
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 ${
                          active ? "text-white" : "text-white/50 group-hover:text-white/80"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-2.5 py-2.5">
          <Avatar name={user.fullName} seed={user.id} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-white/45">
              {roleLabel[user.role] || user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
