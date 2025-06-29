import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';


export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
    
  },[location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/*Sidebar */}
        <DashSidebar/>


      </div>
      <div className="hidden md:block w-[1px] bg-[#5A5AFF] mb-4"></div>
      <div className='flex-1 flex justify-center items-center '>
        {/*Profile */}
        {tab === 'profile' && <DashProfile/>}
        {/*Posts */}
        {tab === 'posts' && <DashPosts/>}
        {/*Users */}
        {tab === 'users' && <DashUsers/>}
        {/* comments  */}
        {tab === 'comments' && <DashComments />}
        {/* dashboard comp */}
        {tab === 'dash' && <DashboardComp />}
      </div>
    </div>
  )
}
