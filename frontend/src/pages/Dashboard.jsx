import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from "../utils/axios";

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    submitted: 0,
    drafts: 0,
    daysActive: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // Memoize fetchStats to prevent recreation on every render
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch submitted feedbacks count
      const feedbacksResponse = await API.get('/feedback/my-feedbacks');
      const submittedCount = feedbacksResponse.data.length;
      
      // Fetch drafts count
      const draftsResponse = await API.get('/feedback/drafts');
      const draftsCount = draftsResponse.data.length;
      
      // Calculate days active (since account creation)
      const createdAt = new Date(user.createdAt || Date.now());
      const currentDate = new Date();
      const daysActive = Math.floor((currentDate - createdAt) / (1000 * 60 * 60 * 24)) + 1;
      
      setStats({
        submitted: submittedCount,
        drafts: draftsCount,
        daysActive: daysActive
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    setMessage(`Welcome, ${user.name}!`);
    
    // Only fetch stats if we haven't already loaded them
    if (stats.submitted === 0 && stats.drafts === 0 && stats.daysActive === 0) {
      fetchStats();
    }
  }, [user, navigate, stats, fetchStats]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
            Student Feedback Portal
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={fetchStats}
              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {message}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your feedback submissions and drafts from this dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.submitted}
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Submitted Feedbacks
            </h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {stats.drafts}
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Drafts Saved
            </h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.daysActive}
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Days Active
            </h3>
          </div>
        </div>

{/* Quick Actions */}
{/* Quick Actions */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
    Quick Actions
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

    {/* Submit Feedback */}
    <Link 
      to="/submit-feedback" 
      className="flex flex-col items-center justify-center p-4 bg-green-100 dark:bg-green-900 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors group"
    >
      <div className="w-16 h-16 mb-3 flex items-center justify-center">
        <img 
          src="https://www.freeiconspng.com/uploads/writing-icon-1.png" 
          alt="Submit Feedback" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-green-800 dark:text-green-200 font-medium group-hover:text-green-900 dark:group-hover:text-green-100 transition-colors">
        Submit Feedback
      </span>
    </Link>

    {/* My Feedbacks */}
    <Link 
      to="/my-feedbacks" 
      className="flex flex-col items-center justify-center p-4 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors group"
    >
      <div className="w-16 h-16 mb-3 flex items-center justify-center">
        <img 
          src="https://www.freeiconspng.com/uploads/writing-icon-22.png" 
          alt="My Feedbacks" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-blue-800 dark:text-blue-200 font-medium group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors">
        My Feedbacks
      </span>
    </Link>

    {/* My Drafts */}
    <Link 
      to="/my-drafts" 
      className="flex flex-col items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors group"
    >
      <div className="w-16 h-16 mb-3 flex items-center justify-center">
        <img 
          src="https://www.svgrepo.com/show/357738/feedback.svg" 
          alt="My Drafts" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-yellow-800 dark:text-yellow-200 font-medium group-hover:text-yellow-900 dark:group-hover:text-yellow-100 transition-colors">
        My Drafts
      </span>
    </Link>

    {/* My Profile */}
    <Link 
      to="/profile" 
      className="flex flex-col items-center justify-center p-4 bg-purple-100 dark:bg-purple-900 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors group"
    >
      <div className="w-16 h-16 mb-3 flex items-center justify-center">
        <img 
          src="https://cdn.pixabay.com/animation/2023/06/13/15/13/15-13-11-358_512.gif" 
          alt="My Profile" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-purple-800 dark:text-purple-200 font-medium group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors">
        My Profile
      </span>
    </Link>

  </div>
</div>



        {/* Feedback Tips & Guidelines */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📝 Feedback Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                <i className="fas fa-lightbulb mr-2"></i>Effective Feedback
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                <li>• Be specific and provide examples</li>
                <li>• Focus on constructive criticism</li>
                <li>• Suggest improvements when possible</li>
                <li>• Maintain a respectful tone</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                <i className="fas fa-clock mr-2"></i>Best Practices
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <li>• Submit feedback promptly after classes</li>
                <li>• Use drafts to save incomplete feedback</li>
                <li>• Review your feedback before submitting</li>
                <li>• Check for responses from teachers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Status & Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Recent Updates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              🔄 Recent Updates
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded-full mr-3">
                  <i className="fas fa-check text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Draft saving improved</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Auto-save feature enhanced</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-800/40 p-2 rounded-full mr-3">
                  <i className="fas fa-bell text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">New notification system</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get alerts for teacher responses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              📊 Your Impact
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Feedback completion rate</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stats.submitted > 0 ? '100%' : '0%'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average feedbacks per week</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {stats.daysActive > 7 ? Math.round(stats.submitted / (stats.daysActive / 7)) : stats.submitted}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Draft conversion rate</span>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {stats.drafts > 0 ? Math.round((stats.submitted / (stats.submitted + stats.drafts)) * 100) + '%' : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg shadow-md p-6 mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Ready to make a difference?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your feedback helps improve the learning experience for everyone.
          </p>
          <Link 
            to="/submit-feedback" 
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            <i className="fas fa-pencil-alt mr-2"></i>
            Write Feedback Now
          </Link>
        </div>

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
  );
}