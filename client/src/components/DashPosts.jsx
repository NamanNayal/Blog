import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Loading from './Loading'; // Adjust path as needed
import Alert from './Alert'; // Adjust path as needed

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMorePost, setShowMorePost] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        console.log("Fetched posts:", data);
        
        if (res.ok) {
          setUserPosts(data.posts || []);
          setTotalPosts(data.totalPosts || data.posts?.length || 0);
          if (!data.posts || data.posts.length < 9) {
            setShowMorePost(false);
          }
        } else {
          setAlert({ type: 'danger', message: data.message || 'Failed to fetch posts' });
        }
      } catch (error) {
        console.log("Error fetching posts:", error.message);
        setAlert({ type: 'danger', message: 'Network error while fetching posts' });
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMorePosts = async () => {
    const startIndex = userPosts.length;
    setLoading(true);
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&start=${startIndex}`);
      const data = await res.json();
      if (res.ok && data.posts && data.posts.length > 0) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMorePost(false);
        }
      } else {
        setShowMorePost(false);
        if (!res.ok) {
          setAlert({ type: 'warning', message: 'No more posts to load' });
        }
      }
    } catch (error) {
      console.log(error.message);
      setShowMorePost(false);
      setAlert({ type: 'danger', message: 'Error loading more posts' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',    
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setTotalPosts(prev => prev - 1);
        setShowDeleteModal(false);
        setPostIdToDelete('');
        setAlert({ type: 'success', message: 'Post deleted successfully' });
      } else {
        console.log(data.message);
        setAlert({ type: 'danger', message: data.message || 'Failed to delete post' });
      }
    } catch (error) {
      console.log(error.message);
      setAlert({ type: 'danger', message: 'Network error while deleting post' });
    }
  };

  // Show loading component when initially loading
  if (loading && userPosts.length === 0) {
    return <Loading text="Loading posts..." overlay={true} />;
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

        {currentUser?.isAdmin && userPosts.length > 0 ? (
          <>
            {/* Header with post count */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 font-montserrat">
                Post Management
              </h1>
              <p>
                Showing {userPosts.length} of {totalPosts} posts
              </p>
            </div>

            {/* For mobile view: card-based layout */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post._id} className="rounded-lg shadow-sm border border-[#5A5AFF]/20 dark:border-[#3A3AFF]/30 hover:shadow-md hover:border-[#5A5AFF]/40 dark:hover:border-[#3A3AFF]/50 transition-all duration-200">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center mb-3">
                        <img
                          src={post.image || null}
                          alt={post.title}
                          className="w-16 h-12 object-cover bg-gray-500 rounded mr-3"
                        />
                        <Link
                          to={`/post/${post.slug}`}
                          className="font-medium text-lg hover:underline font-montserrat"
                        >
                          {post.title}
                        </Link>
                      </div>
                      
                      <div className="text-sm mb-2">
                        <span className="block">Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                        <span className="block">Category: {post.category}</span>
                      </div>
                      
                      <div className="flex justify-between mt-3 pt-3 border-t border-[#5A5AFF]/20 dark:border-[#3A3AFF]/30">
                        <Link
                          to={`/update-post/${post._id}`}
                          className="text-[#5A5AFF] hover:text-[#3A3AFF] dark:text-[#7A7AFF] dark:hover:text-[#6A6AFF] transition duration-200 ease-in-out font-semibold"
                        >
                          Edit
                        </Link>
                        <span 
                          className="text-[#E53935] hover:text-[#C62828] cursor-pointer font-semibold transition duration-200 ease-in-out" 
                          onClick={() => {
                            setShowDeleteModal(true);
                            setPostIdToDelete(post._id);
                          }}
                        >
                          Delete
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* For tablet and desktop: table layout */}
            <div className="hidden lg:block">
              <div className="shadow-sm rounded-lg border border-[#5A5AFF]/20 dark:border-[#3A3AFF]/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#5A5AFF]/20 dark:divide-[#3A3AFF]/30">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Date updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Post image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Post title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5A5AFF]/10 dark:divide-[#3A3AFF]/20">
                      {userPosts.map((post) => (
                        <tr key={post._id} className="hover:bg-[#e6e6ff]/50 dark:hover:bg-[#222831]/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(post.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/post/${post.slug}`}>
                              <img
                                src={post.image || null}
                                alt={post.title}
                                className="w-20 h-10 object-cover bg-gray-500 rounded"
                              />
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              className="font-medium hover:underline"
                              to={`/post/${post.slug}`}
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {post.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-3">
                              <Link
                                className="text-[#5A5AFF] hover:text-[#3A3AFF] dark:text-[#7A7AFF] dark:hover:text-[#6A6AFF] transition duration-200 ease-in-out font-semibold"
                                to={`/update-post/${post._id}`}
                              >
                                Edit
                              </Link>
                              <button 
                                className="text-[#E53935] hover:text-[#C62828] font-semibold transition duration-200 ease-in-out" 
                                onClick={() => {
                                  setShowDeleteModal(true); 
                                  setPostIdToDelete(post._id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Show More button */}
            {showMorePost && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button 
                  onClick={handleShowMorePosts}
                  disabled={loading}
                  className="bg-btn-secondary font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5A5AFF] mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    `Show More (${userPosts.length}/${totalPosts})`
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">
              {!currentUser?.isAdmin ? 'Access denied. Admin privileges required.' : 'No posts found!'}
            </p>
          </div>
        )}

        {/* Delete Modal using your custom modal styles */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header flex items-center">
                <HiOutlineExclamationCircle className="text-red-500 text-2xl mr-3" />
                <h2>Confirm Deletion</h2>
              </div>
              <p className="mb-6">
                Are you sure you want to delete this post? This action cannot be undone and will permanently remove the post.
              </p>
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPostIdToDelete('');
                  }}
                  className="bg-btn-secondary px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeletePost}
                  className="bg-btn-primaryRed px-4 py-2 rounded-md font-medium"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}