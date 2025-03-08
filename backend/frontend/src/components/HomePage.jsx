import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { authUser, selectedUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);
  
  return (
    <div className='flex flex-col md:flex-row h-screen md:h-[90vh] w-full max-w-7xl mx-auto p-2 md:p-4 gap-2 rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800'>
      <div className={`md:w-1/3 lg:w-1/4 ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <Sidebar />
      </div>
      <div className={`flex-1 md:w-2/3 lg:w-3/4 ${selectedUser ? 'block' : 'hidden md:block'}`}>
        <MessageContainer />
      </div>
    </div>
  )
}

export default HomePage