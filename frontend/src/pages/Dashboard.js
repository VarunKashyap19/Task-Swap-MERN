import React, { useEffect, useState } from "react";
import request from "../services/api";
import { getToken, getUser, saveAuth } from "../utils/auth";

export default function Dashboard() {
  const [user, setUser] = useState(getUser());
  const [ratings, setRatings] = useState([]);
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [socials, setSocials] = useState(user.socials || {});
  const [skills, setSkills] = useState(user.skills || []);

  useEffect(() => {
    fetchRatings();
    fetchClaimedTasks();
    fetchCreatedTasks();
  }, []);

  async function fetchRatings() {
    try {
      const data = await request(`/tasks/ratings/${user._id}`, "GET", null, getToken());
      setRatings(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load ratings");
    }
  }

  async function fetchClaimedTasks() {
    try {
      const data = await request("/tasks/list", "GET", null, getToken());
      setClaimedTasks(data.filter(t => t.claimedBy && t.claimedBy._id === user._id && !t.rated));
    } catch (err) {
      console.error(err);
      alert("Failed to load claimed tasks");
    }
  }

  async function fetchCreatedTasks() {
    try {
      const data = await request("/tasks/list", "GET", null, getToken());
      setCreatedTasks(data.filter(t => t.createdBy._id === user._id));
    } catch (err) {
      console.error(err);
      alert("Failed to load created tasks");
    }
  }

  async function submitRating(taskId) {
    let rating = prompt("Enter rating (1-5):");
    rating = Number(rating);
    if (!rating || rating < 1 || rating > 5) return alert("Rating must be 1-5");

    const feedback = prompt("Enter feedback:");
    try {
      await request(`/tasks/rate/${taskId}`, "POST", { rating, feedback }, getToken());
      alert("Rating submitted!");
      fetchRatings();
      fetchCreatedTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  }

  async function raiseDispute(taskId) {
    const reason = prompt("Enter reason for dispute:");
    if (!reason) return;
    try {
      await request(`/tasks/dispute/${taskId}`, "POST", { reason }, getToken());
      alert("Dispute raised!");
    } catch (err) {
      console.error(err);
      alert("Failed to raise dispute");
    }
  }

  async function updateProfile() {
    try {
      const updatedUser = { ...user, socials, skills };
      const data = await request("/users/update-profile", "PUT", updatedUser, getToken());
      setUser(data);
      saveAuth(data.token, data); // save updated user
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>

      {/* User info */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h3>User Info</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Credits: {user.credits}</p>
        <p>Trust Score: {user.trustScore || "N/A"}</p>

        <h4>Social Links</h4>
        <input placeholder="LinkedIn" value={socials.linkedin || ""} onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })} /><br />
        <input placeholder="GitHub" value={socials.github || ""} onChange={(e) => setSocials({ ...socials, github: e.target.value })} /><br />

        <h4>Skills</h4>
        <input
          placeholder="Add skill"
          value=""
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              setSkills([...skills, e.target.value]);
              e.target.value = "";
            }
          }}
        />
        <div>{skills.map((s, idx) => <span key={idx} style={{ marginRight: "10px" }}>{s}</span>)}</div>

        <button onClick={updateProfile}>Save Profile</button>
      </div>

      {/* Claimed Tasks */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h3>Tasks I'm Working On</h3>
        {claimedTasks.length === 0 && <p>No claimed tasks.</p>}
        {claimedTasks.map(t => (
          <div key={t._id} style={{ border: "1px solid #aaa", padding: "5px", marginBottom: "5px" }}>
            <h4>{t.title}</h4>
            <p>Status: {t.status}</p>
            {t.submissionLink && <p>Submitted: <a href={t.submissionLink} target="_blank" rel="noreferrer">{t.submissionLink}</a></p>}
          </div>
        ))}
      </div>

      {/* Created Tasks */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h3>Tasks I Created</h3>
        {createdTasks.length === 0 && <p>No tasks created yet.</p>}
        {createdTasks.map(t => (
          <div key={t._id} style={{ border: "1px solid #aaa", padding: "5px", marginBottom: "5px" }}>
            <h4>{t.title}</h4>
            <p>Status: {t.status}</p>
            {t.claimedBy && <p>Claimed By: {t.claimedBy.name}</p>}
            {t.submissionLink && <p>Submission: <a href={t.submissionLink} target="_blank" rel="noreferrer">{t.submissionLink}</a></p>}
            {t.status === "completed" && !t.rated && (
              <>
                <button onClick={() => submitRating(t._id)}>Rate Worker</button>
                <button onClick={() => raiseDispute(t._id)}>Raise Dispute</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Ratings received */}
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h3>Ratings Received</h3>
        {ratings.length === 0 && <p>No ratings yet.</p>}
        {ratings.map(r => (
          <div key={r._id} style={{ border: "1px solid #aaa", padding: "5px", marginBottom: "5px" }}>
            <p>From: {r.rater.name} ({r.rating} ⭐)</p>
            <p>Feedback: {r.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
