import React, { useContext, useState } from "react";
import bgImage from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext.jsx";
import axios from "axios";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  console.log(userData);

  const handleLogIn = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data || null);
      setError("");
      navigate("/");
    } catch (error) {
      setUserData(null);
      setError(
        error.response?.data?.message || "Login failed, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleLogIn}
        className="w-[90%] max-w-md md:max-w-lg bg-black/60 backdrop-blur-md flex flex-col items-center gap-6 p-8 sm:p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-2xl sm:text-3xl text-white font-bold text-center">
          Log In to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <div className="w-full flex flex-col gap-2 text-white">
          <label className="text-lg sm:text-xl font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-base sm:text-lg font-medium px-4 py-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-400 transition-all"
          />
        </div>

        <div className="w-full flex flex-col gap-2 text-white">
          <label className="text-lg sm:text-xl font-semibold">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base sm:text-lg font-medium px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-400 transition-all"
            />
            {showPassword ? (
              <IoEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white w-6 h-6 cursor-pointer"
              />
            ) : (
              <IoEye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white w-6 h-6 cursor-pointer"
              />
            )}
          </div>
        </div>

        {error && (
          <div className="w-full">
            <p className="text-sm sm:text-base text-red-500 font-semibold">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="px-5 py-3 rounded-lg w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg sm:text-xl hover:opacity-80 transition disabled:opacity-60 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Loading..." : "Log In"}
        </button>

        <p className="text-sm sm:text-base text-gray-200 font-medium">
          New to Virtual Assistant?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-300 underline cursor-pointer hover:text-blue-400"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LogIn;
