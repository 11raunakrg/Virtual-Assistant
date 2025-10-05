import React, { useRef, useContext } from "react";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { userDataContext } from "../context/userContext.jsx";

const UploadCard = () => {
  const {
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const inputImage = useRef(null);

  const handleClick = () => {
    inputImage.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div
        className="w-52 sm:w-60 md:w-64 h-64 sm:h-72 md:h-80 bg-[#0a0a51] border-2 rounded-2xl border-blue-800
        overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white
        cursor-pointer flex flex-col gap-2 justify-center items-center text-white transition-transform transform hover:scale-105"
        onClick={handleClick}
      >
        {frontendImage ? (
          <img
            src={frontendImage}
            alt="preview"
            className="w-full h-full object-cover object-center rounded-2xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <MdOutlineDriveFolderUpload className="w-12 h-12 sm:w-14 sm:h-14 text-blue-400" />
            <p className="text-white text-lg sm:text-xl font-semibold">
              Upload Image
            </p>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={inputImage}
        hidden
        onChange={handleChange}
      />
    </>
  );
};

export default UploadCard;
