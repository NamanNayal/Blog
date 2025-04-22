import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        console.log("Fetched posts:", data);
        
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log("Error fetching posts:", error.message);
      }
    };
    
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);
  
  return (
    <div className="w-full h-full flex flex-col items-start justify-start pt-8 pb-8">
      <div className="w-full px-2 ">
        {currentUser.isAdmin && userPosts.length > 0 ? (
          <>
            {/* For mobile view: card-based layout */}
            <div className="lg:hidden w-full space-y-4 px-3">
              {userPosts.map((post) => (
                <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-12 object-cover bg-gray-500 rounded mr-3"
                      />
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-medium text-gray-900 dark:text-white text-lg hover:underline"
                      >
                        {post.title}
                      </Link>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="block">Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      <span className="block">Category: {post.category}</span>
                    </div>
                    
                    <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/update-post/${post._id}`}
                        className="text-teal-500 hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      <span className="text-red-500 hover:underline cursor-pointer font-medium">
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* For tablet and desktop: table layout */}
            <div className="hidden lg:block overflow-x-auto w-full px-3 ">
              <div className="shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full table-auto ">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Post image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Post title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Delete
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {userPosts.map((post) => (
                      <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/post/${post.slug}`}>
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-20 h-10 object-cover bg-gray-500"
                            />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            className="font-medium text-gray-900 dark:text-white"
                            to={`/post/${post.slug}`}
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {post.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-red-500 hover:underline cursor-pointer">
                            Delete
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            className="text-teal-500 hover:underline"
                            to={`/update-post/${post._id}`}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 px-3">You have no posts yet!</p>
        )}
      </div>
    </div>
  );
}