import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import Header from "~/components/Header";
import { fetchCurrentUser, logout, selectAuth } from "~/redux/slices/authSlice";
import { fetchCart } from "~/redux/slices/cartSlice";
import type { AppDispatch } from "~/redux/store";

function Layout() {
  const dispatch = useDispatch<AppDispatch>();
  const {isAdministrator, isAuthenticated, user, loading } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => dispatch(logout())}
        isAdmin={isAdministrator}
      />
      <div className="container mx-auto py-4">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
