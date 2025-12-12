import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PostCard3D from '../components/PostCard3D';
import { postService } from '../services/postService';
import ChatDrawer from '../components/ChatDrawer';
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const postsContainerRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // GSAP Animation for Posts List
  useEffect(() => {
    if (!loading && filteredPosts.length > 0 && postsContainerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                postsContainerRef.current.children,
                { 
                  y: 100, 
                  opacity: 0,
                  scale: 0.9
                },
                { 
                  y: 0, 
                  opacity: 1,
                  scale: 1,
                  duration: 0.8, 
                  stagger: 0.15,
                  ease: "power3.out",
                  overwrite: true
                }
              );
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(postsContainerRef.current);
      return () => observer.disconnect();
    }
  }, [loading, filteredPosts]);

  const handleSearch = (term) => {
    if (!term) {
      setFilteredPosts(posts);
      return;
    }
    const results = posts.filter(post => 
      post.title.toLowerCase().includes(term.toLowerCase()) ||
      post.content.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPosts(results);
  };

  return (
    <div className="min-h-screen relative z-10 bg-[var(--bg-body)]">
      <Navbar onSearch={handleSearch} />
      
      {/* 炫酷首屏 */}
      <Hero />
      
      {/* 文章列表锚点 */}
      <div id="content-start" className="pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 border-b border-[var(--border-color)] pb-4">
          <h2 className="text-3xl font-bold text-[var(--text-main)] flex items-center gap-3">
            <span className="w-2 h-8 bg-[var(--secondary)] rounded-full shadow-[0_0_10px_var(--secondary)]"></span>
            LATEST_LOGS
          </h2>
          <span className="text-[var(--text-muted)] font-mono text-sm hidden md:block">
            // TOTAL_POSTS: {filteredPosts.length}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : (
          <div ref={postsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {filteredPosts.map((post, index) => (
              <div key={post.slug} className="h-full">
                <PostCard3D post={post} index={index} />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[var(--border-color)] rounded-xl">
            <p className="text-[var(--text-muted)] text-lg">SYSTEM_ERROR: No results found.</p>
            <p className="text-[var(--text-muted)] text-sm mt-2 opacity-60">尝试更换搜索关键词</p>
          </div>
        )}
      </div>
       <ChatDrawer />
    </div>
  );
};

export default Home;
