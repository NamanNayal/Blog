import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    
    // Handle null values properly
    setSidebarData({
      searchTerm: searchTermFromUrl || '',
      sort: sortFromUrl || 'desc',
      category: categoryFromUrl || 'uncategorized',
    });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Create new URLSearchParams for backend API call with correct parameter names
        const apiParams = new URLSearchParams();
        
        // Map frontend parameters to backend parameter names
        if (searchTermFromUrl) apiParams.set('searchTerm', searchTermFromUrl);
        if (sortFromUrl) apiParams.set('order', sortFromUrl); // Backend expects 'order'
        if (categoryFromUrl && categoryFromUrl !== 'uncategorized') {
          apiParams.set('category', categoryFromUrl);
        }
        
        const res = await fetch(`/api/post/getposts?${apiParams.toString()}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setPosts(data.posts);
        
        // Check if we have exactly the limit (9) posts to show "Show More"
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setShowMore(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: value });
    } else if (id === 'sort') {
      setSidebarData({ ...sidebarData, sort: value || 'desc' });
    } else if (id === 'category') {
      setSidebarData({ ...sidebarData, category: value || 'uncategorized' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    
    // Only add parameters if they have meaningful values
    if (sidebarData.searchTerm) {
      urlParams.set('searchTerm', sidebarData.searchTerm);
    }
    urlParams.set('sort', sidebarData.sort);
    if (sidebarData.category !== 'uncategorized') {
      urlParams.set('category', sidebarData.category);
    }
    
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    
    // Close mobile search panel after submit
    setShowMobileSearch(false);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const urlParams = new URLSearchParams(location.search);
    
    // Create API parameters with backend naming convention
    const apiParams = new URLSearchParams();
    
    // Copy existing search parameters with correct backend names
    const searchTerm = urlParams.get('searchTerm');
    const sort = urlParams.get('sort');
    const category = urlParams.get('category');
    
    if (searchTerm) apiParams.set('searchTerm', searchTerm);
    if (sort) apiParams.set('order', sort); // Backend expects 'order'
    if (category && category !== 'uncategorized') apiParams.set('category', category);
    
    // Add pagination parameter with backend naming
    apiParams.set('start', numberOfPosts.toString()); // Backend expects 'start'
    
    try {
      const res = await fetch(`/api/post/getposts?${apiParams.toString()}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      
      // Show more button only if we got exactly 9 posts (meaning there might be more)
      setShowMore(data.posts.length === 9);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setShowMore(false);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen'>
      {/* Mobile Search Toggle Button */}
      <div className='lg:hidden border-b p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold'>Search Posts</h1>
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className='flex items-center gap-2 px-4 py-2 bg-btn-primary rounded-lg hover:opacity-80 transition-opacity'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            <span>Search & Filter</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Panel (Collapsible) */}
      {showMobileSearch && (
        <div className='lg:hidden border-b p-4'>
          <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Quick Search Input */}
            <div className='space-y-2'>
              <label className='block text-sm font-semibold'>
                Search Term
              </label>
              <TextInput
                placeholder='Enter keywords...'
                id='searchTerm'
                type='text'
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>

            {/* Quick Filters Row */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <label className='block text-xs font-semibold opacity-75'>
                  Sort By
                </label>
                <Select 
                  onChange={handleChange} 
                  value={sidebarData.sort} 
                  id='sort'
                  size='sm'
                >
                  <option value='desc'>Latest First</option>
                  <option value='asc'>Oldest First</option>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='block text-xs font-semibold opacity-75'>
                  Category
                </label>
                <Select
                  onChange={handleChange}
                  value={sidebarData.category}
                  id='category'
                  size='sm'
                >
                  <option value='uncategorized'>All Categories</option>
                  <option value='reactjs'>React.js</option>
                  <option value='nextjs'>Next.js</option>
                  <option value='javascript'>JavaScript</option>
                </Select>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className='flex gap-2'>
              <Button 
                type='submit' 
                gradientDuoTone='purpleToPink'
                className='flex-1 items-center bg-btn-secondary'
                size='sm'
              >
                Apply Filters
              </Button>
              <button
                type='button'
                onClick={() => setShowMobileSearch(false)}
                className='px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity text-sm bg-btn-secondaryRed'
                
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className='hidden lg:block w-80 border-r'>
        <div className='p-6'>
          <h2 className='text-xl font-bold mb-6'>
            Search & Filter
          </h2>
          
          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Search Term */}
            <div className='space-y-2'>
              <label className='block text-sm font-semibold'>
                Search Term
              </label>
              <TextInput
                placeholder='Enter keywords...'
                id='searchTerm'
                type='text'
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>

            {/* Sort and Category in a grid */}
            <div className='space-y-4'>
              {/* Sort */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold'>
                  Sort By
                </label>
                <Select 
                  onChange={handleChange} 
                  value={sidebarData.sort} 
                  id='sort'
                >
                  <option value='desc'>Latest First</option>
                  <option value='asc'>Oldest First</option>
                </Select>
              </div>

              {/* Category */}
              <div className='space-y-2'>
                <label className='block text-sm font-semibold'>
                  Category
                </label>
                <Select
                  onChange={handleChange}
                  value={sidebarData.category}
                  id='category'
                >
                  <option value='uncategorized'>All Categories</option>
                  <option value='reactjs'>React.js</option>
                  <option value='nextjs'>Next.js</option>
                  <option value='javascript'>JavaScript</option>
                </Select>
              </div>
            </div>

            {/* Apply Button */}
            <Button 
              type='submit' 
              gradientDuoTone='purpleToPink'
              className='w-full cursor-pointer bg-btn-secondary'
            >
              Apply Filters 
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Desktop Header */}
        <div className='hidden lg:block p-6'>
          <h1 className='text-2xl lg:text-3xl font-bold'>
            Search Results
          </h1>
          {!loading && posts.length > 0 && (
            <p className='mt-1 opacity-75'>
              Found {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Mobile Results Header */}
        <div className='lg:hidden px-4 py-2 border-b'>
          {!loading && posts.length > 0 && (
            <p className='text-sm opacity-75'>
              Found {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Posts Grid */}
        <div className='flex-1 p-4 lg:p-6'>
          {!loading && posts.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-xl opacity-75'>No posts found.</p>
              <p className='mt-2 opacity-60'>Try adjusting your search criteria.</p>
            </div>
          )}
          
          {loading && (
            <div className='text-center py-12'>
              <p className='text-xl opacity-75'>Loading...</p>
            </div>
          )}
          
          {!loading && posts && posts.length > 0 && (
            <>
              {/* Posts Grid - Responsive */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8 auto-rows-fr mb-8'>
                {posts.map((post) => (
                  <div key={post._id} className='flex'>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {showMore && (
                <div className='text-center'>
                  <button
                    onClick={handleShowMore}
                    className='px-6 py-3 text-base font-medium rounded-lg transition-colors duration-200 hover:opacity-80 bg-btn-primary'
                  >
                    Load More Posts
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}