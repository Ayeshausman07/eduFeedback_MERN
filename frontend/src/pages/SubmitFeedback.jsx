import { useState, useEffect } from "react";
import API from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubmitFeedback() {
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState("Other");
  const [isDraftMode, setIsDraftMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await API.get("/auth/teachers");
        setTeachers(res.data);
        if (res.data.length === 0) {
          setError("No teachers available. Please contact admin.");
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("Failed to load teachers list");
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const draftId = urlParams.get('draftId');
    
    if (draftId) {
      const loadDraft = async () => {
        try {
          const res = await API.get('/feedback/drafts');
          const draft = res.data.find(d => d._id === draftId);
          
          if (draft) {
            setSubject(draft.subject);
            setTeacherId(draft.teacher._id);
            setFeedbackText(draft.feedbackText);
            setRating(draft.rating);
            setIsAnonymous(draft.isAnonymous);
            setCategory(draft.category);
            setIsDraftMode(true);
          }
        } catch (err) {
          console.error('Error loading draft:', err);
          toast.error('Failed to load draft');
        }
      };
      
      loadDraft();
    }
  }, []);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (images.length + newFiles.length > 3) {
      toast.warn("You can only upload up to 3 images.");
      return;
    }

    const updatedImages = [...images, ...newFiles];
    const updatedPreviews = [
      ...previewUrls,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ];

    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previewUrls];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
  };

const handleSubmit = async (e, isDraftSubmission = false) => {
  e.preventDefault();
  
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user || user.role !== "student") {
    setError("Only students can submit feedback");
    toast.error("Please log in as a student to submit feedback");
    return;
  }

    if (!teacherId) {
      setError("Please select a teacher");
      toast.error("Please select a teacher");
      return;
    }

    if (!subject.trim()) {
      setError("Subject is required");
      toast.error("Please enter a subject");
      return;
    }

    if (!feedbackText.trim()) {
      setError("Feedback text is required");
      toast.error("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);
    setError("");

     try {
    const feedbackData = {
      subject: subject.trim(),
      teacher: teacherId,
      feedbackText: feedbackText.trim(),
      rating: Number(rating),
      isAnonymous: Boolean(isAnonymous),
      category: category || 'Other',
    };

    if (isDraftSubmission) {
      // Save as draft logic
      const urlParams = new URLSearchParams(window.location.search);
      const draftId = urlParams.get('draftId');
      
      if (images.length > 0) {
        const formData = new FormData();
        
        Object.entries(feedbackData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        for (const imageFile of images) {
          formData.append("images", imageFile);
        }

        if (draftId) {
          await API.put(`/feedback/save-draft/${draftId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("💾 Draft updated successfully!");
        } else {
          await API.post('/feedback/save-draft', formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("💾 Draft saved successfully!");
        }
      } else {
        if (draftId) {
          await API.put(`/feedback/save-draft/${draftId}`, feedbackData);
          toast.success("💾 Draft updated successfully!");
        } else {
          await API.post('/feedback/save-draft', feedbackData);
          toast.success("💾 Draft saved successfully!");
        }
      }
    } else {
      // Submit as regular feedback logic
      if (images.length > 0) {
        const formData = new FormData();
        
        Object.entries(feedbackData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        images.forEach((img) => {
          formData.append("images", img);
        });

        await API.post("/feedback/submit-image", formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await API.post("/feedback/submit", feedbackData);
      }
      toast.success("🎉 Feedback submitted successfully!");
    }

    // Reset form and navigate
    setSubject("");
    setTeacherId("");
    setFeedbackText("");
    setRating(5);
    setImages([]);
    setPreviewUrls([]);
    setIsAnonymous(false);
    setCategory("Other");
    
    setTimeout(() => {
      if (isDraftSubmission) {
        navigate("/my-drafts");
      } else {
        navigate("/my-feedbacks");
      }
    }, 1500);

  } catch (err) {
    // Error handling remains the same
     console.error("Submission error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link to="/dashboard" className="flex items-center text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 transition-colors">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
            Student Feedback Portal
          </h1>
          <div className="w-24"></div> {/* Spacer for balance */}
        </header>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyaTI2Mm1tMWkyM3VjMzFuNGdmajM5MnR0NDF3ZTVrNXk3dWR1dms0cSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/JOdoMjYu183JC1OqLc/giphy.gif" 
                alt="Submit Feedback" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {isDraftMode ? "Edit Feedback Draft" : "Share Your Feedback"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your feedback helps improve the learning experience for everyone
            </p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-6">
            {/* Teacher Selection */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <label className="block text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                <i className="fas fa-chalkboard-teacher mr-2"></i>
                Teacher Information
              </label>
              <select
                className="w-full p-3 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onChange={(e) => setTeacherId(e.target.value)}
                value={teacherId}
                required
                disabled={isSubmitting || teachers.length === 0}
              >
                <option value="">Select a Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <label className="block text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                  <i className="fas fa-tag mr-2"></i>
                  Category
                </label>
                <select
                  className="w-full p-3 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="Teaching Style">Teaching Style</option>
                  <option value="Behavior">Behavior</option>
                  <option value="Course Content">Course Content</option>
                  <option value="Grading">Grading</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Subject */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <label className="block text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
                  <i className="fas fa-book mr-2"></i>
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter subject title"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Feedback Text */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
              <label className="block text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                <i className="fas fa-comment-dots mr-2"></i>
                Your Feedback
              </label>
              <textarea
                className="w-full p-3 border border-yellow-300 dark:border-yellow-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Share your thoughts, suggestions, or experiences..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
                disabled={isSubmitting}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <label className="block text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">
                  <i className="fas fa-star mr-2"></i>
                  Rating ({rating}/5)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full h-2 bg-orange-200 dark:bg-orange-700 rounded-lg appearance-none cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {rating}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-orange-600 dark:text-orange-400 mt-2">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Anonymous Toggle */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl flex items-center justify-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div className={`block w-14 h-7 rounded-full ${isAnonymous ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition transform ${isAnonymous ? 'translate-x-7' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                    Submit anonymously
                  </div>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl">
              <label className="block text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                <i className="fas fa-images mr-2"></i>
                Upload Images (Optional)
              </label>
              <div className="flex items-center gap-4 mb-3">
                <label className="cursor-pointer bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-all duration-200 flex items-center">
                  <i className="fas fa-cloud-upload-alt mr-2"></i>
                  Choose Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {images.length}/3 images selected
                </span>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-indigo-200 dark:border-indigo-700 group-hover:border-indigo-400 dark:group-hover:border-indigo-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save as Draft
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isSubmitting || teachers.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made with ❤️ by <span className="font-medium text-green-600 dark:text-green-400">Ayesha</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Full Stack MERN Developer & UI/UX Enthusiast
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            © {new Date().getFullYear()} Student Feedback System. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}