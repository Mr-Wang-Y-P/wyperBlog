import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Editor from './pages/Editor';

const App = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] font-sans selection:bg-[var(--primary)] selection:text-[#000000]">
        <ParticleBackground />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
