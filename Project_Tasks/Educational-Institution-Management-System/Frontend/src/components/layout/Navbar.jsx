import { useEffect, useRef, useState } from "react";
import { Menu, LogOut, ChevronDown, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import { pageTitleFor } from "./navConfig";
import { roleLabel } from "../../utils";
import { useAuth } from "../../context/auth";
import { useToast } from "../../context/toast";

/**
 * Top bar: mobile menu trigger, current page title and the account menu
 * (profile summary + logout).
 */
const Navbar = ({ onOpenMenu }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the account menu whenever the route changes (reset-state-during-
  // render pattern — no effect, no extra paint).
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  if (!user) return null;

  const pageTitle = pageTitleFor(location.pathname, user.role);

  const handleLogout = () => {
    logout();
    toast("info", "تم تسجيل الخروج.");
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <button
        className="rounded-lg p-2 text-ink transition hover:bg-black/[0.05] lg:hidden"
        onClick={onOpenMenu}
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-w-0 items-center gap-2.5">
        <span className="hidden h-8 w-1 rounded-full bg-brand-blue sm:block" />
        <h2 className="truncate text-sm font-bold text-ink">{pageTitle}</h2>
      </div>

      <div className="flex-1" />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-black/[0.05]"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="قائمة الحساب"
        >
          <Avatar name={user.fullName} seed={user.id} size="sm" />
          <ChevronDown
            className={`hidden h-4 w-4 text-muted transition-transform sm:block ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-card border border-border bg-white shadow-pop animate-slideUp">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <Avatar name={user.fullName} seed={user.id} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {user.fullName}
                  </p>
                  <p className="ltr truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>

              <div className="px-4 py-2.5">
                <p className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <UserRound className="h-3.5 w-3.5" />
                  {roleLabel[user.role] || user.role}
                </p>
              </div>

              <div className="border-t border-border p-1.5">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-error-600 transition hover:bg-error-50"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
