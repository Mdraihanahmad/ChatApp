import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      navigate("/");
      console.log(res);
      dispatch(setAuthUser(res.data));
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      username: "",
      password: ""
    })
  }
  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-lg bg-gray-800 bg-opacity-90'>
        <h1 className='text-3xl font-bold text-center text-white mb-6'>Login</h1>
        <form onSubmit={onSubmitHandler} action="">
          <div className="mb-4">
            <label className='block text-white text-sm font-semibold mb-2'>
              Username
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type="text"
              placeholder='Enter your username'
            /> 
          </div>
          <div className="mb-6">
            <label className='block text-white text-sm font-semibold mb-2'>
              Password
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              type="password"
              placeholder='Enter your password'
            />
          </div>
          <div className="text-center mb-4">
            <p className='text-gray-300'>
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
          <div>
            <button
              type="submit"
              className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200'
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login