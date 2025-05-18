import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router"; 
import type { RootState } from "~/redux/store";

interface User {
  id: number;
  name: string;
  email: string;
}

interface HeaderProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

export default function Header({ isAuthenticated, user, onLogout }: HeaderProps) {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const cartNumber = useSelector((state:RootState)=>state.cart.items);
  const logoUrl = "/LOGO.png";

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onLogout();
    setMobileMenuOpen(false); 
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  return (
   <nav className="bg-white border-b border-gray-200 mx-auto w-full z-50 shadow">
      <div className="container mx-auto py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {isAuthenticated && (cartNumber.length > 0) && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {cartNumber.length}
                </span>
              )}
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              {user && <li className="text-gray-700 px-3 py-2">Вітаю, {user.name || user.email}!</li>}
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                  Вийти
                </button>
              </li>
            </>
          ) : (
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
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md"
          onClick={closeMobileMenu} 
        >
          <ul className="px-4 py-3 space-y-1">
            <li><Link to="/" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition" onClick={stopPropagation}>Home</Link></li>
            <li><Link to="/products" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition" onClick={stopPropagation}>Products</Link></li>
            <li><Link to="/cart" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition flex items-center" onClick={stopPropagation}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
            </Link></li>
            {isAuthenticated ? (
              <>
                {user && <li className="block px-3 py-2 text-gray-700" onClick={stopPropagation}>Вітаю, {user.name || user.email}!</li>}
                <li>
                  <button
                    onClick={(e) => { stopPropagation(e); handleLogoutClick(e);}}
                    className="w-full text-left block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    Вийти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition" onClick={stopPropagation}>Login</Link></li>
                <li><Link to="/register" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition" onClick={stopPropagation}>Register</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}