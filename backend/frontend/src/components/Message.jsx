import React from 'react'
import { useSelector } from "react-redux";
import { formatDistanceToNow } from 'date-fns';

const Message = ({ message }) => {
    const { authUser, selectedUser } = useSelector(store => store.user);
    const isOwnMessage = message?.senderId === authUser?._id;

    const formattedTime = message?.createdAt
        ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
        : '';

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end gap-2 group`}>
            {!isOwnMessage && (
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                            className="w-full h-full object-cover"
                            src={selectedUser?.profilePhoto}
                            alt={`${selectedUser?.fullName}'s avatar`}
                        />
                    </div>
                </div>
            )}
            <div className={`max-w-[75%] md:max-w-[60%] break-words ${
                isOwnMessage 
                    ? 'bg-blue-600 text-white rounded-t-lg rounded-l-lg' 
                    : 'bg-gray-200 text-gray-900 rounded-t-lg rounded-r-lg'
            } px-4 py-2 shadow-md`}>
                <p className="text-sm md:text-base whitespace-pre-wrap">{message?.message}</p>
                <div className={`text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                    {formattedTime}
                </div>
            </div>
            {isOwnMessage && (
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                            className="w-full h-full object-cover"
                            src={authUser?.profilePhoto}
                            alt="Your avatar"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message