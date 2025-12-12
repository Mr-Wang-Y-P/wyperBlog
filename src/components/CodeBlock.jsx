import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { useTheme } from '../hooks/useTheme';

// Register languages to keep bundle size manageable
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const theme = useTheme();
  const match = /language-(\w+)/.exec(className || '');
  
  // Use CSS variables for background to ensure smooth transition
  // We override the style's background to be transparent so the container's CSS bg shows through
  const style = theme === 'dark' ? oneDark : oneLight;
  const customStyle = {
    backgroundColor: 'transparent', 
    margin: 0,
    padding: '1.5rem',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    fontFamily: "'Fira Code', monospace",
  };

  if (!inline && match) {
    return (
      <div className="relative rounded-lg overflow-hidden my-8 border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-300 group shadow-lg">
        {/* Language Badge */}
        <div className="absolute top-0 right-0 px-3 py-1 text-xs font-mono font-bold text-[var(--primary)] bg-[var(--bg-input)] rounded-bl-lg border-b border-l border-[var(--border-color)] z-10">
          {match[1].toUpperCase()}
        </div>
        
        {/* Mac-style dots */}
        <div className="absolute top-0 left-0 p-3 flex gap-1.5 z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
        </div>

        <div className="pt-6 overflow-x-auto">
          <SyntaxHighlighter
            style={style}
            language={match[1]}
            PreTag="div"
            customStyle={customStyle}
            codeTagProps={{
              style: { fontFamily: 'inherit' }
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  return (
    <code className={`${className} font-mono text-sm bg-[var(--bg-input)] text-[var(--primary)] px-1.5 py-0.5 rounded border border-[var(--border-color)] transition-colors duration-300`} {...props}>
      {children}
    </code>
  );
};

export default CodeBlock;
