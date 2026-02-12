import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Activity, LogIn, LogOut, Menu, X } from "lucide-react";

interface NavLink {
  name: string;
  path: string;
}

export const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { authState, signOut } = useAuth();
  const { pathname } = useLocation();

  const navLinks: NavLink[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transações", path: "/transacoes" },
    { name: "Configurações", path: "/configuracoes" },
  ];

  const handleSignOut = async () => {
    signOut();
    setIsOpen(false);
  };

  const changeMenu = () => {
    setIsOpen(!isOpen);
  };

  {
    /*!!  transforma o valor em booleano*/
  }
  const isAuthenticated: boolean = !!authState.user;

  const formatDisplayName = (name: string | null | undefined) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0]} ${names[names.length - 1]}`
      : names[0];
  };

  const renderAvatar = () => {
    if (!authState.user) return null;

    if (authState.user.photoURL) {
      return (
        <img
          src={authState.user.photoURL}
          alt={authState.user.displayName || "User Avatar"}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
        {authState.user.displayName?.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4">
      <div className="container-app">
        {/*logo*/}
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="text-xl font-bold text-gray-100 flex items-center gap-2"
          >
            <Activity className="text-primary-500 w-6 h-6" />
            DevBills
          </Link>

          {/*menu desktop*/}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    pathname === link.path
                      ? "text-primary-500 bg-primary-500/10 rounded-md h-10 px-3 py-2"
                      : "text-gray-300 h-10 px-3 py-2 hover:text-primary-500 hover:bg-primary-500/10 rounded-md"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/*botão de login/logout*/}
          <div className="hidden md:flex items-center gap-4 space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {renderAvatar()}
                  <span className="text-gray-300 text-sm font-medium">
                    {formatDisplayName(authState.user?.displayName)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-gray-300 hover:bg-red-500 hover:text-red-300 p-2 rounded-xl transition-all cursor-pointer"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                <LogIn className="w-5 h-5 bg-primary-500 text-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all" />
                Login
              </Link>
            )}
          </div>

          {/*botao mobile*/}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="md:hidden text-gray-400 hover:bg-gray-800 hover:text-primary-300 p-2 rounded-lg transition-all cursor-pointer"
              onClick={changeMenu}
            >
              {isOpen ? (
                <X size={24} className="text-gray-300" />
              ) : (
                <Menu size={24} className="text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/*menu mobile*/}
      {isOpen && (
        <div className="px-4 pb-4">
          <div>
            {isAuthenticated ? (
              <>
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 p-2 rounded-lg ${
                        pathname === link.path
                          ? "text-primary-500 bg-primary-500/10 rounded-md h-10 px-3 py-2"
                          : "text-gray-300 h-10 px-3 py-2 hover:text-primary-500 hover:bg-primary-500/10 rounded-md"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center justify-between py-4 border-t border-gray-700 ">
                  <div className="flex items-center space-x-2">
                    {renderAvatar()}
                    <span className="text-gray-300 text-sm font-medium">
                      {authState.user?.displayName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-gray-400 hover:bg-red-500 hover:text-red-300 p-2 rounded-xl transition-all cursor-pointer"
                    title="Sair"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary text-gray-800 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-5 h-5 bg-primary-500" />
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
