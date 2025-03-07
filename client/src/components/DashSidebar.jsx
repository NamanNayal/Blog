import { useEffect, useState } from "react";
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
    <div className="w-full md:w-56 bg-[#E6E6FF] dark:bg-[#121826] p-4 rounded-lg shadow-md">
      <ul className="space-y-4">
        {/* Profile Link */}
        <li>
          <Link
            to="/dashboard?tab=profile"
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              tab === "profile"
                ? "bg-[#5A5AFF] text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <i className="fa-solid fa-user text-lg"></i>
            <span>Profile</span>
          </Link>
        </li>

        {/* Sign Out Button */}
        <li>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900">
            <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
