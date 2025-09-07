import { useOutletContext } from 'react-router-dom';

export default function UserManagement() {
  const { users, handleBlockToggle } = useOutletContext();
  
  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage user accounts, view status, and perform administrative actions.
        </p>
      </div>

      {/* Stats Summary */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {users.length}
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Users
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {users.filter(u => u.role === 'student').length}
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Students
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {users.filter(u => u.role === 'teacher').length}
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Teachers
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
            {users.filter(u => u.isBlocked).length}
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Blocked
          </h3>
        </div>
      </div> */}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Role</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      user.role === 'teacher' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isBlocked 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleBlockToggle(user._id)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          user.isBlocked 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No users found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">There are no users to display at this time.</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
          💡 User Management Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-sm text-green-700 dark:text-green-200 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Block users who violate community guidelines</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Regularly review user activity and status</span>
            </li>
          </ul>
          <ul className="text-sm text-green-700 dark:text-green-200 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use blocking as a last resort after warnings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep detailed records of moderation actions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}