import React, { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/updateuser`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(result.data);
      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#04044d] flex flex-col items-center gap-8 pt-10 relative px-4">
      <IoArrowBackSharp
        onClick={() => navigate("/customize")}
        className="absolute text-white top-6 left-6 w-8 h-8 cursor-pointer hover:scale-110 transition duration-200"
      />

      <h1 className="text-2xl md:text-3xl text-white font-bold mt-20 text-center">
        Set <span className="text-blue-400">Virtual Assistant</span> Name
      </h1>

      <input
        type="text"
        placeholder="Enter Your Virtual Assistant Name..."
        required
        className="text-lg md:text-xl bg-white text-black px-5 py-4 
                   border-2 border-gray-300 rounded-xl w-full max-w-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      <button
        disabled={!assistantName.trim()}
        onClick={() => {
          navigate("/");
          handleUpdateAssistant();
        }}
        className={`px-8 py-3 mt-6 rounded-xl text-lg md:text-xl font-bold transition duration-300 ease-in-out transform shadow-lg cursor-pointer
          ${
            assistantName.trim()
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 hover:shadow-blue-500"
              : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
          }`}
      >
        Create Assistant
      </button>
    </div>
  );
};

export default Customize2;
