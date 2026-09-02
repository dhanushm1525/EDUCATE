import { Routes, Route } from "react-router-dom";

import LandingPage from "../../pages/auth/LandingPage";

import LoginPage from "../../pages/auth/LoginPage";

import RegisterPage from "../../pages/auth/RegisterPage";

import VerifyEmailPage from "../../pages/auth/VerifyEmailPage";

import StudentDashboardPage from "../../pages/student/StudentDashboardPage";

import TeacherDashboard from "../../pages/teacher/TeacherDashboard";

import AdminDashboard from "../../pages/admin/AdminDashboard";

import RoleRoute from "./RoleRoute";

import PublicRoute from "./PublicRoute";

export function AppRouter() {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* =========================
          STUDENT ROUTES
      ========================= */}

      <Route element={<RoleRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentDashboardPage />} />
      </Route>

      {/* =========================
          TEACHER ROUTES
      ========================= */}

      <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>

      {/* =========================
          ADMIN ROUTES
      ========================= */}

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
