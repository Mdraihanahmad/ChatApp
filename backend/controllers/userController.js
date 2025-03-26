import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // profilePhoto
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).clearCookie("token").json({
            message: "User Logged Out",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params; // ID of the user to send friend request to
        const loggedInUserId = req.id; // Current user ID

        // Check if users exist
        const requestReceiver = await User.findById(userId);
        const requestSender = await User.findById(loggedInUserId);

        if (!requestReceiver || !requestSender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if they are already friends
        if (requestReceiver.friends.includes(loggedInUserId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // Check if request is already sent
        if (requestReceiver.friendRequests.includes(loggedInUserId) || 
            requestSender.sentFriendRequests.includes(userId)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Add to friend requests
        requestReceiver.friendRequests.push(loggedInUserId);
        requestSender.sentFriendRequests.push(userId);

        await Promise.all([requestReceiver.save(), requestSender.save()]);

        return res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params; // ID of the user who sent the request
        const loggedInUserId = req.id; // Current user ID

        console.log(`Accepting friend request. Sender: ${userId}, Receiver: ${loggedInUserId}`);

        // Check if users exist
        const requestSender = await User.findById(userId);
        const requestReceiver = await User.findById(loggedInUserId);

        if (!requestSender || !requestReceiver) {
            console.log("User not found during friend request acceptance");
            return res.status(404).json({ message: "User not found" });
        }

        // Check if friend request exists
        if (!requestReceiver.friendRequests.includes(userId)) {
            console.log("No friend request found");
            return res.status(400).json({ message: "No friend request from this user" });
        }

        console.log(`Before acceptance: Receiver's friends: ${requestReceiver.friends.length}, Sender's friends: ${requestSender.friends.length}`);

        // Add each other as friends
        requestReceiver.friends.push(userId);
        requestSender.friends.push(loggedInUserId);

        // Remove from friend requests
        requestReceiver.friendRequests = requestReceiver.friendRequests.filter(
            (id) => id.toString() !== userId.toString()
        );
        requestSender.sentFriendRequests = requestSender.sentFriendRequests.filter(
            (id) => id.toString() !== loggedInUserId.toString()
        );

        await Promise.all([requestReceiver.save(), requestSender.save()]);

        console.log(`After acceptance: Receiver's friends: ${requestReceiver.friends.length}, Sender's friends: ${requestSender.friends.length}`);

        return res.status(200).json({ 
            message: "Friend request accepted",
            receiverFriends: requestReceiver.friends,
            senderFriends: requestSender.friends
        });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params; // ID of the user who sent the request
        const loggedInUserId = req.id; // Current user ID

        // Check if users exist
        const requestSender = await User.findById(userId);
        const requestReceiver = await User.findById(loggedInUserId);

        if (!requestSender || !requestReceiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove from friend requests
        requestReceiver.friendRequests = requestReceiver.friendRequests.filter(
            (id) => id.toString() !== userId.toString()
        );
        requestSender.sentFriendRequests = requestSender.sentFriendRequests.filter(
            (id) => id.toString() !== loggedInUserId.toString()
        );

        await Promise.all([requestReceiver.save(), requestSender.save()]);

        return res.status(200).json({ message: "Friend request declined" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const user = await User.findById(loggedInUserId).populate('friendRequests', '-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.friendRequests);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        console.log("Fetching profile for user:", loggedInUserId);
        
        // First get the basic user data
        const user = await User.findById(loggedInUserId)
            .select('-password');
        
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        
        // Populate friends array with full user objects for better frontend access
        const populatedUser = await User.findById(loggedInUserId)
            .select('-password')
            .populate('friendRequests', '-password')
            .populate('friends', '-password');
        
        console.log("User profile fetched. Friends count:", populatedUser.friends.length);
        
        // Return the populated user data
        return res.status(200).json(populatedUser);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Server error" });
    }
}