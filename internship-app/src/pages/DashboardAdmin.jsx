import React, { useEffect, useState } from "react";
import "../assets/admin.css";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formUser, setFormUser] = useState({
    name: "",
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
  const token = localStorage.getItem("token");

  // ==== Ambil data user ====
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/users", {
      headers: { Authorization: "Bearer " + token },
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
      .catch(() => alert("Gagal mengambil data users"));
  }, [token]);

  // ==== Tambah / Update user ====
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editUser ? "PUT" : "POST";
    const url = editUser
      ? `http://localhost:5000/api/users/${editUser.id}`
      : "http://localhost:5000/api/users";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(formUser),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal menyimpan user");
        return res.json();
      })
      .then((data) => {
        if (editUser) {
          // update list
          setUsers((prev) =>
            prev.map((u) => (u.id === editUser.id ? data.user : u))
          );
        } else {
          setUsers((prev) => [...prev, data.user]);
        }
        setShowModal(false);
        setEditUser(null);
        setFormUser({ name: "", email: "", password: "", role: "manager" });
      })
      .catch(() => alert("Gagal menyimpan user"));
  };

  // ==== Edit user ====
  const handleEditUser = (user) => {
    setEditUser(user);
    setFormUser({ ...user, password: "" });
    setShowModal(true);
  };

  // ==== Delete user ====
  const handleDeleteUser = (user) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus user "${user.name}"?`
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/users/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal menghapus user");
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      })
      .catch(() => alert("Gagal menghapus user"));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-admin">
      {/* ===== Header ===== */}
      <div className="header-bar">
        <h1 className="title">Dashboard Super Admin</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* ===== Cards Summary ===== */}
      <div className="cards">
        {["manager", "hrd", "finance", "staff"].map((r) => (
          <div key={r} className={`card ${r}`}>
            <i
              className={
                r === "manager"
                  ? "fas fa-user-tie"
                  : r === "hrd"
                  ? "fas fa-users"
                  : r === "finance"
                  ? "fas fa-coins"
                  : "fas fa-user"
              }
            ></i>
            <div className="card-value">{stats[r]}</div>
            <div className="card-label">{r.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* ===== Users Table ===== */}
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
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Tanggal Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="capitalize">{u.role}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="action-col">
                    <button
                      className="icon-btn edit"
                      onClick={() => handleEditUser(u)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal Tambah / Edit ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editUser ? "Edit User" : "Tambah User Baru"}</h3>
            <form className="modal-form" onSubmit={handleSubmit}>
              <label>Nama</label>
              <input
                type="text"
                value={formUser.name}
                onChange={(e) =>
                  setFormUser({ ...formUser, name: e.target.value })
                }
                required
              />
              <label>Email</label>
              <input
                type="email"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser({ ...formUser, email: e.target.value })
                }
                required
              />
              <label>
                Password {editUser && "(biarkan kosong jika tidak diubah)"}
              </label>
              <input
                type="password"
                value={formUser.password}
                onChange={(e) =>
                  setFormUser({ ...formUser, password: e.target.value })
                }
              />
              <label>Role</label>
              <select
                value={formUser.role}
                onChange={(e) =>
                  setFormUser({ ...formUser, role: e.target.value })
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
