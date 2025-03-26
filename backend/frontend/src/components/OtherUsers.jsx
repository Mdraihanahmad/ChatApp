import React, { useEffect, useState } from 'react'
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from "react-redux";

const OtherUsers = ({ showOnlyFriends = false, users = null }) => {
    // Custom hook to fetch all users
    useGetOtherUsers();
    
    // Get the latest state from Redux
    const { otherUsers, friends } = useSelector(store => store.user);
    
    // Local state to store filtered users
    const [filteredUsers, setFilteredUsers] = useState([]);
    
    // Effect to filter users whenever dependencies change
    useEffect(() => {
        if (users) {
            // If users are provided directly, use them
            setFilteredUsers(users);
        } else if (otherUsers) {
            // Log for debugging
            console.log("Filtering users. Total users:", otherUsers.length, "Friends:", friends?.length || 0);
            
            // Filter from otherUsers based on showOnlyFriends
            const filtered = otherUsers.filter(user => {
                if (showOnlyFriends) {
                    // Check if user is a friend by looking for their ID in the friends array
                    const isFriend = friends?.some(friendId => {
                        const isMatch = friendId.toString() === user._id.toString();
                        if (isMatch) {
                            console.log("Found friend match:", user.fullName);
                        }
                        return isMatch;
                    });
                    return isFriend;
                }
                return true; // If not filtering, show all users
            });
            
            console.log("Filtered users count:", filtered.length);
            setFilteredUsers(filtered);
        }
    }, [users, otherUsers, friends, showOnlyFriends]);
    
    if (!otherUsers && !users) {
        return null; // early return in react
    }
    
    if (filteredUsers.length === 0) {
        return (
            <div className="text-center py-6">
                {showOnlyFriends ? (
                    <p className="text-gray-400">You have no friends yet. Search for users to add friends.</p>
                ) : (
                    <p className="text-gray-400">No users found</p>
                )}
            </div>
        );
    }
     
    return (
        <div className='overflow-auto flex-1'>
            {filteredUsers.map((user) => (
                <OtherUser key={user._id} user={user} />
            ))}
        </div>
    )
}

export default OtherUsers