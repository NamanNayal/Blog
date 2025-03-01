import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from '../assets/svg/13.svg';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
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
          {/* Change Hamburger Icon */}
          {/* {open ? "X" : "☰"} */}
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
        </div>
        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out  ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
          <Link to="/posts?sort=trending" onClick={()=>setOpen(false)}>Trending</Link>
          <Link to="/posts?sort=popular" onClick={()=>setOpen(false)}>Most Popular</Link>
          <Link to="/" onClick={()=>setOpen(false)}>About</Link>
          <Link to="/login" onClick={()=>setOpen(false)}>
            <button className="py-2 px-4 rounded-3xl bg-btn-primary cursor-pointer">
              Sign in
            </button>
          </Link>
        </div>
      </div>
      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/projects">Projects</Link>

          <Link to="/sign-in">
            <button className="py-2 px-4 rounded-3xl bg-btn-primary cursor-pointer">
              Sign In </button>
          </Link>
      </div>
    </div>
  );
};

export default Navbar;