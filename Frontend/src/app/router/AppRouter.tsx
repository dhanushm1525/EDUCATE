import { Routes, Route } from "react-router-dom";

import LandingPage from "../../pages/auth/LandingPage";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import VerifyEmailPage from "../../pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";

import StudentDashboardPage from "../../pages/student/StudentDashboardPage";
import StudentProfilePage from "../../pages/student/StudentProfilePage";

import TeacherDashboard from "../../pages/teacher/TeacherDashboard";
import TeacherProfilePage from "../../pages/teacher/TeacherProfilePafe";
import CreateCoursePage from "../../pages/teacher/CreateCoursePage";
import MyCoursesPage from "../../pages/teacher/MyCoursesPage";
import CourseBuilderPage from "../../pages/teacher/CourseBuilderPage";
import LessonManagementPage from "../../pages/teacher/LessonManagementPage";
import AssignmentManagementPage from "../../pages/teacher/AssignmentManagementPage";

import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminProfilePage from "../../components/admin/AdminProfilePage";

import RoleRoute from "./RoleRoute";
import PublicRoute from "./PublicRoute";

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Student routes */}
      <Route element={<RoleRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentDashboardPage />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
      </Route>

      {/* Teacher routes */}
      <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfilePage />} />

        <Route path="/teacher/courses" element={<MyCoursesPage />} />
        <Route path="/teacher/courses/create" element={<CreateCoursePage />} />
        <Route
          path="/teacher/courses/:courseId"
          element={<CourseBuilderPage />}
        />

        <Route
          path="/teacher/courses/:courseId/chapters/:chapterId/lessons"
          element={<LessonManagementPage />}
        />

        <Route
          path="/teacher/courses/:courseId/chapters/:chapterId/lessons/:lessonId/assignment"
          element={<AssignmentManagementPage />}
        />
      </Route>

      {/* Admin routes */}
      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
      </Route>
    </Routes>
  );
}
