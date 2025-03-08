import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const isOnline = onlineUsers?.includes(selectedUser?._id);

    const handleBack = () => {
        dispatch(setSelectedUser(null));
    };
   
    return (
        <div className='h-screen md:h-full w-full fixed md:relative left-0 top-0 md:inset-auto flex flex-col bg-gray-800 rounded-lg'>
            {selectedUser !== null ? (
                <>
                    <header className='flex-none flex items-center bg-gray-900 text-white px-3 py-3 shadow-lg'>
                        <button 
                            onClick={handleBack}
                            className='md:hidden flex items-center justify-center w-10 h-10 mr-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors'
                            aria-label="Back to users list"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className={`relative ${isOnline ? 'online' : ''}`}>
                            <div className='w-12 h-12 rounded-full overflow-hidden'>
                                <img 
                                    src={selectedUser?.profilePhoto} 
                                    alt="user-profile"
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            {isOnline && (
                                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></span>
                            )}
                        </div>
                        <div className='ml-4 flex-1'>
                            <h3 className='font-semibold text-lg'>{selectedUser?.fullName}</h3>
                            <p className='text-sm text-gray-300'>
                                {isOnline ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </header>
                    <main className='flex-1 overflow-hidden relative'>
                        <div className='absolute inset-0 overflow-y-auto'>
                            <Messages />
                        </div>
                    </main>
                    <footer className='flex-none w-full sticky bottom-0 z-50'>
                        <SendInput />
                    </footer>
                </>
            ) : (
                <div className='h-full flex flex-col justify-center items-center bg-gray-800 text-white p-4'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-4'>Welcome, {authUser?.fullName}!</h1>
                    <p className='text-xl md:text-2xl text-gray-300 text-center'>
                        Select a conversation to start chatting
                    </p>
                </div>
            )}
        </div>
    )
}

export default MessageContainer