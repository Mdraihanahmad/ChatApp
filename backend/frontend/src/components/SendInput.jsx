import React, {useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.user);
    const {messages} = useSelector(store=>store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`, {message}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            dispatch(setMessages([...messages, res?.data?.newMessage]))
        } catch (error) {
            console.log(error);
        } 
        setMessage("");
    }
    return (
        <form onSubmit={onSubmitHandler} className='px-2 sm:px-4 py-2 sm:py-3 bg-gray-800 border-t border-gray-700'>
            <div className='w-full relative flex items-center'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Send a message...'
                    className='border text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-3 pl-3 sm:pl-4 pr-10 sm:pr-12 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                />
                <button 
                    type="submit" 
                    className='absolute right-1.5 sm:right-2 p-1.5 sm:p-2 text-blue-500 hover:text-blue-400 transition-colors'
                    disabled={!message.trim()}
                >
                    <IoSend size={20} className="sm:w-6 sm:h-6 w-5 h-5" />
                </button>
            </div>
        </form>
    )
}

export default SendInput