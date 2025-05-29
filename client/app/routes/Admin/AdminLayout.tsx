import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, NavLink, useNavigate } from "react-router";
import { selectAuth } from "~/redux/slices/authSlice";

function AdminLayout() {
  const { isAdministrator, isAuthenticated } = useSelector(selectAuth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to /login");
      navigate("/login");
      return;
    }
    if (!isAdministrator) {
      console.log(
        "User not administrator, redirecting to /unauthorized (or /)"
      );
      navigate("/");
    }
  }, [isAdministrator, isAuthenticated, navigate]);
  return (
    <div className="flex flex-row min-h-screen">
      <aside className="bg-gray-700 text-white w-64 p-4 flex flex-col ">
        <div className="h-full fixed flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Адмін Панель</h1>
          <nav className="flex-grow ">
            <ul>
              <li className="mb-2">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded transition-colors ${
                      isActive ? "bg-gray-600" : "hover:bg-gray-600"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded transition-colors ${
                      isActive ? "bg-gray-600" : "hover:bg-gray-600"
                    }`
                  }
                >
                  Products
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/admin/categories"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded transition-colors ${
                      isActive ? "bg-gray-600" : "hover:bg-gray-600"
                    }`
                  }
                >
                  Add Categories
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded transition-colors ${
                      isActive ? "bg-gray-600" : "hover:bg-gray-600"
                    }`
                  }
                >
                  Orders
                </NavLink>
              </li>
            </ul>
          </nav>
          <div>
            <NavLink
              to="/"
              className="block text-center py-2 px-3 mb-8 rounded border border-gray-600 hover:bg-gray-600 transition-colors"
            >
              На сайт
            </NavLink>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
