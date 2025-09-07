import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import API from "../utils/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewMyFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/feedback/my-feedbacks');
        // Sort feedbacks by date (newest first)
        const sortedFeedbacks = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setFeedbacks(sortedFeedbacks);
        setFilteredFeedbacks(sortedFeedbacks);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        toast.error('Failed to load your feedbacks');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...feedbacks];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(fb => fb.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(fb => 
        fb.teacher?.name?.toLowerCase().includes(term) ||
        fb.subject?.toLowerCase().includes(term) ||
        fb.feedbackText?.toLowerCase().includes(term) ||
        fb.category?.toLowerCase().includes(term)
      );
    }
    
    setFilteredFeedbacks(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [feedbacks, statusFilter, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your feedbacks...</p>
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
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Your Feedback History
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage all your submitted feedback in one place.
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filter & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Feedback
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by teacher, subject, or feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            
            {/* Items Per Page Selector */}
            <div>
              <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Items per Page
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="3">3 per page</option>
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          Showing {filteredFeedbacks.length === 0 ? 0 : indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredFeedbacks.length)} of {filteredFeedbacks.length} feedback items
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>

        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">
              {feedbacks.length === 0 
                ? "You haven't submitted any feedback yet." 
                : "No feedback matches your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentItems.map(fb => (
                <div key={fb._id} className="border rounded-lg p-6 shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Teacher:</strong> {fb.teacher?.name || 'Unknown'}</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Subject:</strong> {fb.subject}</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Category:</strong> {fb.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Anonymous:</strong> {fb.isAnonymous ? 'Yes' : 'No'}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Rating:</strong> 
                        <span className="ml-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </span>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          fb.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          fb.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {fb.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Submitted: {new Date(fb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 dark:text-white">Your Feedback:</p>
                    <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">{fb.feedbackText}</p>
                  </div>

                  {/* Image Preview Section */}
                  {fb.images && fb.images.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-800 dark:text-white mb-2">Attached Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {fb.images.map((imgUrl, idx) => (
                          <a
                            key={idx}
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={imgUrl}
                              alt={`feedback-img-${idx}`}
                              className="w-24 h-24 object-cover rounded border hover:scale-105 transition"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teacher Reply Section */}
                  {fb.reply ? (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
                      <p className="font-semibold text-blue-800 dark:text-blue-200">Teacher's Response:</p>
                      <p className="mt-1 text-blue-700 dark:text-blue-200">{fb.reply}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                        Responded on: {new Date(fb.respondedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                      No response yet from the teacher.
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-8 h-8 rounded border ${
                        currentPage === page 
                          ? 'bg-green-500 text-white border-green-500' 
                          : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
        
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
  );
}