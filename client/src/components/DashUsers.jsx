import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const {theme} = useSelector((state)=> state.theme); 
  const [users, setUsers] = useState([]);
  const [showMoreUser , setShowMoreUser] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers');
        const data = await res.json();
        console.log("Fetched users:", data);
        
        if (res.ok) {
          setUsers(data.users);
          if(data.users.length < 9 ){
            setShowMoreUser(false);
          }
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
      }
    };
    
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleShowMoreUsers = async () =>{
    const startIndex = users.length;
    try{
      const res = await fetch(`/api/user/getusers?start=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUsers((prev)=> [...prev,  ...data.users]);
        if(data.users.length < 9){
          setShowMoreUser(false);
        }
      }
    }catch(error){
      console.log(error.message);
    }


  }
  const handleDeleteUser = async () =>{};


  
  return (
    <div className="w-full h-full flex flex-col items-start justify-start pt-8 pb-8">
      <div className="w-full px-2 ">
        {currentUser.isAdmin && users.length > 0 ? (
          <>
            {/* For mobile view: card-based layout */}
            <div className="lg:hidden w-full space-y-4 px-3">
              {users.map((user) => (
                <div key={user._id} className={`${theme === 'light' ? 'bg-[#e0e0fa] shadow-md' : 'bg-gray-800 shadow-gray-700'} rounded-lg overflow-hidden`}>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={user.profilePicture || null}
                        alt={user.username}
                        className="w-16 h-12 object-cover bg-gray-500 rounded mr-3"
                      />
                    </div>
                    
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'} mb-2`}>
                      <span className="block">createdAt: {new Date(user.createdAt).toLocaleDateString()}</span>
                      <span className="block">username: {user.username}</span>
                      <span className="block">email: {user.email}</span>
                      <span className="block">  
                        {user.isAdmin ? (
                            <span className="flex items-center gap-1 text-green-500">
                            <i className="fas fa-check"></i> Admin
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-500">
                            <i className="fas fa-times"></i> User
                            </span>
                        )}
                      </span>
                    </div>
                    
                    <div className={`flex justify-end mt-3 pt-3 border-t  ${theme === 'light' ? 'border-gray-400' : 'border-gray-700'}`}>
                      <span className="text-[#E53935] hover:text-[#C62828] cursor-pointer font-semibold transition duration-200 ease-in-out  " onClick={()=>{
                        setShowDeleteModal(true);
                        setUserIdToDelete(user._id);
                      }}>
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            {showMoreUser && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={handleShowMoreUsers}
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
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Date Created</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">User image</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Delete</th>
                    </tr>
                  </thead>
                  <tbody className={`${theme === 'light' ? 'bg-[#e0e0fa] divide-y divide-gray-300' : 'bg-gray-800 divide-y divide-gray-700'}`}>
                    {users.map((user) => (
                      <tr key={user._id} className={`${theme === 'light' ? 'hover:bg-[#e6e6ff]' : 'hover:bg-gray-700'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={user.profilePicture || null}
                              alt={user.username}
                              className="w-20 h-10 object-cover bg-gray-500"
                            />
                        </td>
                        <td 
                            className={`font-medium px-6 py-4 whitespace-nowrap ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}
                          >
                            {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        {user.isAdmin ? (
                            <i className="fas fa-check text-green-500"></i>
                        ) : (
                            <i className="fas fa-times text-red-500"></i>
                        )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[#E53935] hover:text-[#C62828] cursor-pointer font-semibold transition duration-200 ease-in-out " onClick={()=> {setShowDeleteModal(true); setUserIdToDelete(user._id);}}>
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showMoreUser && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={handleShowMoreUsers}
                  className="px-8 py-2 hover:text-gray-400 transition duration-200 shadow-md cursor-pointer"
                >
                  Show More
                </button>
              </div>
            )}
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 px-3">You have no users yet!</p>
        )}

        {showDeleteModal && (
                      <div className="modal-overlay">
                      <div className="modal-container">
                        <h2 className="modal-header">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this User? This action cannot be undone.</p>
        
                        <div className="modal-actions">
                          <button onClick={()=> setShowDeleteModal(false)} className="bg-btn-secondary px-4 py-2 rounded-md">
                            Cancel
                          </button>
                          <button onClick={handleDeleteUser} className="bg-btn-primaryRed px-4 py-2 rounded-md">
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