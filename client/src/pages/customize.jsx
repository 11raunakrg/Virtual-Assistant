import React, { useContext } from "react";
import Card from "../components/card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.jpeg";
import image6 from "../assets/image6.jpeg";
import authBg from "../assets/authBg.png";
import UploadCard from "../components/uploadCard";
import { userDataContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const { backendImage, selectedImage } = useContext(userDataContext);

  const navigate = useNavigate();

  const isImageChosen = selectedImage || backendImage;

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#04044d] flex flex-col items-center px-6 py-10">
      <h1 className="text-white text-2xl md:text-3xl font-semibold text-center mb-10">
        Select your <span className="text-blue-300">Assistant Image</span>
      </h1>

      <div className="w-full max-w-[1000px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={authBg} />
        <UploadCard />
      </div>

      <button
        disabled={!isImageChosen}
        onClick={() => navigate("/customize2")}
        className={`mt-12 px-8 py-3 text-lg font-bold rounded-xl shadow-lg transform transition duration-200 ease-in-out cursor-pointer
          ${
            isImageChosen
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105"
              : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
          }`}
      >
        Next →
      </button>
    </div>
  );
};

export default Customize;
