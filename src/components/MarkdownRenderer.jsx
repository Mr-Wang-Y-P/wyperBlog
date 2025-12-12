import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';
import { removeFrontmatter } from '../utils/markdown';
// 自定义代码块组件
const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  const language = match ? match[1] : 'text';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group my-8 rounded-xl overflow-hidden border border-[var(--border-color)] bg-[#0D0F17] shadow-2xl">
        {/* 代码块顶部栏 */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1A1C26] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="ml-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--bg-body)]/50 border border-[var(--border-color)]">
              <Terminal size={10} className="text-[var(--primary)]" />
              <span className="text-xs font-mono text-[var(--text-muted)] lowercase">{language}</span>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[var(--bg-body)] transition-colors text-[var(--text-muted)] hover:text-[var(--primary)] group/btn"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[var(--primary)]" />
                <span className="text-xs font-mono text-[var(--primary)]">COPIED</span>
              </>
            ) : (
              <>
                <Copy size={14} className="group-hover/btn:scale-110 transition-transform" />
                <span className="text-xs font-mono group-hover/btn:text-[var(--text-main)]">COPY</span>
              </>
            )}
          </button>
        </div>
        
        {/* 代码内容 */}
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          showLineNumbers={true}
          lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#4b5563', textAlign: 'right' }}
          customStyle={{ 
            margin: 0, 
            padding: '1.5rem', 
            background: 'transparent', 
            fontSize: '0.9rem',
            lineHeight: '1.6',
            fontFamily: "'Fira Code', 'IBM Plex Mono', monospace"
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code 
      className={`${className} font-mono bg-[var(--bg-input)] text-[var(--secondary)] px-1.5 py-0.5 rounded text-sm border border-[var(--border-color)]/50`} 
      {...props}
    >
      {children}
    </code>
  );
};

const MarkdownRenderer = ({ content }) => {
  const cleanContent = removeFrontmatter(content);
  return (
    <div className="prose prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          // 标题样式
          h1: ({node, ...props}) => (
            <h1 className="text-3xl md:text-4xl font-black mt-12 mb-6 text-[var(--text-main)] flex items-center gap-3 pb-4 border-b border-[var(--border-color)]" {...props}>
              <span className="text-[var(--primary)] opacity-50">#</span>
              {props.children}
            </h1>
          ),
          h2: ({node, ...props}) => (
            <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-[var(--text-main)] flex items-center gap-2" {...props}>
              <span className="w-1.5 h-6 bg-[var(--secondary)] rounded-sm"></span>
              {props.children}
            </h2>
          ),
          h3: ({node, ...props}) => (
            <h3 className="text-xl font-bold mt-8 mb-4 text-[var(--text-main)] text-opacity-90" {...props} />
          ),
          // 段落与列表
          p: ({node, ...props}) => (
            <p className="mb-6 leading-relaxed text-[var(--text-muted)] text-base md:text-lg" {...props} />
          ),
          ul: ({node, ...props}) => (
            <ul className="list-none space-y-2 mb-6 text-[var(--text-muted)]" {...props} />
          ),
          ol: ({node, ...props}) => (
            <ol className="list-decimal list-inside space-y-2 mb-6 text-[var(--text-muted)] pl-2" {...props} />
          ),
          li: ({node, ...props}) => (
            <li className="relative pl-6 flex items-start" {...props}>
              {node.tagName === 'li' && !node.ordered && (
                <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
              )}
              <span className="flex-1">{props.children}</span>
            </li>
          ),
          // 引用块
          blockquote: ({node, ...props}) => (
            <blockquote className="relative pl-6 py-2 my-8 border-l-4 border-[var(--primary)] bg-[var(--bg-card)]/30 rounded-r-lg italic text-[var(--text-muted)]" {...props}>
              <div className="absolute -top-3 left-4 text-4xl text-[var(--primary)] opacity-20 font-serif">"</div>
              {props.children}
            </blockquote>
          ),
          // 链接
          a: ({node, ...props}) => (
            <a 
              className="text-[var(--secondary)] hover:text-[var(--primary)] underline decoration-dotted underline-offset-4 transition-colors font-medium" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          // 图片
          img: ({node, ...props}) => (
            <figure className="my-8 group">
              <div className="overflow-hidden rounded-xl border border-[var(--border-color)] shadow-lg bg-[var(--bg-card)]">
                <img 
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" 
                  {...props} 
                />
              </div>
              {props.alt && (
                <figcaption className="text-center text-sm text-[var(--text-muted)] mt-3 font-mono opacity-70">
                  ▲ {props.alt}
                </figcaption>
              )}
            </figure>
          ),
          // 表格
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-8 rounded-lg border border-[var(--border-color)] shadow-md">
              <table className="w-full border-collapse text-left text-sm" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => (
            <thead className="bg-[var(--bg-card)] text-[var(--text-main)]" {...props} />
          ),
          th: ({node, ...props}) => (
            <th className="border-b border-[var(--border-color)] p-4 font-semibold tracking-wider" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="border-b border-[var(--border-color)] p-4 text-[var(--text-muted)] bg-[var(--bg-body)]/50" {...props} />
          ),
          hr: ({node, ...props}) => (
            <hr className="my-12 border-[var(--border-color)] opacity-50" {...props} />
          ),
        }}
      >
        {cleanContent}
      </Markdown>
    </div>
  );
};

export default MarkdownRenderer;
