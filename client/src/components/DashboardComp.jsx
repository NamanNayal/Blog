import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  // Dynamic classes based on theme
  const cardClass = `flex flex-col p-4 gap-4 rounded-md shadow-md border `;

  const tableCardClass = `flex flex-col shadow-md rounded-md  border`;

  const tableClass = `min-w-full text-sm text-left ${
    theme === 'light' ? 'text-gray-700' : 'text-gray-400'
  }`;

  const theadClass = ` text-xs`;

  const rowClass = `${
    theme === 'light'
      ? 'hover:bg-gray-50'
      : 'dark:hover:bg-gray-600'
  } transition-colors duration-150`;

  const cardData = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: 'fas fa-users',
      bg: 'bg-teal-600',
      change: lastMonthUsers
    },
    {
      title: 'Total Comments',
      value: totalComments,
      icon: 'fas fa-comments',
      bg: 'bg-indigo-600',
      change: lastMonthComments
    },
    {
      title: 'Total Posts',
      value: totalPosts,
      icon: 'fas fa-file-alt',
      bg: 'bg-lime-600',
      change: lastMonthPosts
    }
  ];

  return (
    <div className='p-4 max-w-7xl mx-auto space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {cardData.map((item, i) => (
          <div key={i} className={cardClass}>
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-gray-500 text-sm uppercase font-medium'>{item.title}</h3>
                <p className='text-2xl font-bold'>{item.value}</p>
              </div>
              <i className={`${item.icon} ${item.bg} text-white rounded-full text-4xl p-3 shadow-lg w-14 h-14 flex items-center justify-center`}></i>
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center font-medium'>
                <i className='fas fa-arrow-up mr-1'></i>
                {item.change}
              </span>
              <div className='text-gray-500'>Last month</div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Tables */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Users Table */}
        <TableCard 
          title='Recent users' 
          link='/dashboard?tab=users'
          theme={theme}
          tableCardClass={tableCardClass}
          tableClass={tableClass}
          theadClass={theadClass}
          rowClass={rowClass}
        >
          <thead className={theadClass}>
            <tr>
              <th className='px-4 py-3'>User image</th>
              <th className='px-4 py-3'>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={rowClass}>
                <td className='px-4 py-3'>
                  <img 
                    src={user.profilePicture} 
                    alt='user' 
                    className='w-10 h-10 rounded-full bg-gray-500 object-cover' 
                  />
                </td>
                <td className='px-4 py-3 font-medium'>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </TableCard>

        {/* Comments Table */}
        <TableCard 
          title='Recent comments' 
          link='/dashboard?tab=comments'
          theme={theme}
          tableCardClass={tableCardClass}
          tableClass={tableClass}
          theadClass={theadClass}
          rowClass={rowClass}
        >
          <thead className={theadClass}>
            <tr>
              <th className='px-4 py-3'>Comment content</th>
              <th className='px-4 py-3'>Likes</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment._id} className={rowClass}>
                <td className='px-4 py-3 max-w-xs'>
                  <p className='line-clamp-2 text-sm'>{comment.content}</p>
                </td>
                <td className='px-4 py-3 font-medium'>{comment.numberOfLikes}</td>
              </tr>
            ))}
          </tbody>
        </TableCard>

        {/* Posts Table */}
        <TableCard 
          title='Recent posts' 
          link='/dashboard?tab=posts'
          theme={theme}
          tableCardClass={tableCardClass}
          tableClass={tableClass}
          theadClass={theadClass}
          rowClass={rowClass}
        >
          <thead className={theadClass}>
            <tr>
              <th className='px-4 py-3'>Post image</th>
              <th className='px-4 py-3'>Post Title</th>
              <th className='px-4 py-3'>Category</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className={rowClass}>
                <td className='px-4 py-3'>
                  <img 
                    src={post.image} 
                    alt='post' 
                    className='w-14 h-10 rounded-md bg-gray-500 object-cover' 
                  />
                </td>
                <td className='px-4 py-3 font-medium max-w-xs truncate'>{post.title}</td>
                <td className='px-4 py-3'>
                  <span className='px-2 py-1 rounded-full text-xs font-medium'>
                    {post.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      </div>
    </div>
  );
}

function TableCard({ title, link, children, theme, tableCardClass, tableClass }) {
  const headerBorderClass = theme === 'light' ? 'border-gray-700' : 'dark:border-gray-700 ';
  
  return (
    <div className={tableCardClass}>
      <div className={`flex justify-between items-center p-4 border-b ${headerBorderClass}`}>
        <h2 className='font-semibold text-lg'>{title}</h2>
        
        <Link 
          to={link} 
          className='px-4 py-2   rounded-lg 
          bg-btn-primary hover:text-white transition-colors duration-200 text-sm font-medium'
        >
          See all
        </Link>
      </div>
      <div className='overflow-x-auto cursor-pointer'>
        <table className={tableClass}>
          {children}
        </table>
      </div>
    </div>
  );
}