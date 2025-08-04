import { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from "react-router-dom";
import Logo from '../assets/svg/13.svg';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import { Avatar, Button, Dropdown, TextInput } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleSignOut = async() =>{
    try{
      const res = await fetch('/api/user/signout',{
        method: 'POST',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signOutSuccess());
      }

    }catch(error){
      console.log(error);
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleMobileLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="w-full h-16 md:h-20 flex items-center justify-between shadow-md relative z-40">

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold ml-8">
        <img src={Logo} alt="Lama Logo" className="max-w-12 max-h-12" />
        <span>BlogBerry</span>
      </Link>

 {/* MOBILE MENU */}
<div className="md:hidden">
  {/* MOBILE BUTTON */}
  <div
    className="cursor-pointer text-4xl mr-8 z-50 relative"
    onClick={() => setOpen((prev) => !prev)}
  >
    <div className="flex flex-col gap-[5.4px]">
      <div
        className={`h-[3px] rounded-md w-6 bg-[#3A3AFF] origin-left transition-all ease-in-out ${
          open && "rotate-45"
        }`}
      ></div>
      <div
        className={`h-[3px] rounded-md w-6 bg-[#3A3AFF] transition-all ease-in-out ${
          open && "opacity-0"
        }`}
      ></div>
      <div
        className={`h-[3px] rounded-md w-6 bg-[#3A3AFF] origin-left transition-all ease-in-out ${
          open && "-rotate-45"
        }`}
      ></div>
    </div>
  </div>

  {/* MOBILE LINK LIST - FIXED OVERLAY */}
  <div
    className={`fixed inset-0 w-full h-full flex flex-col items-center justify-center gap-8 font-medium text-lg transition-all duration-300 ease-in-out z-40
      ${open 
        ? `opacity-100 visible backdrop-blur-md ${theme.theme === "light" ? "bg-[#e6e6ff]/95 " : "bg-[#121826]/95 "}` 
        : "opacity-0 invisible"
      }`}
  >
    {/* Theme Toggle for Mobile */}
    <button
      className={`w-12 h-10 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out focus:outline-none cursor-pointer
        ${theme.theme === "light" ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-[#222831] text-[#E6E6FF] hover:bg-[#3A3A47]"}`}
      onClick={() => dispatch(toggleTheme())}
    >
      {theme.theme === "light" ? (
        <i className="fa-solid fa-sun text-yellow-500 text-xl"></i>
      ) : (
        <i className="fa-solid fa-moon text-blue-400 text-xl"></i>
      )}
    </button>
    
    <Link to="/" onClick={handleMobileLinkClick} className="text-2xl hover:text-blue-500 transition-colors transform hover:scale-105">
      Home
    </Link>
    <Link to="/about" onClick={handleMobileLinkClick} className="text-2xl hover:text-blue-500 transition-colors transform hover:scale-105">
      About
    </Link>
      <Link to="/projects" onClick={handleMobileLinkClick} className="text-2xl hover:text-blue-500 transition-colors transform hover:scale-105">
      Upcoming Work
    </Link>

    {currentUser ? (
      <>
        <Link to="/dashboard?tab=profile" onClick={handleMobileLinkClick} className="text-2xl hover:text-blue-500 transition-colors transform hover:scale-105">
          Profile
        </Link>
        <button 
          onClick={() => {
            handleSignOut();
            handleMobileLinkClick();
          }} 
          className="py-3 px-6 text-lg rounded-3xl bg-btn-primary cursor-pointer hover:opacity-90 transition-all transform hover:scale-105"
        >
          Sign out
        </button>
      </>
    ) : (
      <Link to="/sign-in" onClick={handleMobileLinkClick}>
        <button className="py-3 px-6 text-lg rounded-3xl bg-btn-primary cursor-pointer hover:opacity-90 transition-all transform hover:scale-105">
          Sign in
        </button>
      </Link>
    )}
  </div>
</div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
          
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="hidden lg:inline-block w-74 pl-4 pr-10 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="relative right-10 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 hover:opacity-75 cursor-pointer"
            >
              <i className="fas fa-search text-lg"></i>
            </button>
          </div>
        </form>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/projects">Projects</Link>
        <button className={`w-12 h-10 hidden sm:inline-flex items-center justify-center rounded-full transition-all duration-300 ease-in-out focus:outline-none cursor-pointer ${theme.theme === "light" ? "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md ": "bg-[#222831] text-[#E6E6FF]  hover:bg-[#3A3A47] hover:shadow-lg"} `}
        onClick={() => dispatch(toggleTheme())}>
          {theme.theme === "light" ? (
             <i className="fa-solid fa-sun text-yellow-500 text-xl"></i>
            ) : (
              <i className="fa-solid fa-moon text-blue-400 text-xl"></i>
            )}
          
        </button>

        <div className="relative  mr-8">
        {currentUser ? (
          <Link to="/dashboard?tab=profile">
            <img
              src={currentUser.profilePicture}
              alt="User"
              className="h-10 w-10 rounded-full object-cover object-center cursor-pointer border"
            />
          </Link>
        ) : (
          <Link to="/sign-in">
            <button className="py-2 px-4 rounded-3xl bg-btn-primary cursor-pointer">
              Sign In
            </button>
          </Link>
        )}
      </div>

          
      </div>
    </nav>
  );
};

export default Navbar;