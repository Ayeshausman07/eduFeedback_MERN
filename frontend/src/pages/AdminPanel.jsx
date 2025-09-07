import { useEffect, useState } from 'react';
import API from '../utils/axios';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalTeachers: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleBlockToggle = async (userId) => {
    try {
      const res = await API.put(`/auth/toggle-block/${userId}`);
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isBlocked: res.data.isBlocked } : user
      );
      setUsers(updatedUsers);
      
      // Update stats
      const blockedCount = updatedUsers.filter(u => u.isBlocked).length;
      const activeCount = updatedUsers.length - blockedCount;
      setStats(prev => ({
        ...prev,
        activeUsers: activeCount,
        blockedUsers: blockedCount
      }));
      
      toast.success(`User ${res.data.isBlocked ? 'blocked' : 'unblocked'} successfully`);
    } catch (err) {
      console.error('Failed to update block status', err);
      toast.error('Failed to update user status');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/auth/users');
        const filteredUsers = res.data.filter(user => user.role !== 'admin');
        setUsers(filteredUsers);
        
        // Calculate stats
        const blockedCount = filteredUsers.filter(u => u.isBlocked).length;
        const teacherCount = filteredUsers.filter(u => u.role === 'teacher').length;
        
        setStats({
          totalUsers: filteredUsers.length,
          activeUsers: filteredUsers.length - blockedCount,
          blockedUsers: blockedCount,
          totalTeachers: teacherCount
        });
      } catch (err) {
        console.error('Failed to fetch users', err);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">
            {user?.role === 'admin' ? 'Admin' : 'Teacher'} Panel
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavLink 
            to="/admin/users"
            end
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <span className="mr-3">👥</span>
            User Management
          </NavLink>
          
          <NavLink 
            to="/admin/feedback-management"
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <span className="mr-3">💬</span>
            Feedback Management
          </NavLink>
          
          <NavLink 
            to="/admin/teacher-management"
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <span className="mr-3">🎓</span>
            Teacher Management
          </NavLink>
            <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
          
          {/* {user?.role === 'admin' && (
            <NavLink 
              to="/admin/system-settings"
              className={({isActive}) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <span className="mr-3">⚙️</span>
              System Settings
            </NavLink>
          )} */}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
              Student Feedback Portal - {user?.role === 'admin' ? 'Admin' : 'Teacher'} Dashboard
            </h1>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.totalUsers}
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Total Users
              </h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.activeUsers}
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Active Users
              </h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                {stats.blockedUsers}
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Blocked Users
              </h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stats.totalTeachers}
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Teachers
              </h3>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Outlet context={{ users, handleBlockToggle }} />
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              📊 System Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">User activation rate</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) + '%' : '0%'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Teacher percentage</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {stats.totalUsers > 0 ? Math.round((stats.totalTeachers / stats.totalUsers) * 100) + '%' : '0%'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Blocked accounts</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {stats.blockedUsers}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Admin role</span>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400 capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Made with ❤️ by <span className="font-medium text-green-600 dark:text-green-400">Ayesha</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Full Stack MERN Developer & UI/UX Enthusiast
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  © {new Date().getFullYear()} Student Feedback System. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}