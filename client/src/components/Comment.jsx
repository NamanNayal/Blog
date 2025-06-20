import { Textarea } from 'flowbite-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const {currentUser} = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = async () =>{
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () =>{
    try{
      const res = await fetch(`/api/comment/editComment/${comment._id}`,{
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        })
      });
      if(res.ok){
        setIsEditing(false);
        onEdit(comment, editedContent);
      }

    }catch(error){
      console.log(error.message);
    }

  }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (
          <>
          <Textarea
            className='mb-2'
            value={editedContent} 
            onChange={(e)=>setEditedContent(e.target.value)} 
          />
          <div className='flex justify-end gap-2 text-xs'>
            <button 
              className='px-4 py-1 rounded bg-btn-primary'
              onClick={handleSave}
            >
              save
            </button>
            <button
              className='px-3 py-1 rounded bg-btn-primaryRed'
              onClick={()=> setIsEditing(false)}>
              cancel
            </button>
          </div>
          </>
        ):(
        <>
        <p className='text-gray-500 pb-2 break-words whitespace-pre-wrap overflow-wrap-anywhere'>{comment.content}</p>
        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
          <button
            type='button'
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 cursor-pointer ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              '!text-blue-500'
            }`}
          >
          <i className="fa-solid fa-thumbs-up"></i>
          </button>
          <p className='text-gray-400'>
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                ' ' +
                (comment.numberOfLikes === 1 ? 'like' : 'likes')}
          </p>
          {
            currentUser && 
              (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <>
                <button
                  type='button'
                  onClick={handleEdit}
                  className='text-gray-600 hover:text-[#5A5AFF] cursor-pointer'
                > 
                 <i className="fa-solid fa-pen" ></i> 
                </button>
                <button
                  type='button'
                  onClick={()=> onDelete(comment._id)}
                  className='hover:text-[#C62828] text-gray-600 cursor-pointer'>
                <i className="fa-solid fa-trash"></i>
                </button>
                </>
              )

          }
        </div>
        </>
        )}
      </div>
    </div>
  );
}