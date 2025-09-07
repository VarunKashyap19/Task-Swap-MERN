import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import NewTask from "./pages/NewTask";

function Home() {
  return <h2>Welcome to TaskSwap+</h2>;
}

function App() {
  console.log("✅ App.js rendering");

  return (
    <Router>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<NewTask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
