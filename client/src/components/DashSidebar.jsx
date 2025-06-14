import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";


export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state)=> state.user);

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);

    const handleSignOut = async() =>{
      try{
        const res = await fetch('/api/user/signout',{
          method:'POST'
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
      <div className="w-full md:w-56 p-4 rounded-lg shadow-md transition-all
        ">
  
        <ul className="space-y-4">
          {/* Profile Link */}
          <li>
            <Link
              to="/dashboard?tab=profile"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all  ${
                tab === "profile"
                  ? "bg-btn-primary"
                  : "hover:bg-gray-70"
              }`}
            >
              <i className="fa-solid fa-user text-lg"></i>
              <span>Profile</span>
            </Link>
          </li>

          {currentUser && currentUser.isAdmin && (
            <>
            <li>
              <Link to='/dashboard?tab=posts'>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${tab === 'posts' ? 'text-white bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-800 dark:hover:bg-gray-800 '}`}
              
                  >
                  <i className="fa-solid fa-file-lines text-lg"></i>

                  <span>Posts</span>

                </div>
              </Link>
            </li>
            <li>
              <Link to='/dashboard?tab=users'>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${tab === 'posts' ? 'text-white bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-800 dark:hover:bg-gray-800 '}`}
              
                  >
                  <i className="fa-solid fa-users text-lg"></i>

                  <span>Users</span>

                </div>
              </Link>
            </li>

            <li>
              <Link to='/dashboard?tab=comments'>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${tab === 'comments' ? 'text-white bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-800 dark:hover:bg-gray-800 '}`}
              
                  >
                  <i className="fa-solid fa-comments"></i>

                  <span>Comments</span>

                </div>
              </Link>
            </li>
            </>
            
          )}
  
          {/* Sign Out Button */}
          <li>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg transition-all 
            bg-btn-primaryRed
              ">
              <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    );
  }
  