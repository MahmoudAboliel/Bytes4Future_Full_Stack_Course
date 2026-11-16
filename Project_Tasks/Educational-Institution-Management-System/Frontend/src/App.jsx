import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ToastProvider from "./context/ToastContext";
import { useAuth } from "./context/auth";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ApprovalsPage from "./pages/admin/ApprovalsPage";
import UsersControlPage from "./pages/admin/UsersControlPage";

import SecretaryDashboard from "./pages/secretary/SecretaryDashboard";
import StudentsCrudPage from "./pages/secretary/StudentsCrudPage";
import TeachersCrudPage from "./pages/secretary/TeachersCrudPage";
import CoursesPage from "./pages/secretary/CoursesPage";
import CohortsPage from "./pages/secretary/CohortsPage";
import SecretarySessionsPage from "./pages/secretary/SessionsPage";
import SecretaryNotesPage from "./pages/secretary/SecretaryNotesPage";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherSessionsPage from "./pages/teacher/SessionsPage";
import AttendancePage from "./pages/teacher/AttendancePage";
import GradesPage from "./pages/teacher/GradesPage";
import TeacherNotesPage from "./pages/teacher/NotesPage";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyCoursesPage from "./pages/student/MyCoursesPage";
import MyAttendancePage from "./pages/student/MyAttendancePage";
import MyGradesPage from "./pages/student/MyGradesPage";
import ProfilePage from "./pages/student/ProfilePage";

/** Route guard: requires an authenticated user with the expected role. */
function Guard({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={`/${user.role}`} replace /> : <RegisterPage />}
      />

      <Route
        path="/admin"
        element={
          <Guard role="admin">
            <Layout />
          </Guard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="secretaries" element={<UsersControlPage />} />
      </Route>

      <Route
        path="/secretary"
        element={
          <Guard role="secretary">
            <Layout />
          </Guard>
        }
      >
        <Route index element={<SecretaryDashboard />} />
        <Route path="students" element={<StudentsCrudPage />} />
        <Route path="teachers" element={<TeachersCrudPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="cohorts" element={<CohortsPage />} />
        <Route path="sessions" element={<SecretarySessionsPage />} />
        <Route path="notes" element={<SecretaryNotesPage />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <Guard role="teacher">
            <Layout />
          </Guard>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="sessions" element={<TeacherSessionsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="notes" element={<TeacherNotesPage />} />
      </Route>

      <Route
        path="/student"
        element={
          <Guard role="student">
            <Layout />
          </Guard>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<MyCoursesPage />} />
        <Route path="attendance" element={<MyAttendancePage />} />
        <Route path="grades" element={<MyGradesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? `/${user.role}` : "/"} replace />}
      />
    </Routes>
  );
}

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  </AuthProvider>
);

export default App;
