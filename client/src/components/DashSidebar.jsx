import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);
  
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
  
          {/* Sign Out Button */}
          <li>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-all 
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
  