import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import Footer from './components/Footer';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import ListRoom from './pages/hotelOwner/ListRoom';
import AddRoom from './pages/hotelOwner/AddRoom';

const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    // FIX 1: <Footer/> was outside the root <div> — moved inside
    <div>
      {!isOwnerPath && <Navbar />}
      {false && <HotelReg/>}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/rooms' element={<AllRooms/>} />
          <Route path='/rooms/:id' element={<RoomDetails/>}/>
          <Route path='/my-bookings' element={<MyBookings/>} />

          {/* FIX 2: Nested routes moved INSIDE the /owner Route as children  */}
          {/* Before, Dashboard/AddRoom/ListRoom were siblings of Layout so    */}
          {/* the <Outlet/> in Layout had nothing to render → blank dashboard  */}
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>        {/* /owner         */}
            <Route path='add-room' element={<AddRoom/>}/>  {/* /owner/add-room */}
            <Route path='list-room' element={<ListRoom/>}/> {/* /owner/list-room*/}
          </Route>

        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App