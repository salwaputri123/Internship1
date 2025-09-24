// src/pages/DashboardFinance.jsx
import React, { useEffect, useState } from "react";
import "../assets/finance.css";
import { useNavigate } from "react-router-dom";

export default function DashboardFinance() {
  const [name, setName] = useState("");
  const [stats, setStats] = useState({
    saldo: 0,
    totalTransaksi: 0,
    gajiBulanIni: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Ambil data user & keuangan
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    setName(localStorage.getItem("name") || "");

    // Fetch statistik keuangan
    fetch("http://localhost:5000/api/finance/stats", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch(() => console.log("Gagal mengambil statistik"));

    // Fetch transaksi terbaru
    fetch("http://localhost:5000/api/finance/transactions", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch(() => console.log("Gagal mengambil transaksi"));

    // Fetch notifikasi
    fetch("http://localhost:5000/api/finance/notifications", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => console.log("Gagal mengambil notifikasi"));
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <div className="dashboard-finance">
      {/* Header */}
      <div className="header-bar">
        <h1 className="title">Dashboard Finance</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* User Info */}
      <div className="user-info">
        <h2>Selamat Datang, {name}</h2>
      </div>

      {/* Ringkasan Keuangan */}
      <div className="finance-summary">
        <div className="card">
          <i className="fas fa-wallet"></i>
          <div className="card-value">Rp {stats.saldo?.toLocaleString()}</div>
          <div className="card-label">Saldo</div>
        </div>
        <div className="card">
          <i className="fas fa-exchange-alt"></i>
          <div className="card-value">{stats.totalTransaksi}</div>
          <div className="card-label">Transaksi</div>
        </div>
        <div className="card">
          <i className="fas fa-coins"></i>
          <div className="card-value">
            Rp {stats.gajiBulanIni?.toLocaleString()}
          </div>
          <div className="card-label">Gaji Bulan Ini</div>
        </div>
      </div>

      {/* Tabel Transaksi Terbaru */}
      <div className="finance-section">
        <h3>Transaksi Terbaru</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Jumlah</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t, index) => (
                <tr key={t.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.description}</td>
                  <td>Rp {t.amount.toLocaleString()}</td>
                  <td>{t.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Tidak ada transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notifikasi */}
      <div className="finance-section">
        <h3>Notifikasi</h3>
        <ul className="notifications">
          {notifications.length > 0 ? (
            notifications.map((n) => <li key={n.id}>{n.message}</li>)
          ) : (
            <li>Tidak ada notifikasi</li>
          )}
        </ul>
      </div>
    </div>
  );
}
