import React, { useState } from "react";
import request from "../services/api";
import { getToken } from "../utils/auth";

export default function NewTask() {
  const [form, setForm] = useState({ title:"", description:"", rewardCredits:1 });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await request("/tasks/create", "POST", form, getToken());
      alert("Task created!");
      window.location.href="/tasks";
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>New Task</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} /><br/>
        <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}></textarea><br/>
        <input type="number" min="1" value={form.rewardCredits} onChange={(e)=>setForm({...form,rewardCredits:Number(e.target.value)})} /><br/>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}
