import { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFriendRequests, setSentFriendRequests, setFriends } from '../redux/userSlice';
import { BASE_URL } from '..';

const useGetFriendRequests = () => {
    const dispatch = useDispatch();
    const { friends } = useSelector(state => state.user);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Function to fetch friend data
    const fetchFriendData = async () => {
        if (isRefreshing) return; // Prevent multiple simultaneous refreshes

        try {
            setIsRefreshing(true);
            axios.defaults.withCredentials = true;
            
            // Get user's profile with all friend-related data
            const userRes = await axios.get(`${BASE_URL}/api/v1/user/profile`);
            
            if (userRes.data) {
                // Get the friends array and update Redux store
                const friendsArray = userRes.data.friends || [];
                console.log("FRIENDS DATA FETCHED:", friendsArray, "Previous Friends Count:", friends?.length || 0);
                
                // Ensure we're passing an array of strings/IDs
                const cleanFriendsArray = friendsArray.map(id => 
                    typeof id === 'object' && id._id ? id._id : id.toString()
                );
                
                // Update Redux state
                dispatch(setFriends(cleanFriendsArray));
                
                // Update sent friend requests
                const sentRequests = userRes.data.sentFriendRequests || [];
                const cleanSentRequests = sentRequests.map(id => 
                    typeof id === 'object' && id._id ? id._id : id.toString()
                );
                dispatch(setSentFriendRequests(cleanSentRequests));
                
                // Get received friend requests (which includes the full user objects)
                const receivedRes = await axios.get(`${BASE_URL}/api/v1/user/friend-requests`);
                dispatch(setFriendRequests(receivedRes.data || []));
                
                console.log("Friend data refresh complete. Friends:", cleanFriendsArray.length);
            }
        } catch (error) {
            console.error("Error refreshing friend data:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Fetch data initially and when refreshTrigger changes
    useEffect(() => {
        fetchFriendData();
    }, [refreshTrigger]);

    // Set up periodic refresh every 15 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRefreshTrigger(prev => prev + 1);
        }, 15000);
        
        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, []);

    // Expose method to manually trigger refresh
    return {
        refreshFriendData: () => {
            console.log("Manual refresh triggered");
            setRefreshTrigger(prev => prev + 1);
        },
        isRefreshing
    };
}

export default useGetFriendRequests; 