import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Halaman
import Login from "./pages/login";            
import DashboardAdmin from "./pages/DashboardAdmin"; 
import DashboardManager from "./pages/DashboardManager"; 
import DashboardHRD from "./pages/DashboardHRD"; 
import DashboardFinance from "./pages/DashboardFinance"; 
import DashboardStaff from "./pages/DashboardStaff"; 

// Komponen proteksi: cek token di localStorage
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login (default) */}
        <Route path="/" element={<Login />} />

        {/* Halaman Dashboard Super Admin */}
        <Route
          path="/superadmin-dashboard"
          element={
            <PrivateRoute>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />

        {/* Halaman Dashboard Manager */}
        <Route
          path="/manager-dashboard"
          element={
            <PrivateRoute>
              <DashboardManager />
            </PrivateRoute>
          }
        />

        {/* Halaman Dashboard HRD */}
        <Route
          path="/hrd-dashboard"
          element={
            <PrivateRoute>
              <DashboardHRD />
            </PrivateRoute>
          }
        />

        {/* Halaman Dashboard Finance */}
        <Route
          path="/finance-dashboard"
          element={
            <PrivateRoute>
              <DashboardFinance />
            </PrivateRoute>
          }
        />

        {/* Halaman Dashboard Staff */}
        <Route
          path="/staff-dashboard"
          element={
            <PrivateRoute>
              <DashboardStaff />
            </PrivateRoute>
          }
        />

        {/* Redirect jika URL tidak dikenali */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
