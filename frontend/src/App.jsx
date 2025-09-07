// src/App.jsx (corrected)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import SubmitFeedback from "./pages/SubmitFeedback";
import ViewMyFeedback from "./pages/ViewMyFeedback";
import TeacherFeedbacks from "./pages/TeacherFeedbacks";
import AdminFeedbackPanel from "./pages/AdminFeedbackPanel";
import TeacherManagement from "./pages/TeacherManagement";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import ViewDrafts from "./pages/ViewDrafts";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} /> {/* Landing page at root */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Student Routes - Dashboard at /dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-feedback"
          element={
            <ProtectedRoute>
              <SubmitFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-feedbacks"
          element={
            <ProtectedRoute>
              <ViewMyFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-drafts"
          element={
            <ProtectedRoute>
              <ViewDrafts />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher-feedbacks"
          element={
            <ProtectedRoute teacherOnly>
              <TeacherFeedbacks />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="feedback-management" element={<AdminFeedbackPanel />} />
          <Route path="teacher-management" element={<TeacherManagement />} />
        </Route>

        {/* Legacy route redirects */}
        <Route
          path="/admin-feedbacks"
          element={
            <ProtectedRoute adminOnly>
              <AdminFeedbackPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}