import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      
      gsap.to(barRef.current, {
        scaleX: scroll,
        transformOrigin: 'left',
        duration: 0.1,
        ease: 'none'
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <div 
        ref={barRef} 
        className="h-full bg-[var(--primary)] w-full scale-x-0 shadow-[0_0_10px_var(--primary)]" 
      />
    </div>
  );
};

export default ScrollProgress;
