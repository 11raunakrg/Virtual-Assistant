import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext.jsx";
import axios from "axios";
import bgImage from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const SignUp = () => {
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setError("");
      setLoading(false);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setUserData(null);
      setError(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-[100vh] flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md lg:max-w-lg bg-[#00000052] backdrop-blur flex flex-col items-center justify-center gap-4 p-8 lg:p-10 shadow-lg shadow-black rounded-lg"
      >
        <h1 className="text-2xl sm:text-3xl text-white font-semibold mb-6 lg:mb-8 text-center">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <div className="w-full flex flex-col gap-1 sm:gap-2 text-white">
          <label className="text-base sm:text-lg font-semibold">Name :</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-sm sm:text-lg font-semibold px-4 sm:px-5 py-2 sm:py-3 border-2 rounded-lg w-full"
          />
        </div>

        <div className="w-full flex flex-col gap-1 sm:gap-2 text-white">
          <label className="text-base sm:text-lg font-semibold">Email :</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-sm sm:text-lg font-semibold px-4 sm:px-5 py-2 sm:py-3 border-2 rounded-lg w-full"
          />
        </div>

        <div className="w-[80%] flex flex-col gap-2 text-white">
          <h5 className="text-xl font-semibold">Password :</h5>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg font-semibold px-5 py-3 pr-12 border-2 rounded-lg w-full"
            />
            {showPassword ? (
              <IoEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white w-6 h-6 cursor-pointer"
              />
            ) : (
              <IoEye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white w-6 h-6 cursor-pointer"
              />
            )}
          </div>
        </div>

        {error && (
          <div className="mt-2">
            <h3 className="text-sm sm:text-base text-red-700 font-semibold text-center">
              {error}
            </h3>
          </div>
        )}

        <div className="mt-4 sm:mt-5 w-full flex justify-center">
          <button
            type="submit"
            className="text-xl sm:text-lg font-semibold text-white bg-green-800 hover:bg-green-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full sm:w-auto text-center cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading.." : "Register"}
          </button>
        </div>

        <p className="text-sm sm:text-base text-white mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-300 underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
