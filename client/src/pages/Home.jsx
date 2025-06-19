import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/getPosts');
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"></div>
        <div className="relative flex flex-col gap-8 py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Welcome to my Blog
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed opacity-80">
              Discover insightful articles and comprehensive tutorials covering web development, 
              software engineering, and modern programming languages. Join me on this journey 
              of continuous learning and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to="/search"
                className="inline-flex items-center px-8 py-3 text-base font-medium rounded-full bg-btn-primary transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore All Posts
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-3 text-base font-medium rounded-full border-2 bg-btn-secondary transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CallToAction />
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <Loading text="Loading posts..." size={50} overlay={true} />
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-lg mb-4">
                Error loading posts: {error}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#5A5AFF] text-white rounded-lg hover:bg-[##3A3AFF] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Recent Posts
                </h2>
                <div className="w-24 h-1 bg-[#5A5AFF] mx-auto rounded-full"></div>
                <p className="max-w-2xl mx-auto opacity-80">
                  Stay up to date with the latest insights and tutorials
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <div key={post._id} className="transform hover:scale-105 transition-transform duration-200">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-8">
                <Link
                  to="/search"
                  className="inline-flex items-center px-8 py-3 text-base font-medium rounded-full bg-btn-primary transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  View All Posts
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-lg mb-4 opacity-60">
                No posts available yet
              </div>
              <p className="opacity-40">
                Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}