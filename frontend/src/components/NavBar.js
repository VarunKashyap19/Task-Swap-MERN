import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

export default function NavBar({ onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <nav style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}>
      <span style={{ fontWeight: "bold", marginRight: "20px" }}>TaskSwap+</span>

      <Link to="/">Home</Link> | <Link to="/tasks">Tasks</Link> |{" "}
      <Link to="/tasks/new">New Task</Link> |{" "}
      <Link to="/dashboard">Dashboard</Link>

      {user ? (
        <span style={{ float: "right" }}>
          {user.name} (Credits: {user.credits}){" "}
          <button
            onClick={() => {
              logout();
              onLogout && onLogout();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </span>
      ) : (
        <span style={{ float: "right" }}>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </span>
      )}
    </nav>
  );
}
