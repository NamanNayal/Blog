import React from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex justify-center items-center w-full transition-all ease-in-out">
      <div className="flex flex-col gap-8 max-w-lg w-full p-6 rounded-lg shadow-md items-center  ">
        
        {/* Profile Image */}
        <div className="w-32 h-32 shadow-lg rounded-full overflow-hidden my-4 hover:cursor-pointer">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="w-full h-full object-cover border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Profile Info */}
        <h1 className="text-3xl font-semibold text-center hover:cursor-pointer">Profile</h1>
        <form className="flex flex-col gap-4 w-full">
          
          {/* Username */}
          <input
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
            className="input-field"
          />

          {/* Email */}
          <input
            type="text"
            id="email"
            placeholder="Email"
            defaultValue={currentUser.email}
            className="input-field"
          />

          {/* Password */}
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="input-field"
          />

          {/* Update Button */}
          <button type="submit" className="bg-btn-primary w-full py-2 px-4 rounded-md font-semibold">
            Update
          </button>
        </form>

        {/* Delete & Sign Out */}
        <div className="flex justify-between w-full mt-1 text-sm">
          <button className="bg-btn-primaryRed py-2 px-4 rounded-md">
            Delete Account
          </button>
          <button className="bg-btn-primaryRed py-2 px-4 rounded-md">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
