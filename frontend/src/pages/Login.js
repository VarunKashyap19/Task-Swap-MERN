import React, { useState } from "react";
import request from "../services/api";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await request("/auth/login", "POST", form);
      saveAuth(data.token, data.user);
      alert("Logged in!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /><br/>
        <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
