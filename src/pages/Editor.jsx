import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Edit3, Loader2 } from 'lucide-react';
import { postService } from '../services/postService';
import ThemeToggle from '../components/ThemeToggle';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { removeFrontmatter } from '../utils/markdown';

const DEFAULT_TEMPLATE = `---
title: "新文章标题"
date: ${new Date().toISOString().split('T')[0]}
tags: ["tech", "new"]
cover: "/assets/cover1.jpg"
---

# 在这里开始你的创作...

支持 **Markdown** 语法预览。

\`\`\`javascript
// 示例代码块
function hello() {
  console.log("Hello World");
}
\`\`\`
`;

const Editor = () => {
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [isPreview, setIsPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // 添加编辑模式状态
  const navigate = useNavigate();

  // Auto save draft locally
  useEffect(() => {
    const saved = localStorage.getItem('wyper_draft');
    if (saved) {
      setContent(saved);
      // 检查是否为编辑模式（通过是否存在slug判断）
      const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
      const match = saved.match(frontmatterRegex);
      if (match) {
        const frontmatterLines = match[1].split('\n');
        let hasSlug = false;
        frontmatterLines.forEach(line => {
          const [key] = line.split(':');
          if (key && key.trim() === 'slug') {
            hasSlug = true;
          }
        });
        setIsEditMode(hasSlug);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('wyper_draft', content);
      setLastSaved(new Date());
    }, 2000);
    return () => clearTimeout(timer);
  }, [content]);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // 提取 frontmatter 中的信息
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    let metadata = {};
    
    if (match) {
      const frontmatterLines = match[1].split('\n');
      frontmatterLines.forEach(line => {
        const [key, ...val] = line.split(':');
        if (key) metadata[key.trim()] = val.join(':').trim().replace(/"/g, '');
      });
    }
    
    // 确定文章 slug
    let slug;
    if (metadata.slug) {
      // 如果有 slug，则使用现有 slug（编辑模式）
      slug = metadata.slug;
    } else {
      // 如果没有 slug，则生成新的（新建模式）
      const title = metadata.title || 'untitled';
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    }

    try {
      const cleanContent = removeFrontmatter(content);
      await postService.savePost({
        slug,
        title: metadata.title || 'untitled',
        date: metadata.date || new Date().toISOString().split('T')[0],
        tags: metadata.tags ? metadata.tags.replace(/[\[\]]/g, '').split(',').map(s=>s.trim()) : [],
        cover: metadata.cover || '/assets/cover1.jpg',
        content: cleanContent
      });

      localStorage.removeItem('wyper_draft');
      navigate(`/post/${slug}`);
    } catch (error) {
      alert('发布失败，请重试');
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-300">
      {/* Toolbar */}
      <div className="h-14 border-b border-[var(--border-color)] flex items-center justify-between px-4 bg-[var(--bg-card)]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-[var(--primary)] font-mono">EDITOR_MODE</span>
          {lastSaved && (
            <span className="text-xs text-[var(--text-muted)] font-mono">
              AUTO_SAVED: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            {isPreview ? <Edit3 size={20} /> : <Eye size={20} />}
          </button>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 px-6 py-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:shadow-[0_0_15px_var(--shadow-color)] rounded-sm text-[var(--bg-body)] text-sm font-bold transition-all disabled:opacity-50"
          >
            {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isPublishing ? 'PUBLISHING...' : (isEditMode ? 'UPDATE' : 'PUBLISH')}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`flex-1 flex flex-col ${isPreview ? 'hidden md:flex' : 'flex'}`}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-[var(--bg-body)] text-[var(--text-main)] p-6 font-mono resize-none focus:outline-none leading-relaxed border-r border-[var(--border-color)] placeholder-[var(--text-muted)]"
            spellCheck="false"
            placeholder="Type your markdown here..."
          />
        </div>

        {/* Preview */}
        <div className={`flex-1 bg-[var(--bg-card)] overflow-y-auto p-6 md:p-12 ${!isPreview ? 'hidden md:block' : 'block'}`}>
          <div className="max-w-2xl mx-auto">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;