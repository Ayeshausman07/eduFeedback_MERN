import { useEffect, useState } from 'react';
import API from '../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/teachers');
      setTeachers(res.data);
    } catch (err) {
      console.error('Failed to fetch teachers', err);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (teacherId, currentStatus) => {
    try {
      await API.put(`/admin/teachers/${teacherId}`, {
        isBlocked: !currentStatus
      });
      setTeachers(teachers.map(teacher => 
        teacher._id === teacherId 
          ? { ...teacher, isBlocked: !currentStatus } 
          : teacher
      ));
      toast.success(`Teacher ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
    } catch (err) {
      console.error('Failed to update teacher status', err);
      toast.error('Failed to update teacher status');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher._id);
    setEditFormData({
      name: teacher.name,
      email: teacher.email
    });
  };

  const handleEditSubmit = async (teacherId) => {
    try {
      const res = await API.put(`/admin/teachers/${teacherId}`, editFormData);
      setTeachers(teachers.map(teacher => 
        teacher._id === teacherId 
          ? { ...teacher, ...res.data } 
          : teacher
      ));
      setEditingTeacher(null);
      toast.success('Teacher updated successfully');
    } catch (err) {
      console.error('Failed to update teacher', err);
      toast.error('Failed to update teacher');
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Teacher Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage teacher accounts, update information, and control access.
        </p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Teachers
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {teachers.length}
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Teachers
          </h3>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">👨‍🏫</div>
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No teachers found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms' : 'No teachers available in the system'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map(teacher => (
                  <tr key={teacher._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="p-4">
                      {editingTeacher === teacher._id ? (
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          className="w-full px-3 py-1 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                      ) : (
                        <span className="text-sm text-gray-800 dark:text-gray-200">{teacher.name}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingTeacher === teacher._id ? (
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                          className="w-full px-3 py-1 border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{teacher.email}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        teacher.isBlocked 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {teacher.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {editingTeacher === teacher._id ? (
                          <>
                            <button
                              onClick={() => handleEditSubmit(teacher._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTeacher(null)}
                              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleBlockToggle(teacher._id, teacher.isBlocked)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                teacher.isBlocked 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                            >
                              {teacher.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Management Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
          🎓 Teacher Management Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Verify teacher credentials before activating accounts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Communicate changes with affected teachers</span>
            </li>
          </ul>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep teacher information up to date</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Document all administrative actions taken</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}