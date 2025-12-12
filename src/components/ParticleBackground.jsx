import React, { useEffect, useRef } from 'react';

// Color definitions for JS interpolation
const THEMES = {
  dark: {
    c1: { r: 0, g: 255, b: 157 },   // #00FF9D
    c2: { r: 58, g: 141, b: 255 },  // #3A8DFF
    bg: { r: 13, g: 15, b: 23 }     // #0D0F17
  },
  light: {
    c1: { r: 5, g: 150, b: 105 },   // #059669
    c2: { r: 37, g: 99, b: 235 },   // #2563EB
    bg: { r: 240, g: 242, b: 245 }  // #F0F2F5
  }
};

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  // Store current color state for interpolation
  const colorState = useRef({
    currentC1: { ...THEMES.dark.c1 },
    currentC2: { ...THEMES.dark.c2 },
    targetTheme: 'dark'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Linear interpolation helper
    const lerp = (start, end, factor) => start + (end - start) * factor;
    
    // Update color state towards target
    const updateColors = () => {
      const target = THEMES[colorState.current.targetTheme];
      const current = colorState.current;
      const speed = 0.05;

      ['c1', 'c2'].forEach(key => {
        current[`current${key.charAt(0).toUpperCase() + key.slice(1)}`] = {
          r: lerp(current[`current${key.charAt(0).toUpperCase() + key.slice(1)}`].r, target[key].r, speed),
          g: lerp(current[`current${key.charAt(0).toUpperCase() + key.slice(1)}`].g, target[key].g, speed),
          b: lerp(current[`current${key.charAt(0).toUpperCase() + key.slice(1)}`].b, target[key].b, speed)
        };
      });
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.type = Math.random() > 0.5 ? 'c1' : 'c2';
      }

      update() {
        // Mouse interaction
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * 3;
            const directionY = forceDirectionY * force * 3;
            this.x -= directionX;
            this.y -= directionY;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        const c = this.type === 'c1' ? colorState.current.currentC1 : colorState.current.currentC2;
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            let opacityValue = 1 - (distance / 100);
            const c = colorState.current.currentC1; // Use primary color for connections
            ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacityValue * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 15000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateColors(); // Interpolate colors
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleThemeChange = () => {
      const isDark = !document.documentElement.getAttribute('data-theme');
      colorState.current.targetTheme = isDark ? 'dark' : 'light';
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('theme-change', handleThemeChange);
    
    // Initial check
    handleThemeChange();
    
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('theme-change', handleThemeChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
