import React, { useState } from 'react'
import Loading from '../components/Loading';
import Alert from '../components/Alert';


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

  return (
    <div className='p-3 max-w-xl sm:mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold w-full sm:w-[500px] md:w-[500px] lg:w-[500px] mx-auto mt-20'>Create a post</h1>

                  
        {/* Error messages */}
        {imageUploadError && <Alert type="danger" message={imageUploadError} />}
      
      <form className='flex flex-col gap-4' >
        {/* Title And Select */}
      <div className="grid gap-2 mb-2">
            <label htmlFor="title">Title</label>
            <input 
                type="text" 
                id="title" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Title" 
                required 
                value={formData.title}
            />
        
            <label htmlFor="category">Select a category</label>
            <select 
                id="category" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.category}
            >
              <option value="others">others</option>
              <option value="React">React</option>
              <option value="Next">Next</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Angular">Angular</option>
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
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600 border-gray-200">
                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                        <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
                            </svg>
                            <span className="sr-only">Attach file</span>
                        </button>
                        <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                            </svg>
                            <span className="sr-only">Embed map</span>
                        </button>
                        <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                            </svg>
                            <span className="sr-only">Upload image</span>
                        </button>
                        <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                                <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z"/>
                            </svg>
                            <span className="sr-only">Format code</span>
                        </button>
                        <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z"/>
                            </svg>
                            <span className="sr-only">Add emoji</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                        <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"/>
                            </svg>
                            <span className="sr-only">Add list</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                <label htmlFor="content" className="sr-only">Publish post</label>
                <textarea 
                    id="content" 
                    rows="8" 
                    className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
                    placeholder="Write an article..." 
                    required
                    value={formData.content}
                ></textarea>
            </div>
        </div>

        {/* Submit Button */}
        <button 
            type='submit' 
            className='bg-btn-primary rounded-md p-3 mb-12 hover:opacity-90 transition'
            disabled={imageUploading}
        >
            Publish Post
    
        </button>
      </form>
    </div>
  )
}