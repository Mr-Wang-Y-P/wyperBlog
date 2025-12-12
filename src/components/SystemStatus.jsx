import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Database, Users, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const StatItem = ({ icon: Icon, label, value, suffix = "" }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-[var(--bg-card)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-xl hover:border-[var(--primary)] transition-colors group">
      <div className="mb-4 p-3 bg-[var(--bg-body)] rounded-full border border-[var(--border-color)] group-hover:border-[var(--secondary)] group-hover:scale-110 transition-all shadow-[0_0_15px_var(--shadow-color)]">
        <Icon size={24} className="text-[var(--primary)]" />
      </div>
      <div className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-main)] mb-1 flex items-baseline">
        <span className="stat-value" data-target={value}>0</span>
        <span className="text-lg ml-1 text-[var(--secondary)]">{suffix}</span>
      </div>
      <div className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">{label}</div>
    </div>
  );
};

const SystemStatus = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 数字增长动画
      gsap.utils.toArray('.stat-value').forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        gsap.to(el, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 }, // 保证是整数
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          onUpdate: function() {
            el.innerText = Math.ceil(this.targets()[0].innerText);
          }
        });
      });

      // 容器入场
      gsap.from(containerRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        <StatItem icon={Activity} label="System Uptime" value={99} suffix="%" />
        <StatItem icon={Database} label="Data Nodes" value={128} suffix="+" />
        <StatItem icon={Users} label="Active Users" value={4096} suffix="" />
        <StatItem icon={Cpu} label="Core Load" value={42} suffix="%" />
      </div>
    </div>
  );
};

export default SystemStatus;
