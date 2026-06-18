import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import SessionDetails from './pages/SessionDetails.jsx';
import AdminCourses from './pages/admin/AdminCourses.jsx';
// import AdminSessions from './pages/admin/AdminSessions.jsx';
// import AdminMaterials from './pages/admin/AdminMaterials.jsx';
// import AdminEnrollments from './pages/admin/AdminEnrollments.jsx';
import Spinner from './components/common/Spinner.jsx';

function App() {
  const { loading } = useAuth();

  // Show a loading indicator while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 font-persian">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/session/:id" element={<SessionDetails />} />

        {/* Admin routes */}
        <Route path="/admin/courses" element={<AdminCourses />} />
        {/* <Route path="/admin/course/:courseId/sessions" element={<AdminSessions />} />
        <Route path="/admin/session/:sessionId/materials" element={<AdminMaterials />} />
        <Route path="/admin/course/:courseId/enrollments" element={<AdminEnrollments />} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;