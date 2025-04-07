import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from '../assets/svg/13.svg';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);

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

  return (
    <nav className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold ml-8">
        <img src={Logo} alt="Lama Logo" className="max-w-12 max-h-12" />
        <span>BlogBerry</span>
      </Link>

 {/* MOBILE MENU */}
<div className="md:hidden">
  {/* MOBILE BUTTON */}
  <div
    className="cursor-pointer text-4xl"
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

  {/* MOBILE LINK LIST */}
  <div
  className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out  
    ${open ? "right-0 dark:bg-[#121826]/80 dark:text-[#E6E6FF] backdrop-blur-lg" : "-right-[100%]"} 
   `}
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
    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
    <Link to="/posts?sort=trending" onClick={() => setOpen(false)}>Trending</Link>
    <Link to="/posts?sort=popular" onClick={() => setOpen(false)}>Most Popular</Link>
    <Link to="/about" onClick={() => setOpen(false)}>About</Link>



    {currentUser ? (
      <>
        <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
        <Link to="/sign-out" onClick={() => setOpen(false)}>
          <button onClick={handleSignOut} className="py-2 px-4 rounded-3xl bg-btn-primary cursor-pointer">
            Sign out
          </button>
        </Link>
      </>
    ) : (
      <Link to="/sign-in" onClick={() => setOpen(false)}>
        <button className="py-2 px-4 rounded-3xl bg-btn-primary cursor-pointer">
          Sign in
        </button>
      </Link>
    )}
  </div>
  </div>
        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
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
        <>
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 cursor-pointer">
            <img
              src={currentUser.profilePicture}
              alt="User"
              className="w-10 h-10 rounded-full border object-cover"
            />
          </button>

          {isOpen && (
            <div className="dropdown-menu cursor-pointer">
              <div className="dropdown-header">
                <p>@{currentUser.username}</p>
            
              </div>
              <Link to="/dashboard?tab=profile">
                <p className="dropdown-item">Profile</p>
              </Link>
              <div className="dropdown-divider"></div>
              <p onClick={handleSignOut} className="dropdown-item">Sign out</p>
            </div>
          )}
        </>
      ) : (
          <Link to="/sign-in">
            <button className="py-2 px-4 rounded-3xl bg-btn-primary cursor-pointer">
              Sign In </button>
          </Link>
       )}

        </div>
          
      </div>
    </nav>
  );
};

export default Navbar;
