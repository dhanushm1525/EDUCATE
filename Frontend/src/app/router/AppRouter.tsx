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

import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";

import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";
import StudentProfilePage from "../../pages/student/StudentProfilePage";
import TeacherProfilePage from "../../pages/teacher/TeacherProfilePafe";
import AdminProfilePage from "../../components/admin/AdminProfilePage";

export function AppRouter() {
  return (
    <Routes>
      {/* 
          PUBLIC ROUTES
       */}

      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* 
          STUDENT ROUTES
       */}

      <Route element={<RoleRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentDashboardPage />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
      </Route>

      {/* 
          TEACHER ROUTES
       */}

      <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfilePage />} />
      </Route>

      {/* 
          ADMIN ROUTES
      */}

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
      </Route>
    </Routes>
  );
}
