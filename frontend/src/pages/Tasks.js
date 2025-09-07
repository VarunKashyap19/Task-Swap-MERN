// src/pages/Tasks.js
import React, { useEffect, useState } from "react";
import request from "../services/api";
import { getToken, getUser } from "../utils/auth";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [submissionLinks, setSubmissionLinks] = useState({});
  const user = getUser();

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };
    loadTasks();
  }, []);

  async function fetchTasks() {
    try {
      const data = await request("/tasks/list", "GET", null, getToken());
      // Only show open or claimed tasks
      const visibleTasks = data.filter(
        (t) =>
          t.status === "open" || (t.status === "claimed" && t.claimedBy._id === user._id)
      );
      setTasks(visibleTasks);
    } catch (err) {
      alert(err.message);
    }
  }

  async function claimTask(id) {
    try {
      await request(`/tasks/claim/${id}`, "POST", null, getToken());
      alert("Task claimed!");
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  async function submitTask(id) {
    const link = prompt("Enter submission link (Google Drive, etc):");
    if (!link) return;
    try {
      await request(`/tasks/submit/${id}`, "POST", { submissionLink: link }, getToken());
      alert("Task submitted!");
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.length === 0 && <p>No available tasks.</p>}
      {tasks.map((task) => (
        <div key={task._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Reward Credits: {task.rewardCredits}</p>
          <p>Status: {task.status}</p>
          <p>Created By: {task.createdBy.name}</p>

          {task.status === "open" && <button onClick={() => claimTask(task._id)}>Claim</button>}
          {task.status === "claimed" && task.claimedBy._id === user._id && (
            <button onClick={() => submitTask(task._id)}>Submit Task</button>
          )}
        </div>
      ))}
    </div>
  );
}
