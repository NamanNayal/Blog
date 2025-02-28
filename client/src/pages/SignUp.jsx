import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/svg/13.svg';

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Side */}
        <div className="flex-1">
          <Link to="/" className="flex text-4xl font-bold items-center gap-2">
            <img src={Logo} alt="CodeBerry Logo" className="w-12 h-12" />
            <span>BlogBerry</span>
          </Link>
          <p className="text-sm mt-5">
            Welcome to CodeBerry! Sign up to start your journey with us.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium ">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="input-field"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium ">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="ex: johndoe@example.com"
                className="input-field"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium ">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="input-field"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-btn-primary text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
              Sign Up
            </button>
          </form>

          {/* Sign In Link */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
