import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        authUser:null,
        otherUsers:null,
        selectedUser:null,
        onlineUsers:null,
        friendRequests: [],
        sentFriendRequests: [],
        friends: []
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
        },
        setOtherUsers:(state, action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
        setFriendRequests:(state,action)=>{
            state.friendRequests = action.payload;
        },
        setSentFriendRequests:(state,action)=>{
            state.sentFriendRequests = action.payload;
        },
        setFriends:(state,action)=>{
            // Ensure we don't have duplicates in the friends array
            state.friends = Array.isArray(action.payload) ? 
                [...new Set(action.payload)] : 
                action.payload;
        },
        // Add a single friend request
        addFriendRequest:(state,action)=>{
            // Only add if not already in the array
            if (!state.friendRequests.some(req => req._id === action.payload._id)) {
                state.friendRequests.push(action.payload);
            }
        },
        // Add a single sent friend request
        addSentFriendRequest:(state,action)=>{
            // Prevent duplicates
            if (!state.sentFriendRequests.includes(action.payload)) {
                state.sentFriendRequests.push(action.payload);
            }
        },
        // Remove a friend request
        removeFriendRequest:(state,action)=>{
            state.friendRequests = state.friendRequests.filter(
                request => request._id !== action.payload
            );
        },
        // Remove a sent friend request
        removeSentFriendRequest:(state,action)=>{
            state.sentFriendRequests = state.sentFriendRequests.filter(
                request => request._id !== action.payload
            );
        },
        // Add a friend
        addFriend:(state,action)=>{
            // Prevent duplicates
            if (!state.friends.includes(action.payload)) {
                state.friends.push(action.payload);
            }
        },
        // Update friendship status when accepting a request
        acceptFriendRequest:(state,action)=>{
            // 1. Add to friends list
            if (!state.friends.includes(action.payload)) {
                state.friends.push(action.payload);
            }
            
            // 2. Remove from friend requests
            state.friendRequests = state.friendRequests.filter(
                request => request._id !== action.payload
            );
            
            // 3. Remove from sent friend requests if it exists there
            state.sentFriendRequests = state.sentFriendRequests.filter(
                id => id !== action.payload
            );
        }
    }
});
export const {
    setAuthUser,
    setOtherUsers,
    setSelectedUser,
    setOnlineUsers,
    setFriendRequests,
    setSentFriendRequests,
    setFriends,
    addFriendRequest,
    addSentFriendRequest,
    removeFriendRequest,
    removeSentFriendRequest,
    addFriend,
    acceptFriendRequest
} = userSlice.actions;
export default userSlice.reducer;