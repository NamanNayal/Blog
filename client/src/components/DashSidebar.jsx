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
      <div className="sidebar-container">
        <ul className="sidebar-menu">
          {/* Profile Link */}
          <li>
            <Link
              to="/dashboard?tab=profile"
              className={`sidebar-item ${
                tab === "profile" ? "sidebar-item-active" : ""
              }`}
            >
              <i className="fa-solid fa-user sidebar-icon"></i>
              <span className="sidebar-text">Profile</span>
            </Link>
          </li>

          {currentUser && currentUser.isAdmin && (
            <>
              <li>
                <Link to='/dashboard?tab=dash'>
                  <div className={`sidebar-item ${tab === 'dash' ? 'sidebar-item-active' : ''}`}>
                    <i className="fa-solid fa-chart-pie sidebar-icon"></i>
                    <span className="sidebar-text">Dashboard</span>
                  </div>
                </Link>
              </li>
              
              <li>
                <Link to='/dashboard?tab=posts'>
                  <div className={`sidebar-item ${tab === 'posts' ? 'sidebar-item-active' : ''}`}>
                    <i className="fa-solid fa-file-lines sidebar-icon"></i>
                    <span className="sidebar-text">Posts</span>
                  </div>
                </Link>
              </li>
              
              <li>
                <Link to='/dashboard?tab=users'>
                  <div className={`sidebar-item ${tab === 'users' ? 'sidebar-item-active' : ''}`}>
                    <i className="fa-solid fa-users sidebar-icon"></i>
                    <span className="sidebar-text">Users</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link to='/dashboard?tab=comments'>
                  <div className={`sidebar-item ${tab === 'comments' ? 'sidebar-item-active' : ''}`}>
                    <i className="fa-solid fa-comments sidebar-icon"></i>
                    <span className="sidebar-text">Comments</span>
                  </div>
                </Link>
              </li>
            </>
          )}
  
          {/* Sign Out Button */}
          <li>
            <button onClick={handleSignOut} className="sidebar-signout">
              <i className="fa-solid fa-arrow-right-from-bracket sidebar-icon"></i>
              <span className="sidebar-text">Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    );
}