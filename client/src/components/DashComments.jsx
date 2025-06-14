import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [usernames, setUsernames] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        console.log("Fetched comments:", data);
        
        if (res.ok) {
          setComments(data.comments);
          await fetchUsernamesForComments(data.comments);
          
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching comments:", error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
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
      }
    } catch (error) {
      console.log("Error in handleShowMore:", error.message);
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
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser.isAdmin && comments.length > 0 ? (
          <>
            {/* Mobile view: Stack cards vertically */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {comments.map((comment) => {
                  const isExpanded = expandedComments[comment._id];
                  const shouldShowReadMore = comment.content.length > 100;
                  
                  return (
                    <div key={comment._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="p-4 sm:p-6">
                        {/* Header with date */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(comment.updatedAt).toLocaleDateString()}
                          </div>
                          <button 
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteModal(true);
                              setCommentIdToDelete(comment._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        
                        {/* Comment content */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comment</h4>
                          <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                            <p className="break-words">{renderCommentContent(comment, isExpanded)}</p>
                            {shouldShowReadMore && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCommentExpansion(comment._id);
                                }}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm mt-2 transition-colors duration-200"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Likes:</span>
                            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{comment.numberOfLikes}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">User:</span>
                            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{usernames[comment.userId] || 'Loading...'}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Post ID:</span>
                            <span className="ml-2 font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{comment.postId}</span>
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
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Comment Content
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Post ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {comments.map((comment) => {
                        const isExpanded = expandedComments[comment._id];
                        const shouldShowReadMore = comment.content.length > 100;
                        
                        return (
                          <tr 
                            key={comment._id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {new Date(comment.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                              <div className="min-w-0 max-w-md">
                                <div className={`${isExpanded ? 'whitespace-normal break-words' : 'truncate'}`}>
                                  {renderCommentContent(comment, isExpanded)}
                                </div>
                                {shouldShowReadMore && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCommentExpansion(comment._id);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm mt-1 block transition-colors duration-200"
                                  >
                                    {isExpanded ? 'Show less' : 'Read more'}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {comment.numberOfLikes}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              <div className="max-w-xs truncate font-mono text-xs">
                                {comment.postId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              <div className="max-w-xs truncate">
                                {usernames[comment.userId] || 'Loading...'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button 
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
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
            
            {/* Show More button - responsive */}
            {showMore && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button 
                  onClick={handleShowMore}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">You have no comments yet!</p>
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
                  Are you sure you want to delete this comment? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:space-x-3">
                  <button 
                    onClick={() => setShowDeleteModal(false)} 
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteComment} 
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Delete Comment
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