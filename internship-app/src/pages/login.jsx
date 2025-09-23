import React, { useState } from "react";
import "../assets/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = (await res.json()).message || "Login gagal";
        throw new Error(msg);
      }

      const data = await res.json();
      const user = data.user || data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);

      switch (user.role) {
        case "superadmin":
          window.location.href = "/superadmin-dashboard";
          break;
        case "manager":
          window.location.href = "/manager-dashboard";
          break;
        case "hrd":
          window.location.href = "/hrd-dashboard";
          break;
        case "finance":
          window.location.href = "/finance-dashboard";
          break;
        case "staff":
          window.location.href = "/staff-dashboard";
          break;
        default:
          throw new Error("Role tidak dikenali!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        {error && <div className="error-msg">{error}</div>}

        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            placeholder="Masukan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Masukan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
