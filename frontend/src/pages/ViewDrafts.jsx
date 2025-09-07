import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from "../utils/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function ViewDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [filteredDrafts, setFilteredDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        console.log('Fetching drafts...');
        const res = await API.get('/feedback/drafts');
        console.log('Drafts received:', res.data);
        // Sort drafts by date (newest first)
        const sortedDrafts = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDrafts(sortedDrafts);
        setFilteredDrafts(sortedDrafts);
      } catch (err) {
        console.error('Error fetching drafts:', err);
        toast.error('Failed to load drafts');
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...drafts];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(draft => draft.category === categoryFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(draft => 
        draft.teacher?.name?.toLowerCase().includes(term) ||
        draft.subject?.toLowerCase().includes(term) ||
        draft.feedbackText?.toLowerCase().includes(term) ||
        draft.category?.toLowerCase().includes(term)
      );
    }
    
    setFilteredDrafts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [drafts, categoryFilter, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrafts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditDraft = (draftId) => {
    navigate(`/submit-feedback?draftId=${draftId}`);
  };

  const handleSubmitDraft = async (draftId) => {
  setSubmittingId(draftId);
  try {
    console.log('Submitting draft:', draftId);
    const response = await API.put(`/feedback/submit-draft/${draftId}`);
    console.log('Submit response:', response.data);
    
    toast.success('Draft submitted successfully!');
    // Remove the submitted draft from the list
    const updatedDrafts = drafts.filter(d => d._id !== draftId);
    setDrafts(updatedDrafts);
  } catch (err) {
    console.error('Submit error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    toast.error(err.response?.data?.message || 'Failed to submit draft');
  } finally {
    setSubmittingId(null);
  }
};

  const handleDeleteDraft = async (draftId) => {
    setDeletingId(draftId);
    try {
      console.log('Attempting to delete draft:', draftId);
      const response = await API.delete(`/feedback/delete/${draftId}`);
      console.log('Delete response:', response.data);
      
      toast.success('Draft deleted successfully!');
      // Remove the deleted draft from the list
      const updatedDrafts = drafts.filter(d => d._id !== draftId);
      setDrafts(updatedDrafts);
    } catch (err) {
      console.error('Delete error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 404) {
        toast.error('Draft not found. It may have been already deleted.');
        // Remove from list even if not found on server
        const updatedDrafts = drafts.filter(d => d._id !== draftId);
        setDrafts(updatedDrafts);
      } else if (err.response?.status === 403) {
        toast.error('You are not authorized to delete this draft.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to delete draft');
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(drafts.map(draft => draft.category).filter(Boolean))];

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your drafts...</p>
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
            Your Draft Feedbacks
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your saved feedback drafts. You can edit, submit, or delete them.
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filter & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Drafts
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by teacher, subject, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Category
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
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
          Showing {filteredDrafts.length === 0 ? 0 : indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredDrafts.length)} of {filteredDrafts.length} draft items
          {searchTerm && ` for "${searchTerm}"`}
          {categoryFilter !== 'all' && ` in category "${categoryFilter}"`}
        </div>

        {filteredDrafts.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">
              {drafts.length === 0 
                ? "You don't have any saved drafts." 
                : "No drafts match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentItems.map(draft => (
                <div key={draft._id} className="border rounded-lg p-6 shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300"><strong>Teacher:</strong> {draft.teacher?.name || 'Unknown'}</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Subject:</strong> {draft.subject}</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Category:</strong> {draft.category}</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>Anonymous:</strong> {draft.isAnonymous ? 'Yes' : 'No'}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Rating:</strong> 
                        <span className="ml-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={i < draft.rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Created: {new Date(draft.createdAt).toLocaleDateString()}
                        {draft.updatedAt !== draft.createdAt && 
                          ` (Updated: ${new Date(draft.updatedAt).toLocaleDateString()})`}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleEditDraft(draft._id)}
                        disabled={deletingId === draft._id || submittingId === draft._id}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSubmitDraft(draft._id)}
                        disabled={deletingId === draft._id || submittingId === draft._id}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1 transition-colors"
                      >
                        {submittingId === draft._id ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft._id)}
                        disabled={deletingId === draft._id || submittingId === draft._id}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1 transition-colors"
                      >
                        {deletingId === draft._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="font-semibold text-gray-800 dark:text-white">Draft Content:</p>
                    <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded whitespace-pre-wrap text-gray-700 dark:text-gray-300">{draft.feedbackText}</p>
                  </div>
                  
                  {/* Display attached images */}
                  {draft.images && draft.images.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-gray-800 dark:text-white mb-2">Attached Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {draft.images.map((imgUrl, idx) => (
                          <a
                            key={idx}
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={imgUrl}
                              alt={`draft-img-${idx}`}
                              className="w-24 h-24 object-cover rounded border hover:scale-105 transition"
                              onError={(e) => {
                                console.log('Image failed to load:', imgUrl);
                                e.target.style.display = 'none';
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Draft status indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">
                      🗒️ Draft - Last saved: {new Date(draft.updatedAt).toLocaleString()}
                    </span>
                  </div>
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
                    className="px-3 py-1 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-8 h-8 rounded border transition-colors ${
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
                    className="px-3 py-1 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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