import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/svg/13.svg';
import Alert from '../components/Alert';
import {Spinner} from 'flowbite-react';
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]:e.target.value.trim()});
  }
  const handleSubmit = async (e) =>{
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                ): 'Sign Up'
              } 
            </button>
          </form>

          {/* Sign In Link */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              Sign In
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



//we want to track the changes - so we use a onChange which calls a function handle change, we will create state which will be an empty obj from the beginning, and we will update the state with the new value of the input field we will setformData, we will pass an empty obj to the formData in useState, then we will handle the logic of onChange which then gets and event and a callback function is called which then calls setFormData which updates the state with a new obj Each form field (username, email, etc.) gets stored as a key-value pair inside formData  Since React state should never be mutated directly, we create a new object using {}. {} → Creates a new object. ...formData → Spreads (copies) previous state values. [e.target.id] → Dynamically sets the key (e.g., "email"). e.target.value → Updates the new value. 

//now we need to submit it, we will add onsumbit event listener on form, which calls  function handleSubmit,it will be a async function, we want to prevent default behaviot of browser of refreshing the page, creating a try catch block, then we want to send  a res and fetch data which takes a url and and object which contains a HTTP method, headers which is an object with a content type of application/json, and a body which is a JSON.stringify of the formData, now we have our server running on other port, hence we will create a proxy - in vite.config file, in server- proxy- we will mention any call starting '/api' shall be redirected the backend port we are  using , and because we are using http for now we will turn secure false, once we are done we will convert our response in json and store it in data

//we want now create a loading effect and handling the error 