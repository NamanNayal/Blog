import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {Textarea} from 'flowbite-react';
import { useState } from 'react';
import Alert from './Alert';
import Comment from './Comment';


export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state)=> state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);


    useEffect(() => {
      const getComments = async () => {
        try {
          const res = await fetch(`/api/comment/getPostComments/${postId}`);
          if (res.ok) {
            const data = await res.json();
            setComments(data);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      getComments();
    }, [postId]);

    const handleSubmit = async (e) =>{
      e.preventDefault();
      setCommentError(null);
      if(comment.length >200){
        setCommentError('Comment is too long!');
        return;
      }
      if(comment.length < 1){
        setCommentError('Comment is too short!');
        return;
      }
      try{
        const res = await fetch(`/api/comment/create`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId,
            content: comment,
            userId: currentUser._id,
          }),
        });
        const data = await res.json();
        console.log(data);
        if(!res.ok){
          setCommentError(data.message || 'Something went wrong!');
          return;
        }
        setComment('');
        setComments([data, ...comments]);
        
      }catch(err){
        setCommentError(err.message);
      }
    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center text-gray-500 gap-1 my-5 text-sm'>
            <p>Signed in as</p>
            <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
            <Link 
            to={'/dashboard?tab=profile'}
            className='text-xs hover:underline hover:cursor-pointer'>
            @{currentUser.username}</Link>
        </div>
      ):(
        <div className='text-sm my-5 flex gap-1 text-[#5A5AFF]'>
            <p>You must be signed in to comment.</p>
            <Link className='hover:underline hover:cursor-pointer' to={'/sign-in'}>
            Sign In
            </Link>
        </div>
      )}
      {currentUser && (
        <form
            className='border border-[#5A5AFF] rounded-md p-3'
            onSubmit={handleSubmit}
           
        >
            <Textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e)=>setComment(e.target.value)}
            value = {comment}
            />
            <div className='flex justify-between items-center mt-5'>
                <p className='text-xs text-gray-500'>
                    {200 - comment.length} characters remaining
                </p>
                <button className='bg-btn-primary text-sm padding-1      py-2 px-4 rounded-lg ' type='submit'>Submit</button>
            </div>
            {commentError && <Alert type="danger" message={commentError}/>}
        </form>
      )}

{comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
}
