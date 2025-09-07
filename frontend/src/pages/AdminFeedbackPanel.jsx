import { useEffect, useState } from 'react';
import API from "../utils/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminFeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/feedback/all');
      // Sort by newest first by default
      const sortedFeedbacks = res.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFeedbacks(sortedFeedbacks);
      setFilteredFeedbacks(sortedFeedbacks);
      
      // Extract unique teachers for filter
      const teacherSet = new Set();
      const teacherList = [];
      
      sortedFeedbacks.forEach(fb => {
        if (fb.teacher && fb.teacher._id && !teacherSet.has(fb.teacher._id)) {
          teacherSet.add(fb.teacher._id);
          teacherList.push({
            id: fb.teacher._id,
            name: fb.teacher.name || 'Unknown Teacher'
          });
        }
      });
      
      setTeachers(teacherList);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...feedbacks];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(fb => fb.status === statusFilter);
    }
    
    // Apply rating filter
    if (ratingFilter !== 'all') {
      result = result.filter(fb => fb.rating === parseInt(ratingFilter));
    }
    
    // Apply teacher filter - FIXED: Compare by teacher ID
    if (teacherFilter !== 'all') {
      result = result.filter(fb => fb.teacher && fb.teacher._id === teacherFilter);
    }
    
    // Apply search term - FIXED: Handle anonymous students properly
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(fb => {
        // Check if student is not anonymous before searching by name
        const studentMatch = !fb.isAnonymous && fb.student?.name?.toLowerCase().includes(term);
        return (
          studentMatch ||
          fb.teacher?.name?.toLowerCase().includes(term) ||
          fb.subject?.toLowerCase().includes(term) ||
          fb.feedbackText?.toLowerCase().includes(term) ||
          (fb.category && fb.category.toLowerCase().includes(term))
        );
      });
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'rating-high') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating-low') {
      result.sort((a, b) => a.rating - b.rating);
    }
    
    setFilteredFeedbacks(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [feedbacks, statusFilter, ratingFilter, teacherFilter, searchTerm, sortBy]);

  // Pagination logic - FIXED: Ensure current page is valid
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage) || 1;

  // Ensure current page is within valid range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleReplySubmit = async (feedbackId) => {
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      const response = await API.put(`/feedback/respond/${feedbackId}`, {
        reply: replyText
      });

      if (response.data.success) {
        toast.success('Reply submitted successfully!');
        setFeedbacks(feedbacks.map(fb =>
          fb._id === feedbackId ? {
            ...fb,
            reply: response.data.data.reply,
            status: response.data.data.status,
            respondedAt: response.data.data.respondedAt
          } : fb
        ));
        setReplyingTo(null);
        setReplyText('');
      } else {
        toast.error(response.data.message || 'Failed to submit reply');
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit reply';
      toast.error(errorMsg);
    }
  };

  const handleStatusUpdate = async (feedbackId, newStatus) => {
    try {
      await API.put(`/feedback/status/${feedbackId}`, { status: newStatus });
      toast.success('Status updated successfully');
      
      // Update local state instead of refetching
      setFeedbacks(prev => prev.map(fb => 
        fb._id === feedbackId ? { ...fb, status: newStatus } : fb
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleStartReply = (feedback) => {
    setReplyingTo(feedback._id);
    setReplyText(feedback.reply || '');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Feedback Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Monitor and manage all student feedback across the platform
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filter & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Feedback
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by student, teacher, subject, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
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
            
            {/* Rating Filter */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rating
              </label>
              <select
                id="rating"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Ratings</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            
            {/* Teacher Filter */}
            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teacher
              </label>
              <select
                id="teacher"
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating-high">Rating (High to Low)</option>
                <option value="rating-low">Rating (Low to High)</option>
              </select>
            </div>
          </div>
          
          {/* Items Per Page Selector and Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Items per Page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredFeedbacks.length === 0 ? 0 : indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredFeedbacks.length)} of {filteredFeedbacks.length} feedback items
            </div>
          </div>
        </div>

        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl text-gray-400 dark:text-gray-500 mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
              No Feedbacks Found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {feedbacks.length === 0 
                ? "No feedbacks have been submitted yet." 
                : "No feedback matches your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentItems.map(feedback => (
                <div key={feedback._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Student:</strong> {feedback.isAnonymous ? 'Anonymous' : feedback.student?.name || 'Unknown'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Teacher:</strong> {feedback.teacher?.name || 'Unknown'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Subject:</strong> {feedback.subject}
                      </p>
                      {feedback.category && <p className="text-gray-700 dark:text-gray-300">
                        <strong>Category:</strong> {feedback.category}
                      </p>}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Rating:</strong>
                        <span className="ml-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({feedback.rating}/5)</span>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          feedback.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          feedback.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {feedback.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Submitted: {new Date(feedback.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <select
                        value={feedback.status}
                        onChange={(e) => handleStatusUpdate(feedback._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <button
                        onClick={() => handleStartReply(feedback)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
                      >
                        {feedback.reply ? 'Edit Reply' : 'Add Reply'}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 dark:text-white">Feedback:</p>
                    <p className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                      {feedback.feedbackText}
                    </p>
                  </div>

                  {/* Image Attachments */}
                  {feedback.images?.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-800 dark:text-white mb-2">Uploaded Images:</p>
                      <div className="flex flex-wrap gap-3">
                        {feedback.images.map((imgUrl, idx) => (
                          <a
                            key={idx}
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={imgUrl}
                              alt={`Feedback image ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded border hover:scale-105 transition"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply section */}
                  {replyingTo === feedback._id ? (
                    <div className="mt-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full p-3 border rounded focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={4}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={handleCancelReply}
                          className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReplySubmit(feedback._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Submit Reply
                        </button>
                      </div>
                    </div>
                  ) : feedback.reply ? (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <p className="font-semibold text-blue-800 dark:text-blue-200">Your Reply:</p>
                      <p className="mt-2 text-blue-700 dark:text-blue-200">{feedback.reply}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                        Replied on: {new Date(feedback.respondedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {/* Show page numbers with ellipsis for many pages */}
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    // Adjust if we're near the end
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }
                    
                    // First page and ellipsis if needed
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => paginate(1)}
                          className="w-8 h-8 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="ellipsis1" className="px-1 text-gray-500">...</span>);
                      }
                    }
                    
                    // Page numbers
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => paginate(i)}
                          className={`w-8 h-8 rounded border transition-colors ${
                            currentPage === i 
                              ? 'bg-green-500 text-white border-green-500' 
                              : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    // Last page and ellipsis if needed
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-1 text-gray-500">...</span>);
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => paginate(totalPages)}
                          className="w-8 h-8 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                        >
                          {totalPages}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}