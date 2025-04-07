import React, { useEffect, useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {updateStart, updateSuccess, updateFailure,deleteUserStart,deleteUserFaliure,deleteUserSuccess, signOutSuccess} from '../redux/user/userSlice';
import { toast } from 'react-hot-toast';


export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const filePickerRef = useRef();
  const [formData, setFormData] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const dispatch = useDispatch();

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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async(e) =>{
    e.preventDefault(); 
    const updatedData = { ...formData };
     if (imageFileUrl) {
    updatedData.profilePicture = imageFileUrl;
  }
    if(Object.keys(updatedData).length === 0){
      toast.error("Nothing to update");
      return;
    }
    try{
           
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
        toast.error(data.message || 'Update failed', { id: 'update-error' });
      }else{
        dispatch(updateSuccess(data));
        toast.success(data.message || 'Profile updated successfully', { id: 'update-success' });
      }

    }catch(error){
      dispatch(updateFailure(error.message));
      toast.error(error.message || 'Something went wrong.');
    }
  }
 const handleDeleteUser = async() =>{
  setShowConfirmDelete(false);
  try{
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method: 'DELETE',
    });
    const data = await res.json()
    if(!res.ok){
      dispatch(deleteUserFaliure(data.message));
    }else{
      dispatch(deleteUserSuccess(data));
    }
  }catch(error){
    dispatch(deleteUserFaliure(error.message));
  }
 } 

 const handleSignOut = async() =>{
    try{
      const res = await fetch('api/user/signout',{
        method: 'POST',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signOutSuccess());

      }

    }catch(error){
      console.log(error.message);
    }
      
 }

  

  return (
    <div className="flex justify-center items-center w-full transition-all ease-in-out">
      <div className="flex flex-col gap-8 max-w-lg w-full p-6 rounded-lg shadow-md items-center  ">
        
        {/* Profile Image */}
        <div className="w-32 h-32 shadow-lg rounded-full overflow-hidden my-4 hover:cursor-pointer" onClick={()=> filePickerRef.current.click()} >
        <div className="w-32 h-32 ">
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

        </div>

        {imageFileUploadError && ( 
          <p className="text-red-500 text-sm">{imageFileUploadError}</p>
        )}

        {/* Profile Info */}
        <h1 className="text-3xl font-semibold text-center hover:cursor-pointer">Profile</h1> 
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Image Upload */}
          <input type="file" accept="image/*" onChange={handleImageFile} ref={filePickerRef} hidden/>
          
          {/* Username */}
          <input
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
            className="input-field"
            onChange={handleChange}
            />

          {/* Email */}
          <input
            type="text"
            id="email"
            placeholder="Email"
            defaultValue={currentUser.email}
            className="input-field"
            onChange={handleChange}
          />

          {/* Password */}
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="input-field"
            onChange={handleChange}
          />

          {/* Update Button */}
          <button type="submit" className="bg-btn-primary w-full py-2 px-4 rounded-md font-semibold">
            Update
          </button>
        </form>

        {/* Delete & Sign Out */}
        <div className="flex justify-between w-full mt-1 text-sm">
          <button
          onClick={()=>setShowConfirmDelete(true)} className="bg-btn-primaryRed py-2 px-4 rounded-md">
            Delete Account
          </button>
          <button onClick={handleSignOut} className="bg-btn-primaryRed py-2 px-4 rounded-md">
            Sign Out
          </button>
        </div>
        {
          showConfirmDelete &&(
            <div className="modal-overlay">
              <div className="modal-container">
                <h2 className="modal-header">Confirm Deletion</h2>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>

                <div className="modal-actions">
                  <button onClick={()=> setShowConfirmDelete(false)} className="bg-btn-secondary px-4 py-2 rounded-md">
                    Cancel
                  </button>
                  <button onClick={handleDeleteUser} className="bg-btn-primaryRed px-4 py-2 rounded-md">
                    Confirm
                  </button>

                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}
