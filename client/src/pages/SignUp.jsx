import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/svg/13.svg';
import Alert from '../components/Alert';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill in all fields');
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    }
    catch(error){
      setErrorMessage(error.message);
      setLoading(false);  
    }
  }

  console.log(formData);
  
  return (
    <div className="flex-grow flex items-center justify-center mt-8 mb-8">
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="input-field"
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="ex: johndoe@example.com"
                className="input-field"
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="input-field"
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="flex items-center justify-center gap-2 w-full bg-btn-primary text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-[#5A5AFF] rounded-full animate-spin"></div>
                  <span className="pl-3">Loading....</span>
                </>
              ) : 'Sign Up'} 
            </button>
            <OAuth/>
          </form>

          {/* Sign In Link */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>

          {/* Error Message */}
          {errorMessage && <Alert type="danger" message={errorMessage} />}
        </div>
      </div>
    </div>
  );
}