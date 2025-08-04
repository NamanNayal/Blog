import React, { useState } from 'react'
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import ReactQuill from 'react-quill-new';

import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';


export default function CreatePost() {
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
    console.log('Form Data:', formData);


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

          console.log('Uploaded Image URL:', data.secure_url);
          console.log('Full Cloudinary Response:', data);
    
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
            const res = await fetch('/api/post/create',{
                method: 'POST',
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
      <h1 className='text-center text-3xl my-7 font-semibold w-full sm:w-[500px] md:w-[500px] lg:w-[500px] mx-auto mt-20 text-heading-1'>Create a post</h1>

                  
        {/* Error messages */}
        {imageUploadError && <Alert type="danger" message={imageUploadError} />}
      
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        {/* Title And Select */}
      <div className="grid gap-2 mb-2">
            <label htmlFor="title" className="text-body font-medium">Title</label>
            <input 
                type="text" 
                id="title" 
                className="input-field" 
                placeholder="Title" 
                required 
                onChange={(e)=>{
                    setFormData({...formData, title:e.target.value});
                }}
            />
        
            <label htmlFor="category" className="text-body font-medium">Select a category</label>
            <select 
                id="category" 
                className="input-field"
                onChange={(e) =>{
                    setFormData({...formData, category:e.target.value})
                }}
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
            <label htmlFor="dropzone-file" className="image-upload-zone">
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
                                    className="ml-2 text-blue-300 hover:text-blue-100 transition-colors duration-200"
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
                    <div className="upload-default-content">
                        <svg className="upload-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="upload-primary-text"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="upload-secondary-text">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
                            console.log("File selected:", selectedFile.name);
                            
                            // Create local preview and store in state
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                setFilePreview(event.target.result);
                                console.log("Local file preview ready");
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
        <div className="quill-editor-container">
            <label className="text-body font-medium mb-2 block">Content</label>
            <div className="quill-editor">
                <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    value={formData.content}
                    onChange={(value)=>{
                        setFormData({...formData, content: value});
                    }}
                    modules={{
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['blockquote', 'code-block'],
                            ['link'],
                            ['clean']
                        ]
                    }}
                    formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike',
                        'list', 'bullet',
                        'blockquote', 'code-block',
                        'link'
                    ]}
                />
            </div>
        </div>

        {/* Submit Button */}
        <button 
            type='submit' 
            className='bg-btn-primary rounded-md p-3 mb-12 hover:opacity-90 transition font-medium'
            disabled={imageUploading}
        >
            {imageUploading ? 'Please wait...' : 'Publish Post'}
        </button>
        {publishError && <Alert type="danger" message={publishError} />}
      </form>
    </div>
  )
}