import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PenTool, Zap } from 'lucide-react';
import gsap from 'gsap';
import { db } from '../utils/dataManager';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navRef = useRef(null);
  const navigate = useNavigate();

  // Scroll Animation for Navbar
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // 只有当滚动超过一定距离才触发隐藏
      if (currentScrollY > 100) {
        if (direction === 'down') {
          gsap.to(navRef.current, { y: -100, duration: 0.3, ease: 'power2.inOut' });
        } else {
          gsap.to(navRef.current, { y: 0, duration: 0.3, ease: 'power2.inOut' });
        }
      } else {
        gsap.to(navRef.current, { y: 0, duration: 0.3, ease: 'power2.inOut' });
      }

      // 增加背景模糊度
      if (currentScrollY > 50) {
        gsap.to(navRef.current, { 
          backgroundColor: 'var(--glass-bg)', 
          backdropFilter: 'blur(12px)',
          borderBottomColor: 'var(--border-color)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        });
      } else {
        gsap.to(navRef.current, { 
          backgroundColor: 'transparent', 
          backdropFilter: 'blur(0px)',
          borderBottomColor: 'transparent',
          boxShadow: 'none'
        });
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const posts = db.getPosts();
      const results = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

const isAdmin = localStorage.getItem('user') === 'wyper-admin';
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) onSearch(term);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
      {/* Logo */}
      <Link to="/" className="group flex items-center gap-2">
        <div className="p-1.5 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_var(--shadow-color)]">
          <Zap size={20} className="text-[var(--bg-body)]" fill="currentColor" />
        </div>
        <span className="font-bold text-xl tracking-tight text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
          wyper<span className="text-[var(--secondary)]">Blog</span>
        </span>
      </Link>

      {/* Search */}
      <div className="relative hidden md:block w-96">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="搜索文章标题或内容..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full py-2 pl-10 pr-4 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition-all placeholder-[var(--text-muted)]"
        />
        
        {/* Search Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden">
            {searchResults.slice(0, 5).map(post => (
              <Link 
                key={post.slug} 
                to={`/post/${post.slug}`}
                onClick={() => { setSearchTerm(''); setSearchResults([]); }}
                className="block px-4 py-3 hover:bg-[var(--bg-input)] border-b border-[var(--border-color)] last:border-0 transition-colors"
              >
                <div className="text-[var(--primary)] text-sm font-medium truncate">{post.title}</div>
                <div className="text-[var(--text-muted)] text-xs mt-0.5 truncate">{post.date}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isAdmin && (
  <Link 
    to="/editor" 
    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--bg-body)] font-bold text-sm hover:shadow-[0_0_20px_var(--shadow-color)] transition-all active:scale-95"
  >
    <PenTool size={16} />
    <span>发布</span>
  </Link>
)}
      </div>
    </nav>
  );
};

export default Navbar;
