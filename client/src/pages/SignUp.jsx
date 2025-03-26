import React from 'react';
import { useSelector } from 'react-redux';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex-grow flex items-center justify-center mt-8 mb-8">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        
        {/* Left Side - Profile Image & Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-semibold mb-4">Profile</h1>
          <div className="w-32 h-32 mx-auto md:mx-0 cursor-pointer shadow-md overflow-hidden rounded-full">
            <img
              src={currentUser.profilePicture}
              alt="user"
              className="rounded-full w-full h-full object-cover border-4 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                defaultValue={currentUser.username}
                className="input-field"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Email"
                defaultValue={currentUser.email}
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="input-field"
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-btn-primary text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Update
            </button>
          </form>

          {/* Delete & Sign Out */}
          <div className="flex justify-between mt-5 text-sm">
            <button className="py-2 px-4 rounded-md bg-red-500 text-white transition-all duration-300 hover:bg-red-600">
              Delete Account
            </button>
            <button className="py-2 px-4 rounded-md bg-red-500 text-white transition-all duration-300 hover:bg-red-600">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
