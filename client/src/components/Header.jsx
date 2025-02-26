import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className='flex justify-between items-center p-4 pt-5'>

      {/* Logo */}
      <Link to='/' className='text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl 
         focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
         font-medium rounded-lg px-5 py-2.5'>
          Naman's
        </span> Blog
      </Link>

      {/* Centered Navigation Links - Visible only on lg screens */}
      <div className='hidden lg:flex items-center gap-10 flex-1 justify-center'>

        <Link to='/' className={`text-base font-medium ${path === "/" ? "text-blue-300" : "text-gray-900 dark:text-white hover:text-gray-300"}`}>Home</Link>
        <Link to='/about' className={`text-base font-medium ${path === "/about" ? "text-blue-300" : "text-gray-900 dark:text-white hover:text-gray-300"}`}>About</Link>
        <Link to='/projects' className={`text-base font-medium ${path === "/projects" ? "text-blue-300" : "text-gray-900 dark:text-white hover:text-gray-300 "}`}>Projects</Link>
      </div>

      {/* Search Bar & Buttons */}
      <div className='flex items-center gap-6 ml-auto'>
        {/* Search Input */}
        <form className='hidden lg:inline'>
          <TextInput type='text' placeholder='Search...' className=' rounded-md  hover:text-white hover:outline-1transition duration-200 outline-white ' />
        </form>

        {/* Moon Button */}
        <Button className='hidden sm:inline' color='grey' pill>
          <svg className="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-400 transition duration-200" 
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z" clipRule="evenodd"/>
          </svg>
        </Button>

        {/* Sign In Button */}
        <Link to='/sign-in'>
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden 
          text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 
          group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 
          focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 
            rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Sign In
            </span>
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button - Visible only on small screens */}
      <div className='lg:hidden'>
        <Navbar.Toggle className='text-white dark:text-white hover:text-gray-400 transition duration-200 flex ml-8 mr-3' />
      </div>

      {/* Mobile Navigation Links */}
      <Navbar.Collapse className='pt-1.5 px-2 lg:hidden'>
        <Navbar.Link active={path === "/"} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={'div'}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>

    </Navbar>
  );
}
