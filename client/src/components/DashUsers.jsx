import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Loading from './Loading'; // Adjust path as needed
import Alert from './Alert'; // Adjust path as needed

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMoreUser, setShowMoreUser] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/getusers');
        const data = await res.json();
        console.log("Fetched users:", data);
        
        if (res.ok) {
          setUsers(data.users || []);
          setTotalUsers(data.totalUsers || 0);
          
          if (!data.users || data.users.length < 9 || data.users.length >= (data.totalUsers || 0)) {
            setShowMoreUser(false);
          }
        } else {
          setAlert({ type: 'danger', message: data.message || 'Failed to fetch users' });
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
        setAlert({ type: 'danger', message: 'Network error while fetching users' });
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
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      
      if (res.ok && data.users && data.users.length > 0) {
        setUsers((prev) => [...prev, ...data.users]);
        setTotalUsers(data.totalUsers || 0);
        
        if (data.users.length < 9 || (users.length + data.users.length) >= (data.totalUsers || 0)) {
          setShowMoreUser(false);
        }
      } else {
        setShowMoreUser(false);
        if (!res.ok) {
          setAlert({ type: 'warning', message: 'No more users to load' });
        }
      }
    } catch (error) {
      console.log("Error in handleShowMoreUsers:", error.message);
      setShowMoreUser(false);
      setAlert({ type: 'danger', message: 'Error loading more users' });
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
        setTotalUsers(prev => prev - 1);
        setShowDeleteModal(false);
        setUserIdToDelete('');
        setAlert({ type: 'success', message: 'User deleted successfully' });
      } else {
        console.log(data.message);
        setAlert({ type: 'danger', message: data.message || 'Failed to delete user' });
      }
    } catch (error) {
      console.log("Error deleting user:", error.message);
      setAlert({ type: 'danger', message: 'Network error while deleting user' });
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

  // Show loading component when initially loading
  if (loading && users.length === 0) {
    return <Loading text="Loading users..." overlay={true} />;
  }

  return (
    <div className="w-full min-h-screen transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Alert Component */}
        {alert && (
          <div className="mb-4">
            <Alert type={alert.type} message={alert.message} />
            <button 
              onClick={() => setAlert(null)}
              className="mt-2 text-sm text-[#393e46] dark:text-[#E6E6FF] underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {currentUser?.isAdmin && users.length > 0 ? (
          <>
            {/* Header with user count */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold ] mb-2 font-montserrat">
                User Management
              </h1>
              <p >
                Showing {users.length} of {totalUsers} users
              </p>
            </div>

            {/* Mobile view: Stack cards vertically */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className=" rounded-lg shadow-sm border border-[#5A5AFF]/20 dark:border-[#3A3AFF]/30 hover:shadow-md hover:border-[#5A5AFF]/40 dark:hover:border-[#3A3AFF]/50 transition-all duration-200">
                    <div className="p-4 sm:p-6">
                      {/* Header with date, user ID, and delete button */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-sm ">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs mt-1">
                            {formatUserId(user._id)} • {getRelativeTime(user.createdAt)}
                          </div>
                        </div>
                        <button 
                          className="bg-btn-primaryRed text-sm font-medium px-3 py-1 rounded-md transition-all duration-200"
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
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center  text-xl font-bold font-montserrat">
                              {user.username?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold  truncate font-montserrat">
                            {user.username}
                          </h3>
                          <p className="text-sm  truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Admin Status Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm  mr-2">Status:</span>
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium   dark:text-green-500">
                              <FaCheck className="mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
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
              <div className=" shadow-sm rounded-lg border border-[#5A5AFF]/20 dark:border-[#3A3AFF]/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#5A5AFF]/20 dark:divide-[#3A3AFF]/30">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Date Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider font-montserrat">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider font-montserrat">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider font-montserrat">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Admin Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" divide-y divide-[#5A5AFF]/10 dark:divide-[#3A3AFF]/20">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-[#e6e6ff]/50 dark:hover:bg-[#222831]/50 transition-colors duration-200 cursor-pointer">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm ">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs">
                                {getRelativeTime(user.createdAt)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-mono  px-2 py-1 rounded border border-[#5A5AFF]/20">
                              {formatUserId(user._id)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden  mr-3 flex-shrink-0">
                                {user.profilePicture ? (
                                  <img
                                    src={user.profilePicture}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-sm font-bold font-montserrat">
                                    {user.username?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-medium  font-montserrat">
                                {user.username}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm ">
                            <div className="max-w-xs truncate">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isAdmin ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium = text-green-800  dark:text-green-500">
                                <FaCheck className="mr-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
                                <FaTimes className="mr-1" />
                                User
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              className="bg-btn-primaryRed font-medium transition-colors duration-200 px-3 py-1 rounded-md"
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
            
            {/* Show More button */}
            {showMoreUser && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button 
                  onClick={handleShowMoreUsers}
                  disabled={loading}
                  className="bg-btn-secondary font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5A5AFF] mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    `Show More (${users.length}/${totalUsers})`
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">
              {!currentUser?.isAdmin ? 'Access denied. Admin privileges required.' : 'No users found!'}
            </p>
          </div>
        )}

        {/* Delete Modal using your custom modal styles */}
        {showDeleteModal && (
          <div className="modal-overlay ">
            <div className="modal-container ">
              <div className="modal-header flex items-center">
                <HiOutlineExclamationCircle className="text-red-500 text-2xl mr-3" />
                <h2>Confirm Deletion</h2>
              </div>
              <p className="mb-6">
                Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.
              </p>
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserIdToDelete('');
                  }}
                  className="bg-btn-primary px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteUser}
                  className="bg-btn-primaryRed px-4 py-2 rounded-md font-medium"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}