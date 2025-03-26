import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '..';
import { acceptFriendRequest, removeFriendRequest, setSelectedUser, addFriend } from '../redux/userSlice';
import useGetFriendRequests from '../hooks/useGetFriendRequests';

const FriendRequests = () => {
    const { refreshFriendData } = useGetFriendRequests();
    const { friendRequests, otherUsers, friends } = useSelector(store => store.user);
    const [processingIds, setProcessingIds] = useState([]);
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user);

    const handleAcceptRequest = async (request) => {
        try {
            setProcessingIds(prev => [...prev, request._id]);
            
            console.log("Accepting friend request from:", request.fullName, "ID:", request._id);
            console.log("Current friends:", friends);
            
            // Make API call to accept the request
            const res = await axios.post(
                `${BASE_URL}/api/v1/user/friend-request/${request._id}/accept`,
                {},
                { withCredentials: true }
            );
            
            // Find the full user object from otherUsers or use the request itself
            const fullUserObject = otherUsers?.find(user => user._id === request._id) || request;
            
            console.log("Friend request accepted, API response:", res.data);
            
            // Update Redux store with all the necessary changes
            // Both acceptFriendRequest and addFriend for redundancy
            dispatch(acceptFriendRequest(request._id));
            dispatch(addFriend(request._id));
            
            // If the user is currently selected, refresh their status
            if (selectedUser && selectedUser._id === request._id) {
                // Re-select the user to trigger the friendship status update
                dispatch(setSelectedUser({...fullUserObject}));
            }
            
            // Force an immediate refresh of friend data to update the UI
            refreshFriendData();
            
            // Schedule another refresh after a delay to ensure backend has processed
            setTimeout(() => {
                refreshFriendData();
                console.log("Delayed refresh completed");
            }, 1000);
            
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to accept request');
            console.log(error);
        } finally {
            setProcessingIds(prev => prev.filter(id => id !== request._id));
        }
    };

    const handleDeclineRequest = async (request) => {
        try {
            setProcessingIds(prev => [...prev, request._id]);
            const res = await axios.post(
                `${BASE_URL}/api/v1/user/friend-request/${request._id}/decline`,
                {},
                { withCredentials: true }
            );
            
            // Remove from requests
            dispatch(removeFriendRequest(request._id));
            
            // Refresh friend data
            refreshFriendData();
            
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to decline request');
            console.log(error);
        } finally {
            setProcessingIds(prev => prev.filter(id => id !== request._id));
        }
    };

    const handleViewProfile = (request) => {
        dispatch(setSelectedUser(request));
    };

    if (!friendRequests || friendRequests.length === 0) {
        return null;
    }

    return (
        <div className="mb-3">
            <div className="flex items-center mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-white">Friend Requests</h3>
                <div className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                    {friendRequests.length}
                </div>
            </div>
            <div className="space-y-2">
                {friendRequests.map(request => {
                    const isProcessing = processingIds.includes(request._id);
                    return (
                        <div 
                            key={request._id} 
                            className="bg-gray-700 p-2 sm:p-3 rounded-lg"
                        >
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                                    <img 
                                        src={request.profilePhoto} 
                                        alt={`${request.fullName}'s profile`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm sm:text-base truncate">{request.fullName}</p>
                                    <p className="text-gray-300 text-xs truncate">@{request.username}</p>
                                </div>
                                <button
                                    onClick={() => handleViewProfile(request)}
                                    className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                                >
                                    View
                                </button>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button 
                                    onClick={() => handleDeclineRequest(request)}
                                    disabled={isProcessing}
                                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium ${
                                        isProcessing 
                                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                                            : 'bg-gray-600 hover:bg-gray-500 text-white'
                                    }`}
                                >
                                    Decline
                                </button>
                                <button 
                                    onClick={() => handleAcceptRequest(request)}
                                    disabled={isProcessing}
                                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium ${
                                        isProcessing 
                                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FriendRequests; 