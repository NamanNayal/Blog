import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import ReactQuill from 'react-quill-new';

import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({
        title:'',
        category:'others',
        content:'',
        image: '',
    });
    const [publishError, setPublishError] = useState(null);

    const navigate = useNavigate();
    const {postId} = useParams();
    const {currentUser} = useSelector((state) => state.user);
    

    useEffect(()=>{
        try{
            const fetchPostData = async () =>{
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if(!res.ok){
                    setPublishError(data.message);
                    return;
                }
                if(res.ok){
                    setPublishError(null);
                    setFormData(data.posts[0]);
                }
            };
            fetchPostData();

        }catch(error){
            console.error('Error fetching post data:', error);
        }
    },[postId]);

    const handleUploadImage = async () => {
        if (!file) {
          setImageUploadError('Please select an image to upload');
          return;
        }
        try {
          // Create form data for Cloudinary
          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append('file', file);
          cloudinaryFormData.append('upload_preset', 'mern-blog');
    
          setImageUploadError(null);
          setImageUploading(true);
    
          // Cloudinary API call
          const response = await fetch('https://api.cloudinary.com/v1_1/dkic3fn8d/image/upload', {
            method: 'POST',
            body: cloudinaryFormData,
          });
    
          const data = await response.json();

    
          setImageUploading(false);
          setImageUploadError(null);
    
          setFormData((prev) => ({ ...prev, image: data.secure_url }));
        } catch (error) {
          console.error('Upload Error:', error);
          setImageUploading(false);
          setImageUploadError('Image upload failed. Please try again.');
        }
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok){
                setPublishError(data.message);
                return;
            }

            if(res.ok){
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }

        }catch(error){
            setPublishError('An error occurred while publishing the post. Please try again.');
        }
    }

  return (
    <div className='p-3 max-w-xl sm:mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold w-full sm:w-[500px] md:w-[500px] lg:w-[500px] mx-auto mt-20'>Create a post</h1>

                  
        {/* Error messages */}
        {imageUploadError && <Alert type="danger" message={imageUploadError} />}
      
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        {/* Title And Select */}
      <div className="grid gap-2 mb-2">
            <label htmlFor="title">Title</label>
            <input 
                type="text" 
                id="title" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Title" 
                required 
                onChange={(e)=>{
                    setFormData({...formData, title:e.target.value});
                }}
                value={formData.title}
            />
        
            <label htmlFor="category">Select a category</label>
            <select 
                id="category" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                onChange={(e) =>{
                    setFormData({...formData, category:e.target.value})
                }}
                value={formData.category}
            >
            <option value="others">अन्य</option>
            <option value="kavita">कविताएँ</option>
            <option value="laghu-katha">लघु कथाएँ</option>
            <option value="vichar">विचार और अनुभव</option>
            <option value="shrunkhala">श्रृंखला विशेष</option>
            </select>
        </div>


        {/* Image Upload */}
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 overflow-hidden relative ">
                {filePreview ? (
                    /* Show image preview if available */
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img 
                            src={filePreview} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain" 
                            
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
                            {file?.name}
                            {!formData.image && (
                                <button 
                                    type="button"
                                    className="ml-2 text-blue-300 hover:text-blue-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleUploadImage();
                                    }}
                                >
                                    Upload now
                                </button>
                            )}
                        </div>
                    </div>
                ) : formData.image ? (
                    /* Show uploaded Cloudinary image */
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img 
                            src={formData.image} 
                            alt="Uploaded image" 
                            className="max-h-full max-w-full object-contain" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
                            <span className="text-green-300">✓ Uploaded</span>
                        </div>
                    </div>
                ) : (
                    /* Default upload interface */
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                )}
                {imageUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Loading text='Uploading...' size={40} overlay={false} />
                    </div>
                )}
                <input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                            setFile(selectedFile);
                            
                            // Create local preview and store in state
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                setFilePreview(event.target.result);
                                
                            };
                            reader.readAsDataURL(selectedFile);
                            
                            // Reset the Cloudinary uploaded image when selecting a new file
                            if (formData.image) {
                                setFormData(prev => ({ ...prev, image: '' }));
                            }
                        }
                    }}
                />
            </label>

        </div>

        {/* Text Editor */}
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600 border-gray-200">
                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                    
                    
                    <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    className='h-72 mb-12 w-110  pl-8 pt-2 pb-1  text-black dark:text-white'
                    required
                    onChange={(value)=>{
                        setFormData({...formData, content: value});
                    }}
                    value={formData.content}
                    />


                    </div>
                </div>
            </div>
        </div>

        {/* Submit Button */}
        <button 
            type='submit' 
            className='bg-btn-primary rounded-md p-3 mb-12 hover:opacity-90 transition'
            disabled={imageUploading}
        >
            Update Post
    
        </button>
        {publishError && <Alert type="danger" message={publishError} />}
      </form>
    </div>
  )
}