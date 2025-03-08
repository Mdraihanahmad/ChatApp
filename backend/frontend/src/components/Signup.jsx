import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '..';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const navigate = useNavigate();
  
  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  }
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    })
  }
  
  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-lg bg-gray-800 bg-opacity-90'>
        <h1 className='text-3xl font-bold text-center text-white mb-6'>Sign Up</h1>
        <form onSubmit={onSubmitHandler} action="">
          <div className="mb-4">
            <label className='block text-white text-sm font-semibold mb-2'>
              Full Name
            </label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type="text"
              placeholder='Enter your full name'
            />
          </div>
          
          <div className="mb-4">
            <label className='block text-white text-sm font-semibold mb-2'>
              Username
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type="text"
              placeholder='Choose a username'
            />
          </div>
          
          <div className="mb-4">
            <label className='block text-white text-sm font-semibold mb-2'>
              Password
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type="password"
              placeholder='Create a password'
            />
          </div>
          
          <div className="mb-4">
            <label className='block text-white text-sm font-semibold mb-2'>
              Confirm Password
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type="password"
              placeholder='Confirm your password'
            />
          </div>
          
          <div className='mb-6'>
            <label className='block text-white text-sm font-semibold mb-3'>
              Gender
            </label>
            <div className='flex gap-6'>
              <div className='flex items-center'>
                <input
                  type="radio"
                  checked={user.gender === "male"}
                  onChange={() => handleCheckbox("male")}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600"
                />
                <label className="ml-2 text-white">Male</label>
              </div>
              <div className='flex items-center'>
                <input
                  type="radio"
                  checked={user.gender === "female"}
                  onChange={() => handleCheckbox("female")}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600"
                />
                <label className="ml-2 text-white">Female</label>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className='text-gray-300'>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Log in
              </Link>
            </p>
          </div>
          
          <div>
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200'
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup