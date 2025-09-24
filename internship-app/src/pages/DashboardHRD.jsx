import React, { useEffect, useState } from "react";
import "../assets/HRD.css";
import { useNavigate } from "react-router-dom";

export default function DashboardHRD() {
  const [name, setName] = useState("");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    absentToday: 0,
    pendingRequests: 0,
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Ambil data HRD (dummy fetch)
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    setName(localStorage.getItem("name") || "");

    // Dummy stats
    setStats({
      totalEmployees: 25,
      onLeaveToday: 3,
      absentToday: 2,
      pendingRequests: 4,
    });

    // Dummy leave requests
    setLeaveRequests([
      { id: 1, name: "Budi Santoso", type: "Cuti Tahunan", status: "Menunggu", date: "2025-09-24" },
      { id: 2, name: "Siti Aminah", type: "Sakit", status: "Disetujui", date: "2025-09-23" },
      { id: 3, name: "Andi Wijaya", type: "Cuti Tahunan", status: "Menunggu", date: "2025-09-25" },
    ]);

    // Dummy notifications
    setNotifications([
      { id: 1, message: "Update kebijakan cuti perusahaan." },
      { id: 2, message: "Reminder evaluasi performa karyawan minggu ini." },
    ]);
  }, [token, navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <div className="dashboard-hrd">
      {/* Header */}
      <div className="header-bar">
        <h1 className="title">Dashboard HRD</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* User Info */}
      <div className="user-info">
        <h2>Selamat Datang, {name}</h2>
      </div>

      {/* Cards Summary */}
      <div className="cards">
        <div className="card manager">
          <i className="fas fa-users"></i>
          <div className="card-value">{stats.totalEmployees}</div>
          <div className="card-label">Total Karyawan</div>
        </div>
        <div className="card hrd">
          <i className="fas fa-plane-departure"></i>
          <div className="card-value">{stats.onLeaveToday}</div>
          <div className="card-label">Cuti Hari Ini</div>
        </div>
        <div className="card finance">
          <i className="fas fa-user-times"></i>
          <div className="card-value">{stats.absentToday}</div>
          <div className="card-label">Tidak Hadir</div>
        </div>
        <div className="card staff">
          <i className="fas fa-clock"></i>
          <div className="card-value">{stats.pendingRequests}</div>
          <div className="card-label">Pengajuan Menunggu</div>
        </div>
      </div>

      {/* Table Pengajuan Cuti */}
      <div className="table-section">
        <h3>Pengajuan Cuti Terbaru</h3>
        <table className="leave-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis Cuti</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.type}</td>
                <td className={req.status === "Menunggu" ? "pending" : "approved"}>
                  {req.status}
                </td>
                <td>{req.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifications */}
      <div className="notification-section">
        <h3>Notifikasi</h3>
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>{n.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
