import { Link } from 'react-router-dom';
import Logo from '../assets/svg/13.svg';
import { useSelector } from "react-redux";
export default function FooterCom() {
  const { theme } = useSelector((state) => state.theme);
  return (
    
    
    <footer className={`border-t-8 border-[#5A5AFF] py-6 transition-all duration-300
      ${theme === "light" ? "bg-[#E6E6FF] text-gray-800" : "bg-[#121826] text-[#E6E6FF]"}`}>
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Logo & Branding */}
          <div className="mb-4 sm:mb-0">
            <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
            <img src={Logo} alt="Lama Logo" className="max-w-12 max-h-12" /><span>BlogBerry</span>
            </Link>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <ul>
                <li>
                  <a href="https://www.100jsprojects.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    100 JS Projects
                  </a>
                </li>
                <li>
                  <Link to="/about" className="hover:underline">
                    BlogBerry
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Follow Us</h3>
              <ul>
                <li>
                  <a href="https://github.com/NamanNayal" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Github
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Discord</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        {/* Copyright & Social Icons */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} BlogBerry. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-xl hover:text-blue-600 dark:hover:text-blue-400 " >
              <i className="fab fa-facebook "></i>
            </a>
            <a href="#" className="text-xl hover:text-pink-500 dark:hover:text-pink-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/IamNamanNayal" className="text-xl hover:text-blue-400 dark:hover:text-blue-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://github.com/NamanNayal" target="_blank" className="text-xl hover:text-black  dark:hover:text-gray-400">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/namannayal" className="text-xl hover:text-blue-800 dark:hover:text-blue-600">
                <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

