import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import gsap from 'gsap';
import { ArrowLeft, Share2, Calendar, Tag, Edit3 } from 'lucide-react';
import { postService } from '../services/postService';
import Navbar from '../components/Navbar';
import CodeBlock from '../components/CodeBlock';
import ScrollProgress from '../components/ScrollProgress';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const isAdmin = localStorage.getItem('user') === 'wyper-admin';
  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const data = await postService.getPostBySlug(slug);
        setPost(data);
      } catch (error) {
        console.error("Error loading post", error);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };
    loadPost();
  }, [slug]);

  // Entrance Animation
  useLayoutEffect(() => {
    if (!loading && post && containerRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // Header Image Parallax & Scale
        tl.fromTo('.post-cover', 
          { scale: 1.2, filter: 'blur(10px)' },
          { scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' }
        );

        // Title & Meta Reveal
        tl.fromTo('.post-title-group > *',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
          "-=1.0"
        );

        // Content Fade In
        tl.fromTo('.markdown-body',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          "-=0.4"
        );

      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, post]);

  // 添加编辑文章函数
  const handleEdit = () => {
    // 将文章内容和原始slug传递到编辑器页面
    // 构造包含frontmatter的完整内容
    const frontmatter = `---
title: "${post.title}"
date: ${post.date}
tags: [${post.tags?.map(tag => `"${tag}"`).join(', ')}]
cover: "${post.cover}"
slug: "${post.slug}"
---`;
    
    const fullContent = `${frontmatter}\n\n${post.content}`;
    localStorage.setItem('wyper_draft', fullContent);
    navigate('/editor');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)]">
        <div className="text-[var(--primary)] font-mono animate-pulse text-xl">LOADING_DATA...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-body)] text-[var(--text-muted)]">
        <h1 className="text-2xl font-bold mb-4">404 - Post Not Found</h1>
        <Link to="/" className="text-[var(--secondary)] hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--bg-body)] relative z-10 transition-colors duration-500">
      <ScrollProgress />
      <Navbar />
      
      {/* Header Image */}
      <div className="h-[50vh] w-full relative overflow-hidden mt-16 group">
        <img 
          src={post.cover} 
          alt={post.title} 
          className="post-cover w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-body)]/30 via-[var(--bg-body)]/60 to-[var(--bg-body)] transition-colors duration-500"></div>
        
        <div className="post-title-group absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-5xl mx-auto right-0">
          <Link to="/" className="inline-flex items-center text-[var(--primary)] hover:text-[var(--text-main)] mb-6 transition-colors font-mono text-sm tracking-wide">
            <ArrowLeft size={16} className="mr-2" /> BACK_TO_BASE
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--text-main)] mb-6 leading-tight drop-shadow-lg transition-colors duration-500">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-muted)] font-mono border-l-2 border-[var(--secondary)] pl-4 transition-colors duration-500">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[var(--secondary)]" />
              {post.date}
            </div>
            <div className="flex items-center gap-3">
              <Tag size={14} className="text-[var(--primary)]" />
              {post.tags?.map(tag => (
                <span key={tag} className="bg-[var(--bg-card)] px-2 py-1 rounded text-xs border border-[var(--border-color)] transition-colors duration-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="markdown-body opacity-0">
          <Markdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock
            }}
          >
            {post.content}
          </Markdown>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border-color)] flex justify-between items-center transition-colors duration-500">
          <p className="text-[var(--text-muted)] text-sm font-mono">END_OF_FILE</p>
          <div className="flex items-center gap-3">
            {/* 添加编辑按钮 */}
            {isAdmin && (
  <button onClick={handleEdit} className="...">
    <Edit3 size={18} />
    <span className="text-sm font-bold">EDIT</span>
  </button>
)}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('链接已复制到剪贴板！');
              }}
              className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors px-4 py-2 rounded-full hover:bg-[var(--secondary)]/10"
            >
              <Share2 size={18} />
              <span className="text-sm font-bold">SHARE</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PostDetail;