import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only enable on devices with hover capability
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;

    const onMouseMove = (e) => {
      // Smooth follow for the outer circle
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out'
      });
      // Instant follow for the inner dot
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.1 });
    };

    const onHoverStart = () => setIsHovered(true);
    const onHoverEnd = () => setIsHovered(false);

    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Attach hover listeners to clickable elements
    const clickableElements = document.querySelectorAll('a, button, input, textarea, .clickable');
    clickableElements.forEach(el => {
      el.addEventListener('mouseenter', onHoverStart);
      el.addEventListener('mouseleave', onHoverEnd);
    });

    // Mutation observer to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const newClickables = document.querySelectorAll('a, button, input, textarea, .clickable');
          newClickables.forEach(el => {
            el.removeEventListener('mouseenter', onHoverStart); // Prevent duplicates
            el.removeEventListener('mouseleave', onHoverEnd);
            el.addEventListener('mouseenter', onHoverStart);
            el.addEventListener('mouseleave', onHoverEnd);
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
      const clickables = document.querySelectorAll('a, button, input, textarea, .clickable');
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', onHoverStart);
        el.removeEventListener('mouseleave', onHoverEnd);
      });
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`custom-cursor ${isHovered ? 'hovered' : ''}`} 
      />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
};

export default CustomCursor;
