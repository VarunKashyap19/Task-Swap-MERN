import React, { useState } from "react";
import request from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await request("/auth/register", "POST", form);
      alert("Registered! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /><br/>
        <input placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /><br/>
        <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} /><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
