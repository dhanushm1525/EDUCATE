import { Routes, Route } from "react-router-dom";

import LandingPage from "../../pages/auth/LandingPage";

import LoginPage from "../../pages/auth/LoginPage";

import RegisterPage from "../../pages/auth/RegisterPage";

import VerifyEmailPage from "../../pages/auth/VerifyEmailPage";



import TeacherDashboard from "../../pages/teacher/TeacherDashboard";

import AdminDashboard from "../../pages/admin/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Student Routes */}

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <LandingPage/>
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
