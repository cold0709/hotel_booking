import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    // FIX 1: Added overflow-hidden to prevent the whole page from scrolling
    <div className='flex flex-col h-screen overflow-hidden'>
      <Navbar/>
      {/* FIX 2: Added pt-16 to push content below the fixed navbar height  */}
      <div className='flex h-full pt-16'>
        <Sidebar/>
        {/* FIX 3: Added overflow-y-auto so only this content area scrolls  */}
        {/* instead of the whole page — navbar stays locked at the top       */}
        <div className='flex-1 p-4 pt-10 md:px-10 h-full overflow-y-auto'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout