import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/svg/13.svg';
import Alert from '../components/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { SignInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading, error: errorMessage} = useSelector(state=> state.user);

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]:e.target.value.trim()});
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if( !formData.email || !formData.password){
      dispatch((signInFailure('Please fill in all the fields')))
    }
    try{
      dispatch(SignInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    }
    catch(error){
      dispatch(signInFailure(error.message)); 

    }
 
  }
  console.log(formData);
  
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
            Welcome to CodeBerry! Sign in to start your journey with us.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="flex items-center justify-center gap-2 w-full bg-btn-primary text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1" disabled={loading}>
              {
                loading ? (
                  <>
                  <div className=" w-5 h-5 border-2 border-gray-300 border-t-[#5A5AFF] rounded-full animate-spin"></div>
                  <span className='pl-3'>Loading....</span>
                  </>
                ): 'Sign In'
              } 
            </button>   
          </form>

          {/* Sign In Link */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </div>
          {
            errorMessage && <Alert type="danger" message={errorMessage} />

          }
        </div>
      </div>
    </div>
  );
}


