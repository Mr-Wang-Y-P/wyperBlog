import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PostCard3D = ({ post, index }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10; // Max 10deg rotation
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="perspective-1000 h-full"
    >
      <Link to={`/post/${post.slug}`} className="block h-full">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: 'transform 0.1s ease-out, background-color 0.3s ease, border-color 0.3s ease'
          }}
          className="relative h-full bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--primary)] group shadow-xl hover:shadow-[0_0_30px_var(--shadow-color)]"
        >
          {/* 光效遮罩 */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 - rotateX * 2}%, rgba(255,255,255,0.1), transparent)`
            }}
          />

          <div className="aspect-video overflow-hidden relative">
            <img 
              src={post.cover} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-[var(--bg-body)]/20 group-hover:bg-transparent transition-colors"></div>
            
            {/* 标签浮动 */}
            <div className="absolute top-4 left-4 flex gap-2 z-20">
              {post.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-[var(--bg-body)] bg-[var(--primary)] px-2 py-1 rounded shadow-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-1 relative z-0">
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
              {post.title}
            </h2>
            
            <p className="text-[var(--text-muted)] text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
              {post.content.replace(/#|`|\*|\[|\]|\(|\)/g, '').slice(0, 100)}...
            </p>
            
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-color)]">
              <span className="font-mono">{post.date}</span>
              <span className="text-[var(--secondary)] group-hover:translate-x-2 transition-transform flex items-center gap-1">
                READ MORE <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard3D;
