// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from "../utils/axios";
import SubmitFeedbackForm from '../components/SubmitFeedbackForm';
import MyFeedbacks from '../components/MyFeedbacks';

const StudentDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await API.get('/api/feedback/my-feedbacks');
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [refresh]);

  return (
    <div className="container p-4">
      <h2 className="text-2xl font-bold mb-4">🎓 Student Dashboard</h2>

      <SubmitFeedbackForm onFeedbackSubmit={() => setRefresh(!refresh)} />

      <hr className="my-4" />

      <MyFeedbacks feedbacks={feedbacks} onDelete={() => setRefresh(!refresh)} />
    </div>
  );
};

export default StudentDashboard;
