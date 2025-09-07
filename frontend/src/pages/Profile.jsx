import { useRef, useState } from 'react';
import API from '../utils/axios';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || '');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      console.warn("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');

      const res = await API.post('/auth/upload-profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const updatedUser = { ...user, profileImage: res.data.profileImage };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Profile image updated successfully! 🎉');
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error?.response?.data);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
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
          <div className="w-24"></div>
        </header>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="https://cdn.pixabay.com/animation/2023/06/13/15/13/15-13-11-358_512.gif" 
                alt="Profile" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Student Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your account information and profile settings
            </p>
          </div>

          {/* Profile Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'profile'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <i className="fas fa-user-circle mr-2"></i>
              Profile Info
            </button>
            {/* <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'security'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <i className="fas fa-shield-alt mr-2"></i>
              Security
            </button> */}
            {/* <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'preferences'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <i className="fas fa-cog mr-2"></i>
              Preferences
            </button> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Information */}
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
                  <i className="fas fa-user-circle mr-2"></i>
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                      Full Name
                    </label>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 text-gray-800 dark:text-white">
                      {user?.name || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                      Email Address
                    </label>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 text-gray-800 dark:text-white">
                      {user?.email || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                      Account Role
                    </label>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 text-gray-800 dark:text-white capitalize">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <i className="fas fa-shield-alt mr-1"></i>
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {user?.createdAt && (
                    <div>
                      <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                        Member Since
                      </label>
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 text-gray-800 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Activity */}
           <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
    <i className="fas fa-info-circle mr-2"></i>
    Platform Insights
  </h3>

  <div className="space-y-3">
    {/* Quick Facts */}
    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
        <i className="fas fa-book-open text-green-600 dark:text-green-400"></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">Subjects Covered</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">12 courses this semester</p>
      </div>
    </div>

    {/* Teacher Stats */}
    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
        <i className="fas fa-chalkboard-teacher text-blue-600 dark:text-blue-400"></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">Active Teachers</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">8 instructors receiving feedback</p>
      </div>
    </div>

    {/* Feedback Count */}
    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
        <i className="fas fa-comments text-purple-600 dark:text-purple-400"></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">Feedback Collected</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">120+ student responses this term</p>
      </div>
    </div>

    {/* Guideline / Note */}
    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full mr-3">
        <i className="fas fa-lightbulb text-yellow-600 dark:text-yellow-400"></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">Guideline</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">All feedback remains anonymous & confidential</p>
      </div>
    </div>
  </div>
</div>

            </div>

            {/* Profile Image Section */}
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                  <i className="fas fa-camera mr-2"></i>
                  Profile Picture
                </h3>

                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={
                        preview ||
                        'https://cdn-icons-png.flaticon.com/512/194/194931.png'
                      }
                      alt="Profile Preview"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl"
                    />
                    <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 shadow-lg">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                </div>

                {/* File Selection */}
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {selectedImage && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center">
                        <i className="fas fa-file-image mr-2"></i>
                        Selected: <span className="font-medium ml-1 truncate">{selectedImage.name}</span>
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                    >
                      <i className="fas fa-image"></i>
                      Choose New Image
                    </button>

                    <button
                      onClick={handleUpload}
                      disabled={uploading || !selectedImage}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-cloud-upload-alt"></i>
                          Upload Image
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <p>Supported formats: JPG, PNG, GIF</p>
                    <p>Max file size: 5MB</p>
                  </div>
                </div>
              </div>

              {/* System Preferences */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-4 flex items-center">
                  <i className="fas fa-palette mr-2"></i>
                  Display Preferences
                </h3>
                
                <div className="space-y-4">
                  {/* <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div> */}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Feedback Reminders</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
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