import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const filePickerRef = useRef();

  const handleImageFile = (e) =>{
    const file = e.target.files[0];
    if(file){
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setImageFileUploadError("File size must be less than 2MB.");
        return;
      }
     
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadError(null);
    }
    
  };
  console.log(imageFile, imageFileUrl);

  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile]);
  
  const uploadImage = async () => {
      if (!currentUser) {
        setImageFileUploadError("You must be signed in to upload an image.");
        return;
      }

    setUploading(true);
    setImageFileUploadError(null);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'mern-blog'); // Set  in Cloudinary settings
  
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dkic3fn8d/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const data = await response.json();
      setImageFileUrl(data.secure_url); // Cloudinary URL
    } catch (error) {
      setImageFileUploadError('Could not upload image. Try again.');
    }finally {
      setUploading(false);
    }
  };

  

  return (
    <div className="flex justify-center items-center w-full transition-all ease-in-out">
      <div className="flex flex-col gap-8 max-w-lg w-full p-6 rounded-lg shadow-md items-center  ">
        
        {/* Profile Image */}
        <div className="w-32 h-32 shadow-lg rounded-full overflow-hidden my-4 hover:cursor-pointer" onClick={()=> filePickerRef.current.click()} >
        <div className="w-32 h-32 relative">
  {uploading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-36 h-36 rounded-full border-4 border-gray-300 border-t-[#00ADB5] animate-spin"></div>
    </div>
  )}
  <img
    src={imageFileUrl || currentUser.profilePicture}
    alt="user"
    className={`w-full h-full object-cover rounded-full border-4 border-gray-300 ${
      uploading ? "opacity-50" : ""
    }`}
  />
</div>



          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="w-full h-full object-cover border border-gray-300 dark:border-gray-600"
          />
        </div>

        {imageFileUploadError && ( 
          <p className="text-red-500 text-sm">{imageFileUploadError}</p>
        )}

        {/* Profile Info */}
        <h1 className="text-3xl font-semibold text-center hover:cursor-pointer">Profile</h1> 
        <form className="flex flex-col gap-4 w-full">
          {/* Image Upload */}
          <input type="file" accept="image/*" onChange={handleImageFile} ref={filePickerRef} hidden/>
          
          {/* Username */}
          <input
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
            className="input-field"
          />

          {/* Email */}
          <input
            type="text"
            id="email"
            placeholder="Email"
            defaultValue={currentUser.email}
            className="input-field"
          />

          {/* Password */}
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="input-field"
          />

          {/* Update Button */}
          <button type="submit" className="bg-btn-primary w-full py-2 px-4 rounded-md font-semibold">
            Update
          </button>
        </form>

        {/* Delete & Sign Out */}
        <div className="flex justify-between w-full mt-1 text-sm">
          <button className="bg-btn-primaryRed py-2 px-4 rounded-md">
            Delete Account
          </button>
          <button className="bg-btn-primaryRed py-2 px-4 rounded-md">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
