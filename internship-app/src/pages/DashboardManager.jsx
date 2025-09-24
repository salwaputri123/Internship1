import React, { useEffect, useState } from "react";
import "../assets/manager.css";
import { useNavigate } from "react-router-dom";

export default function DashboardManager() {
  const [name, setName] = useState("");
  const [teamStats, setTeamStats] = useState({
    manager: 0,
    hrd: 0,
    finance: 0,
    staff: 0,
  });
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    setName(localStorage.getItem("name") || "");

    fetch("http://localhost:5000/api/manager/team", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        const count = { manager: 0, hrd: 0, finance: 0, staff: 0 };
        data.users.forEach((u) => {
          if (count[u.role] !== undefined) count[u.role]++;
        });
        setTeamStats(count);
        setProjects(data.projects);
        setNotifications(data.notifications);
      })
      .catch(() => alert("Gagal mengambil data tim dan proyek"));
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-manager">
      {/* Header */}
      <div className="header-bar">
        <h1 className="title">Dashboard Manager</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Info User */}
      <div className="user-info">
        <h2>Selamat Datang, {name}</h2>
      </div>

      {/* Statistik Tim */}
      <div className="manager-section">
        <h3>Statistik Tim</h3>
        <div className="stats-cards">
          <div className="stat-card">
            <i className="fas fa-user-tie"></i>
            <div className="stat-info">
              <p>Manager</p>
              <span>{teamStats.manager}</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <div className="stat-info">
              <p>HRD</p>
              <span>{teamStats.hrd}</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-wallet"></i>
            <div className="stat-info">
              <p>Finance</p>
              <span>{teamStats.finance}</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-user"></i>
            <div className="stat-info">
              <p>Staff</p>
              <span>{teamStats.staff}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proyek & Tugas */}
      <div className="manager-section">
        <h3>Proyek & Tugas</h3>
        <table className="projects-table">
          <thead>
            <tr>
              <th>Nama Proyek</th>
              <th>Deadline</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{new Date(p.deadline).toLocaleDateString()}</td>
                <td>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.progress}%` }}>
                      {p.progress}%
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifikasi */}
      <div className="manager-section">
        <h3>Notifikasi</h3>
        <ul className="notifications">
          {notifications.map((n) => (
            <li key={n.id}>{n.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
