import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";

const Card = ({ image }) => {
  const {
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const handleClick = () => {
    setSelectedImage(image);
    setBackendImage(null);
    setFrontendImage(null);
  };

  const isSelected = selectedImage === image;

  return (
    <div
      onClick={handleClick}
      className={`
        w-44 h-60 sm:w-52 sm:h-72 md:w-56 md:h-80 
        bg-[#0a0a51] border-2 rounded-2xl overflow-hidden cursor-pointer
        transform transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-2xl hover:shadow-blue-900
        ${
          isSelected
            ? "border-4 border-blue-400 shadow-lg shadow-blue-500"
            : "border-blue-800"
        }
      `}
    >
      <img
        src={image}
        alt="customized option"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Card;
