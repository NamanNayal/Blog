import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const {theme} = useSelector((state)=> state.theme); 
  const [userPosts, setUserPosts] = useState([]);
  const [showMorePost , setShowMorePost] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        console.log("Fetched posts:", data);
        
        if (res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length < 9 ){
            setShowMorePost(false);
          }
        }
      } catch (error) {
        console.log("Error fetching posts:", error.message);
      }
    };
    
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMorePosts = async () =>{
    const startIndex = userPosts.length;
    try{
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&start=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUserPosts((prev)=> [...prev,  ...data.posts]);
        if(data.posts.length < 9){
          setShowMorePost(false);
        }
      }
    }catch(error){
      console.log(error.message);
    }


  }

  const handleDeletePost = async () =>{
    setShowDeleteModal(false);
    try{
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
        method: 'DELETE',    
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setUserPosts((prev)=> prev.filter((post)=> post._id !==postIdToDelete));
      }

    }catch(error){
      console.log(error.message);
    }
  }


  
  return (
    <div className="w-full h-full flex flex-col items-start justify-start pt-8 pb-8">
      <div className="w-full px-2 ">
        {currentUser.isAdmin && userPosts.length > 0 ? (
          <>
            {/* For mobile view: card-based layout */}
            <div className="lg:hidden w-full space-y-4 px-3">
              {userPosts.map((post) => (
                <div key={post._id} className={`${theme === 'light' ? 'bg-[#e0e0fa] shadow-md' : 'bg-gray-800 shadow-gray-700'} rounded-lg overflow-hidden`}>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={post.image || null}
                        alt={post.title}
                        className="w-16 h-12 object-cover bg-gray-500 rounded mr-3"
                      />
                      <Link
                        to={`/post/${post.slug}`}
                        className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-lg hover:underline`}
                      >
                        {post.title}
                      </Link>
                    </div>
                    
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'} mb-2`}>
                      <span className="block">Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      <span className="block">Category: {post.category}</span>
                    </div>
                    
                    <div className={`flex justify-between mt-3 pt-3 border-t ${theme === 'light' ? 'border-gray-400' : 'border-gray-700'}`}>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="text-[#5A5AFF] hover:text-[#3A3AFF] transition duration-400 ease-in-out   font-semibold"
                      >
                        Edit
                      </Link>
                      <span className="text-[#E53935] hover:text-[#C62828] cursor-pointer font-semibold transition duration-200 ease-in-out " onClick={()=>{
                        setShowDeleteModal(true);
                        setPostIdToDelete(post._id);
                      }}>
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            {showMorePost && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={handleShowMorePosts}
                  className="px-6 py-2 cursor-pointer hover:text-gray-400 transition duration-200 shadow-md"
                >
                  Show More
                </button>
              </div>
            )}
            </div>
            
            {/* For tablet and desktop: table layout */}
            <div className="hidden lg:block overflow-x-auto w-full px-3 ">
              <div className={`shadow-md rounded-lg overflow-hidden font ${theme === 'light' ? 'shadow-gray-200' : 'shadow-gray-800'}`}>
                <table className="min-w-full table-auto ">
                  <thead className={`${theme === 'light' ? 'bg-[#e0e0fa]  text-gray-600' : 'bg-gray-700 text-gray-300'} font-sans `}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                        Date updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                        Post image
                      </th>
                      <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                        Post title
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                        Delete
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${theme === 'light' ? 'bg-[#e0e0fa] divide-y divide-gray-300' : 'bg-gray-800 divide-y divide-gray-700'}`}>
                    {userPosts.map((post) => (
                      <tr key={post._id} className={`${theme === 'light' ? 'hover:bg-[#e6e6ff]' : 'hover:bg-gray-700'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/post/${post.slug}`}>
                            <img
                              src={post.image || null}
                              alt={post.title}
                              className="w-20 h-10 object-cover bg-gray-500"
                            />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}
                            to={`/post/${post.slug}`}
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {post.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[#E53935] hover:text-[#C62828] cursor-pointer font-semibold transition duration-200 ease-in-out " onClick={()=> {setShowDeleteModal(true); setPostIdToDelete(post._id);}}>
                            Delete
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            className="text-[#5A5AFF] hover:text-[#3A3AFF] transition duration-400 ease-in-out   font-semibold"
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
              {showMorePost && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={handleShowMorePosts}
                  className="px-8 py-2 hover:text-gray-400 transition duration-200 shadow-md cursor-pointer"
                >
                  Show More
                </button>
              </div>
            )}
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 px-3">You have no posts yet!</p>
        )}

        {showDeleteModal && (
                      <div className="modal-overlay">
                      <div className="modal-container">
                        <h2 className="modal-header">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this Post? This action cannot be undone.</p>
        
                        <div className="modal-actions">
                          <button onClick={()=> setShowDeleteModal(false)} className="bg-btn-secondary px-4 py-2 rounded-md">
                            Cancel
                          </button>
                          <button onClick={handleDeletePost} className="bg-btn-primaryRed px-4 py-2 rounded-md">
                            Confirm
                          </button>
        
                        </div>
                      </div>
                    </div>
        )}
      </div>
    </div>
  );
}