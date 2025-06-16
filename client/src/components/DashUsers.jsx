import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMoreUser, setShowMoreUser] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0); // Track total user count
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/getusers');
        const data = await res.json();
        console.log("Fetched users:", data);
        
        if (res.ok) {
          setUsers(data.users || []);
          setTotalUsers(data.totalUsers || 0); // Get total count from API
          
          // Hide "Show More" if we have all users or less than page size
          if (!data.users || data.users.length < 9 || data.users.length >= (data.totalUsers || 0)) {
            setShowMoreUser(false);
          }
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleShowMoreUsers = async () => {
    const startIndex = users.length;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/getusers?start=${startIndex}`);
      const data = await res.json();
      
      if (res.ok && data.users && data.users.length > 0) {
        setUsers((prev) => [...prev, ...data.users]);
        setTotalUsers(data.totalUsers || 0);
        
        // Hide "Show More" if we've loaded all users or got less than expected
        if (data.users.length < 9 || (users.length + data.users.length) >= (data.totalUsers || 0)) {
          setShowMoreUser(false);
        }
      } else {
        setShowMoreUser(false);
      }
    } catch (error) {
      console.log("Error in handleShowMoreUsers:", error.message);
      setShowMoreUser(false); // Hide button on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setTotalUsers(prev => prev - 1); // Update total count
        setShowDeleteModal(false);
        setUserIdToDelete('');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("Error deleting user:", error.message);
    }
  };

  // Helper function to format user ID for display
  const formatUserId = (id) => {
    return id ? `#${id.slice(-6).toUpperCase()}` : '#UNKNOWN';
  };

  // Helper function to get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  if (loading && users.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser?.isAdmin && users.length > 0 ? (
          <>
            {/* Header with user count */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Showing {users.length} of {totalUsers} users
              </p>
            </div>

            {/* Mobile view: Stack cards vertically */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                    <div className="p-4 sm:p-6">
                      {/* Header with date, user ID, and delete button */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatUserId(user._id)} • {getRelativeTime(user.createdAt)}
                          </div>
                        </div>
                        <button 
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setUserIdToDelete(user._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      
                      {/* User Profile Section */}
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4 flex-shrink-0">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xl font-bold">
                              {user.username?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user.username}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Admin Status Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Status:</span>
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <FaCheck className="mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              <FaTimes className="mr-1" />
                              User
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop view: Table layout */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Admin Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {getRelativeTime(user.createdAt)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {formatUserId(user._id)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3 flex-shrink-0">
                                {user.profilePicture ? (
                                  <img
                                    src={user.profilePicture}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-bold">
                                    {user.username?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.username}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <div className="max-w-xs truncate">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isAdmin ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <FaCheck className="mr-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                <FaTimes className="mr-1" />
                                User
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => {
                                setShowDeleteModal(true);
                                setUserIdToDelete(user._id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Show More button - responsive */}
            {showMoreUser && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button 
                  onClick={handleShowMoreUsers}
                  disabled={loading}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : `Show More (${users.length}/${totalUsers})`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {!currentUser?.isAdmin ? 'Access denied. Admin privileges required.' : 'No users found!'}
            </p>
          </div>
        )}

        {/* Delete Modal - responsive */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <HiOutlineExclamationCircle className="text-red-500 text-2xl mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Confirm Deletion
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:space-x-3">
                  <button 
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserIdToDelete('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteUser}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}