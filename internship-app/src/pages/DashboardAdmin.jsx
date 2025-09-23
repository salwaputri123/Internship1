import React, { useEffect, useState } from "react";
import "../assets/DashboardAdmin.css";
import { useNavigate } from "react-router-dom"; // pastikan pakai react-router

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "manager",
  });
  const [stats, setStats] = useState({
    manager: 0,
    hrd: 0,
    finance: 0,
    staff: 0,
  });

  const navigate = useNavigate();

  // Ambil data user ketika pertama kali load
  useEffect(() => {
    fetch("http://localhost:5000/api/superadmin/users", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        const count = { manager: 0, hrd: 0, finance: 0, staff: 0 };
        data.forEach((u) => {
          if (count[u.role] !== undefined) count[u.role]++;
        });
        setStats(count);
      })
      .catch(() => {});
  }, []);

  // Tambah user baru
  const handleAddUser = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/superadmin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal menambah user");
        return res.json();
      })
      .then((data) => {
        setUsers((prev) => [...prev, data]);
        setShowModal(false);
        setNewUser({ email: "", password: "", role: "manager" });

        // update statistik
        setStats((prev) => ({
          ...prev,
          [data.role]: prev[data.role] + 1,
        }));
      })
      .catch(() => alert("Gagal menambah user"));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-admin">
      {/* ====== Header ====== */}
      <div className="header-bar">
        <h1 className="title">Dashboard Super Admin</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* ====== Cards Summary ====== */}
      <div className="cards">
        <div className="card">
          <i className="fas fa-user-tie fa-2x" style={{ color: "#007bff" }}></i>
          <div className="card-value">{stats.manager}</div>
          <div className="card-label">Manager</div>
        </div>
        <div className="card">
          <i className="fas fa-users fa-2x" style={{ color: "#28a745" }}></i>
          <div className="card-value">{stats.hrd}</div>
          <div className="card-label">HRD</div>
        </div>
        <div className="card">
          <i className="fas fa-coins fa-2x" style={{ color: "#ffc107" }}></i>
          <div className="card-value">{stats.finance}</div>
          <div className="card-label">Finance</div>
        </div>
        <div className="card">
          <i className="fas fa-user fa-2x" style={{ color: "#17a2b8" }}></i>
          <div className="card-value">{stats.staff}</div>
          <div className="card-label">Staff</div>
        </div>
      </div>

      {/* ====== Users Section ====== */}
      <div className="users-section">
        <div className="users-header">
          <h2>Data Users</h2>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Tambah User
          </button>
        </div>

        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Tanggal Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td className="capitalize">{u.role}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== Modal Tambah User ====== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Tambah User Baru</h3>
            <form className="modal-form" onSubmit={handleAddUser}>
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />

              <label>Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />

              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="manager">Manager</option>
                <option value="hrd">HRD</option>
                <option value="finance">Finance</option>
                <option value="staff">Staff</option>
              </select>

              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Simpan
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
