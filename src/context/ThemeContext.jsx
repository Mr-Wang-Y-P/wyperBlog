import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wyper_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wyper_theme', theme);
  }, [theme]);

  const toggleTheme = async (event) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // 如果浏览器不支持 View Transitions，直接切换
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // 获取点击位置，如果没有事件对象则默认为屏幕中心
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    // 计算圆形扩散的最大半径
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 开始 View Transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    // 定义动画
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: newTheme === 'dark' ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in',
          // 指定伪元素：变亮时操作新视图，变暗时操作旧视图
          pseudoElement: newTheme === 'dark'
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
