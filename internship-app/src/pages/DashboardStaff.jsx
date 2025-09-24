import React, { useEffect, useState } from "react";
import "../assets/staff.css";
import { useNavigate } from "react-router-dom";

export default function DashboardStaff() {
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); 
      return;
    }

    setName(localStorage.getItem("name") || "");

    setTasks([
      { id: 1, title: "Laporan Mingguan", status: "Belum Selesai" },
      { id: 2, title: "Update Database", status: "Sedang Dikerjakan" },
    ]);

    setNotifications([
      { id: 1, message: "Meeting dengan Manager pukul 10:00" },
      { id: 2, message: "Deadline laporan proyek besok" },
    ]);

    setLeaveRequests([
      { id: 1, date: "2025-09-28", status: "Disetujui" },
      { id: 2, date: "2025-10-05", status: "Menunggu" },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    navigate("/");
  };

  // Stats untuk card
  const stats = {
    tasksCount: tasks.length,
    leaveCount: leaveRequests.length,
    notificationsCount: notifications.length,
  };

  return (
    <div className="dashboard-staff">
      {/* Header */}
      <div className="header-bar">
        <h1 className="title">Dashboard Staff</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Selamat Datang */}
      <div className="user-info">
        <h2>Selamat Datang, {name}</h2>
      </div>

      {/* Cards Ringkasan */}
      <div className="cards">
        <div className="card tasks">
          <i className="fas fa-tasks"></i>
          <div className="card-value">{stats.tasksCount}</div>
          <div className="card-label">Tugas</div>
        </div>
        <div className="card leaves">
          <i className="fas fa-calendar-day"></i>
          <div className="card-value">{stats.leaveCount}</div>
          <div className="card-label">Cuti</div>
        </div>
        <div className="card notifications">
          <i className="fas fa-bell"></i>
          <div className="card-value">{stats.notificationsCount}</div>
          <div className="card-label">Notifikasi</div>
        </div>
      </div>

      {/* Tabel Tugas */}
      <div className="staff-section">
        <h3>Tugas</h3>
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Judul Tugas</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifikasi */}
      <div className="staff-section">
        <h3>Notifikasi</h3>
        <ul className="notifications-list">
          {notifications.map((n) => (
            <li key={n.id}>{n.message}</li>
          ))}
        </ul>
      </div>

      {/* Pengajuan Cuti */}
      <div className="staff-section">
        <h3>Pengajuan Cuti</h3>
        <table className="leave-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((l) => (
              <tr key={l.id}>
                <td>{l.date}</td>
                <td>{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
