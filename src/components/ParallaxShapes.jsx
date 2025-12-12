import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxShapes = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const shapes = gsap.utils.toArray('.parallax-shape');
      
      shapes.forEach((shape, i) => {
        const speed = (i + 1) * 50; // 不同层级不同速度
        const rotation = (i % 2 === 0 ? 1 : -1) * 360;
        
        gsap.to(shape, {
          y: -speed,
          rotation: rotation,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1, // 平滑滚动
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {/* Shape 1: Large Circle */}
      <div className="parallax-shape absolute top-[10%] left-[5%] w-64 h-64 rounded-full border-2 border-[var(--primary)] opacity-20 blur-sm"></div>
      
      {/* Shape 2: Triangle (using CSS borders) */}
      <div 
        className="parallax-shape absolute top-[40%] right-[10%] w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[100px] border-b-[var(--secondary)] opacity-10"
      ></div>

      {/* Shape 3: Square Grid */}
      <div 
        className="parallax-shape absolute top-[70%] left-[20%] w-40 h-40 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(var(--primary) 2px, transparent 2px)',
          backgroundSize: '10px 10px'
        }}
      ></div>

      {/* Shape 4: Floating Cross */}
      <div className="parallax-shape absolute top-[20%] right-[30%] text-[var(--text-muted)] opacity-10 text-9xl font-mono font-bold">+</div>

      {/* Shape 5: Cyber Ring */}
      <div className="parallax-shape absolute bottom-[10%] left-[40%] w-80 h-80 rounded-full border border-dashed border-[var(--secondary)] opacity-20"></div>
    </div>
  );
};

export default ParallaxShapes;
