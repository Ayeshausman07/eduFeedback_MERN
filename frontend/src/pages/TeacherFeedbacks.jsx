import { useEffect, useState } from 'react';
import API from "../utils/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TeacherFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await API.get('/feedback/teacher'); // Using the new endpoint
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  if (loading) return <div className="p-4">Loading feedbacks...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Received Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedbacks received yet</p>
      ) : (
        feedbacks.map(fb => (
          <div key={fb._id} className="border p-4 mb-4 rounded-lg shadow-sm">
            <p><strong>Student:</strong> {fb.student?.name || 'Unknown'}</p>
            <p><strong>Subject:</strong> {fb.subject}</p>
            <p><strong>Rating:</strong> 
              <span className="ml-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < fb.rating ? 'text-yellow-500' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </span>
              ({fb.rating}/5)
            </p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 ${
                fb.status === 'Resolved' ? 'text-green-600' : 
                fb.status === 'In Progress' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {fb.status}
              </span>
            </p>
            <div className="mt-2">
              <strong>Feedback:</strong>
              <p className="mt-1 p-2 bg-gray-50 rounded">{fb.feedbackText}</p>
            </div>
            {fb.reply && (
              <div className="mt-2">
                <strong>Your Reply:</strong>
                <p className="mt-1 p-2 bg-blue-50 rounded">{fb.reply}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}