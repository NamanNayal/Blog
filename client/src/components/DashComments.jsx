import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Loading from './Loading'; // Adjust path as needed
import Alert from './Alert'; // Adjust path as needed

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [usernames, setUsernames] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [alert, setAlert] = useState(null);

  // Function to toggle comment expansion
  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Function to render comment content with read more/less
  const renderCommentContent = (comment, isExpanded) => {
    const content = comment.content;
    const shouldTruncate = content.length > 100;
    
    if (!shouldTruncate) {
      return content;
    }
    
    return isExpanded ? content : `${content.substring(0, 100)}...`;
  };

  // Function to fetch username by userId
  const fetchUsername = async (userId) => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      if (res.ok) {
        return data.username || 'Unknown User';
      }
    } catch (error) {
      console.log("Error fetching username:", error.message);
    }
    return 'Unknown User';
  };

  const fetchUsernamesForComments = async (comments) => {
    const userIds = [...new Set(comments.map(comment => comment.userId))];
    const usernamePromises = userIds.map(async (userId) => {
      const username = await fetchUsername(userId);
      return { userId, username };
    });
    
    const usernameResults = await Promise.all(usernamePromises);
    const usernameMap = {};
    usernameResults.forEach(({ userId, username }) => {
      usernameMap[userId] = username;
    });
    
    setUsernames(prev => ({ ...prev, ...usernameMap }));
  };

  // Helper function to format comment ID for display
  const formatCommentId = (id) => {
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

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        console.log("Fetched comments:", data);
        
        if (res.ok) {
          setComments(data.comments || []);
          setTotalComments(data.totalComments || data.comments?.length || 0);
          await fetchUsernamesForComments(data.comments || []);
          
          if (!data.comments || data.comments.length < 9) {
            setShowMore(false);
          }
        } else {
          setAlert({ type: 'danger', message: data.message || 'Failed to fetch comments' });
        }
      } catch (error) {
        console.log("Error fetching comments:", error.message);
        setAlert({ type: 'danger', message: 'Network error while fetching comments' });
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      console.log("Show More - Fetched new comments:", data);
      
      if (res.ok && data.comments && data.comments.length > 0) {
        setComments((prev) => {
          const newComments = [...prev, ...data.comments];
          console.log("Updated comments array length:", newComments.length);
          return newComments;
        });
        
        await fetchUsernamesForComments(data.comments);
        
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      } else {
        console.log("No new comments found or error in response");
        setShowMore(false);
        if (!res.ok) {
          setAlert({ type: 'warning', message: 'No more comments to load' });
        }
      }
    } catch (error) {
      console.log("Error in handleShowMore:", error.message);
      setShowMore(false);
      setAlert({ type: 'danger', message: 'Error loading more comments' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setTotalComments(prev => prev - 1);
        setShowDeleteModal(false);
        setCommentIdToDelete('');
        setAlert({ type: 'success', message: 'Comment deleted successfully' });
      } else {
        console.log(data.message);
        setAlert({ type: 'danger', message: data.message || 'Failed to delete comment' });
      }
    } catch (error) {
      console.log(error.message);
      setAlert({ type: 'danger', message: 'Network error while deleting comment' });
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-lg">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading && comments.length === 0) {
    return <Loading text="Loading comments..." overlay={true} />;
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

        {currentUser?.isAdmin && comments.length > 0 ? (
          <>
            {/* Header with comment count */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 font-montserrat">
                Comment Management
              </h1>
              <p>
                Showing {comments.length} of {totalComments} comments
              </p>
            </div>

            {/* Mobile view: Stack cards vertically */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {comments.map((comment) => {
                  const isExpanded = expandedComments[comment._id];
                  const shouldShowReadMore = comment.content.length > 100;
                  
                  return (
                    <div key={comment._id} className="rounded-lg shadow-sm border border-[#5A5AFF]/20 dark:border-[#3A3AFF]/30 hover:shadow-md hover:border-[#5A5AFF]/40 dark:hover:border-[#3A3AFF]/50 transition-all duration-200">
                      <div className="p-4 sm:p-6">
                        {/* Header with date, comment ID, and delete button */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-sm">
                              {new Date(comment.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs mt-1">
                              {formatCommentId(comment._id)} • {getRelativeTime(comment.updatedAt)}
                            </div>
                          </div>
                          <button 
                            className="bg-btn-primaryRed text-sm font-medium px-3 py-1 rounded-md transition-all duration-200"
                            onClick={() => {
                              setShowDeleteModal(true);
                              setCommentIdToDelete(comment._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        
                        {/* Comment content */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2 font-montserrat">Comment</h4>
                          <div className="leading-relaxed">
                            <p className="break-words">{renderCommentContent(comment, isExpanded)}</p>
                            {shouldShowReadMore && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCommentExpansion(comment._id);
                                }}
                                className="text-[#5A5AFF] hover:text-[#4A4AFF] dark:text-[#7A7AFF] dark:hover:text-[#6A6AFF] font-medium text-sm mt-2 transition-colors duration-200 cursor-pointer"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="mr-2">Likes:</span>
                            <span className="font-medium">{comment.numberOfLikes}</span>
                          </div>
                          <div>
                            <span className="mr-2">User:</span>
                            <span className="font-medium">{usernames[comment.userId] || 'Loading...'}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="mr-2">Post ID:</span>
                            <span className="font-mono text-xs break-all">{comment.postId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Desktop view: Table layout */}
            <div className="hidden lg:block">
              <div className="shadow-sm rounded-lg border border-[#5A5AFF]/20 dark:border-[#3A3AFF]/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#5A5AFF]/20 dark:divide-[#3A3AFF]/30">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Date Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Comment ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Comment Content
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Post ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider font-montserrat">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5A5AFF]/10 dark:divide-[#3A3AFF]/20">
                      {comments.map((comment) => {
                        const isExpanded = expandedComments[comment._id];
                        const shouldShowReadMore = comment.content.length > 100;
                        
                        return (
                          <tr 
                            key={comment._id} 
                            className="hover:bg-[#e6e6ff]/50 dark:hover:bg-[#222831]/50 transition-colors duration-200 cursor-pointer"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm">
                                  {new Date(comment.updatedAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs">
                                  {getRelativeTime(comment.updatedAt)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-xs font-mono px-2 py-1 rounded border border-[#5A5AFF]/20">
                                {formatCommentId(comment._id)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="min-w-0 max-w-xs lg:max-w-sm">
                                <div className={`${isExpanded ? 'whitespace-normal break-words' : 'truncate'}`}>
                                  {renderCommentContent(comment, isExpanded)}
                                </div>
                                {shouldShowReadMore && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCommentExpansion(comment._id);
                                    }}
                                    className="text-[#5A5AFF] hover:text-[#4A4AFF] dark:text-[#7A7AFF] dark:hover:text-[#6A6AFF] font-medium text-sm mt-1 block transition-colors duration-200 cursor-pointer"
                                  >
                                    {isExpanded ? 'Show less' : 'Read more'}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {comment.numberOfLikes}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="max-w-[120px] truncate font-mono text-xs">
                                {comment.postId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="max-w-[100px] truncate">
                                {usernames[comment.userId] || 'Loading...'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button 
                                className="bg-btn-primaryRed font-medium transition-colors duration-200 px-3 py-1 rounded-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteModal(true);
                                  setCommentIdToDelete(comment._id);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Show More button */}
            {showMore && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button 
                  onClick={handleShowMore}
                  disabled={loading}
                  className="bg-btn-secondary font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5A5AFF] mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    `Show More (${comments.length}/${totalComments})`
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">
              {!currentUser?.isAdmin ? 'Access denied. Admin privileges required.' : 'No comments found!'}
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
                Are you sure you want to delete this comment? This action cannot be undone and will permanently remove the comment.
              </p>
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCommentIdToDelete('');
                  }}
                  className="bg-btn-primary px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteComment}
                  className="bg-btn-primaryRed px-4 py-2 rounded-md font-medium"
                >
                  Delete Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}