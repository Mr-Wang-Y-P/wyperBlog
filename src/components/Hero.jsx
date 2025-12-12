import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowDown, Zap, Hexagon, Code2, Cpu, Database, Activity } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const btnRef = useRef(null);
  const [decodedTitle, setDecodedTitle] = useState("WYPER");
  const [decodedSubtitle, setDecodedSubtitle] = useState("BLOG_PLATFORM");

  // Magnetic Button Logic
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Calculate distance to center
      const distance = Math.sqrt(x * x + y * y);
      const hoverRadius = 150; // Trigger radius

      if (distance < hoverRadius) {
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scramble Text Effect Logic
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const targetTitle = "WYPER";
    const targetSubtitle = "BLOG_PLATFORM";
    
    let iteration1 = 0;
    let iteration2 = 0;
    
    const interval = setInterval(() => {
      // Title Scramble
      setDecodedTitle(prev => 
        targetTitle
          .split("")
          .map((letter, index) => {
            if (index < iteration1) return letter;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      // Subtitle Scramble
      setDecodedSubtitle(prev => 
        targetSubtitle
          .split("")
          .map((letter, index) => {
            if (index < iteration2) return letter;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration1 < targetTitle.length) iteration1 += 1/3;
      if (iteration2 < targetSubtitle.length) iteration2 += 1/3;

      if (iteration1 >= targetTitle.length && iteration2 >= targetSubtitle.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Background Rings Animation
      gsap.to('.cyber-ring', {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: 'linear'
      });

      gsap.to('.cyber-ring-reverse', {
        rotate: -360,
        duration: 25,
        repeat: -1,
        ease: 'linear'
      });

      // Entry Animation
      tl.fromTo('.hero-content',
        { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
      )
      .fromTo('.stat-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        "-=0.5"
      )
      .fromTo('.action-btn',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
        "-=0.3"
      );

      // Floating Icons Animation
      gsap.to('.float-icon', {
        y: -15,
        rotation: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: "random"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToContent = () => {
    const content = document.getElementById('content-start');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden z-20 perspective-1000">
      {/* Cyber Grid Floor */}
      <div className="cyber-grid-container opacity-40">
        <div className="cyber-grid"></div>
      </div>
      
      {/* Fade Overlay */}
      <div className="hero-fade-overlay"></div>

      {/* Decorative Rotating Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[var(--primary)]/10 rounded-full cyber-ring pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[var(--secondary)]/10 rounded-full cyber-ring-reverse pointer-events-none border-dashed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-[var(--text-muted)]/5 rounded-full cyber-ring pointer-events-none border-dotted"></div>

      {/* Floating 3D Icons */}
      <div className="absolute top-[20%] left-[10%] float-icon text-[var(--primary)] opacity-60">
        <Hexagon size={48} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[20%] right-[10%] float-icon text-[var(--secondary)] opacity-60">
        <Code2 size={64} strokeWidth={1} />
      </div>
      <div className="absolute top-[30%] right-[20%] float-icon text-[var(--text-muted)] opacity-20 blur-[2px]">
        <Database size={32} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[30%] left-[20%] float-icon text-[var(--primary)] opacity-20 blur-[1px]">
        <Cpu size={40} strokeWidth={1} />
      </div>

      {/* Main Content */}
      <div className="hero-content text-center relative z-10 px-4 max-w-5xl mx-auto">
        {/* Status Badge */}
        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--primary)]/20 bg-[var(--bg-card)]/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,157,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
          </span>
          <span className="text-xs font-mono text-[var(--primary)] tracking-widest">SYSTEM_ONLINE</span>
        </div>
        
        {/* Scramble Title */}
        <h1 ref={titleRef} className="text-7xl md:text-9xl font-black tracking-tighter mb-6 font-mono relative select-none">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-main)] to-[var(--text-muted)] drop-shadow-2xl">
            {decodedTitle}
          </span>
          <span className="block text-[var(--primary)] text-4xl md:text-6xl mt-[-10px] md:mt-[-20px] opacity-90 tracking-widest">
            {decodedSubtitle}
          </span>
        </h1>
        
        {/* Stats / Info Grid */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 border-t border-b border-[var(--border-color)] py-6 bg-[var(--bg-card)]/30 backdrop-blur-sm">
          <div className="stat-item flex flex-col items-center gap-1">
            <Activity size={20} className="text-[var(--secondary)] mb-1" />
            <span className="text-2xl font-bold text-[var(--text-main)] font-mono">12ms</span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Latency</span>
          </div>
          <div className="stat-item flex flex-col items-center gap-1 border-l border-r border-[var(--border-color)]">
            <Zap size={20} className="text-[var(--primary)] mb-1" />
            <span className="text-2xl font-bold text-[var(--text-main)] font-mono">100%</span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Uptime</span>
          </div>
          <div className="stat-item flex flex-col items-center gap-1">
            <Database size={20} className="text-[var(--secondary)] mb-1" />
            <span className="text-2xl font-bold text-[var(--text-main)] font-mono">Local</span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Storage</span>
          </div>
        </div>

        {/* CTA Button with Magnetic Effect */}
        <div ref={btnRef} className="inline-block">
          <button 
            onClick={scrollToContent}
            className="action-btn group relative px-12 py-4 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all duration-300 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] clickable"
          >
            <div className="absolute inset-0 bg-[var(--primary)]/10 w-0 group-hover:w-full transition-all duration-300 ease-out"></div>
            <div className="flex items-center gap-3 relative z-10">
              <span className="font-mono font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors tracking-widest">INITIALIZE_READING</span>
              <ArrowDown size={18} className="text-[var(--primary)] group-hover:translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
