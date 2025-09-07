import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProtectedRoute({ 
  children, 
  adminOnly = false, 
  teacherOnly = false 
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (!storedToken) {
          throw new Error('No authentication token found');
        }

        const parsedUser = storedUser && storedUser !== 'undefined' 
          ? JSON.parse(storedUser) 
          : null;
          
        setUser(parsedUser);
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin only route check (allow both admin and teacher)
  if (adminOnly && !['admin', 'teacher'].includes(user.role)) {
    toast.error('Admin access required');
    return <Navigate to="/dashboard" replace />;
  }

  // Teacher only route check (admins can also access teacher routes)
  if (teacherOnly && !['teacher', 'admin'].includes(user.role)) {
    toast.error('Teacher access required');
    return <Navigate to="/dashboard" replace />;
  }

  // If user is teacher trying to access student routes, redirect to admin panel
  if (!adminOnly && !teacherOnly && user.role === 'teacher') {
    return <Navigate to="/admin" replace />;
  }

  // If user is student trying to access admin/teacher routes, redirect to dashboard
  if ((adminOnly || teacherOnly) && user.role === 'student') {
    toast.error('Access denied. Insufficient permissions.');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}