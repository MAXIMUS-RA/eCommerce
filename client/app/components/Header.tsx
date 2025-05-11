// filepath: client/app/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router"; // Використовуємо react-router-dom

// Припустимо, у вас є хуки для аутентифікації та кошика
// Замініть їх на ваші реальні хуки або логіку
const useAuth = () => {
  // Тимчасова заглушка. Замініть на реальну логіку
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Початковий стан - не аутентифікований
  const [user, setUser] = useState<{ name: string; isAdmin?: boolean } | null>(
    null
  );


  const login = (userData: { name: string; isAdmin?: boolean }) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    // Тут буде ваш API запит для виходу
    console.log("Logging out...");
    setIsAuthenticated(false);
    setUser(null);
    // navigate('/login'); // Опціонально: перенаправлення після виходу
  };

  return { isAuthenticated, user, logout, login }; // Додано login для тестування
};

const useCart = () => {
  // Тимчасова заглушка
  const [itemCount, setItemCount] = useState(0); // Початкова кількість товарів
  // useEffect(() => { setItemCount(3); }, []); // Для тесту
  return { itemCount };
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
    navigate("/login"); 
  };

  const logoUrl = "/LOGO.png";

  return (
    <nav className="bg-white border-b border-gray-200 mx-auto  w-full z-50 shadow">
      <div className="container mx-auto py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-gray-800">eCommerce</span>
        </Link>

        <ul className="hidden md:flex items-center space-x-4">
          <li>
            <Link
              to="/"
              className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              Products
            </Link>
          </li>
          <li className="relative">
            <Link
              to="/cart"
              className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart
              {itemCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {itemCount}
                </span>
              )}
            </Link>
          </li>
          {isAuthenticated && user && (
            <>
              <li>
                <Link
                  to="/orders"
                  className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                  Orders
                </Link>
              </li>
              {user.isAdmin ? (
                <li className="text-gray-600 px-2 flex items-center">
                  <Link to="/admin/dashboard">Hi, {user.name}</Link>
                </li>
              ) : (
                <li className="text-gray-600 px-2 flex items-center">
                  <Link to="/profile">Hi, {user.name}</Link>
                </li>
              )}
              <li className="flex items-center">
                <form onSubmit={handleLogout} className="m-0">
                  <button
                    type="submit"
                    className="px-3 py-2 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </form>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16m-7 6h7"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md"
          onClick={() => setMobileMenuOpen(false)} // Закривати меню при кліку на фон
        >
          <ul className="px-4 py-3 space-y-1">
            <li>
              <Link
                to="/"
                className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                onClick={(e) => e.stopPropagation()}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                onClick={(e) => e.stopPropagation()}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Cart
                {itemCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
            {isAuthenticated && user && (
              <>
                <li>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <form onSubmit={handleLogout} className="m-0">
                    <button
                      type="submit"
                      className="w-full text-left block px-3 py-2 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Logout
                    </button>
                  </form>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
