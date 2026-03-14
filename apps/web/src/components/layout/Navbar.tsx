import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
// import logo from "../assets/logo.jpg";
import { useAuth } from "@web/hooks/useAuth";
import { cn } from "@web/lib/utils";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    { name: "Продукт", path: "/product" },
    { name: "Решения", path: "/solutions" },
    { name: "Цены", path: "/pricing" },
    { name: "Ресурсы", path: "/resources" },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 w-full bg-slate-900/80 backdrop-blur-lg z-50 border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-5 py-3">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link
            to={isAuthenticated ? "/workspace" : "/"}
            className="flex items-center gap-2"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              {/* <img
                src={logo}
                alt="Khammerson Logo"
                className="h-14 w-14 object-contain"
              /> */}
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Khammerson
              </span>
            </motion.div>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-md",
                  location.pathname.includes(link.path) && "text-purple-400",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Кнопки действий */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              // 👈 Если авторизован - показываем рабочие пространство и профиль
              <>
                <Link
                  to="/workspace"
                  className="px-4 py-2 border border-slate-700 rounded-md text-white hover:bg-slate-800 transition-colors"
                >
                  WorkSpace
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 border border-slate-700 rounded-md text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {user?.email?.split("@")[0] || "Профиль"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 border border-slate-700 rounded-md text-white hover:bg-slate-800 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              // 👈 Если не авторизован - показываем вход и регистрацию
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-slate-700 rounded-md text-white hover:bg-slate-800 transition-colors"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-md transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Мобильное меню кнопка */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Мобильное меню (раскрывающееся) */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "block px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-md",
                    location.pathname.includes(link.path) && "text-purple-400",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 space-y-2 border-t border-slate-800">
                {isAuthenticated ? (
                  // 👈 Мобильное меню для авторизованных
                  <>
                    <Link
                      to="/workspace"
                      className="block px-4 py-2 border border-slate-700 rounded-md text-white hover:bg-slate-800 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      WorkSpace
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 border border-slate-700 rounded-md text-white hover:bg-slate-800 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Профиль
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 border border-slate-700 rounded-md text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors text-left"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  // 👈 Мобильное меню для неавторизованных
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 border border-slate-700 rounded-md text-white hover:bg-slate-800 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Вход
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-md transition-colors text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};
