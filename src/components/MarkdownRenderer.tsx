import React, { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Simple, robust markdown chunk parser for retro 90s display
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let blockIdx = 0;

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBuffer.join('\n');
        const currentIdx = blockIdx++;
        elements.push(
          <div key={`code-${index}`} className="my-2.5 rounded retro-inset border border-gray-600 bg-gray-950 text-emerald-400 font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between px-2.5 py-1 bg-gray-900 border-b border-gray-700 text-[10px] text-gray-400 font-pixel">
              <span>{codeLang || 'CODE'}</span>
              <button
                onClick={() => handleCopy(codeText, currentIdx)}
                className="hover:text-white px-1.5 py-0.5 rounded bg-gray-800 text-[10px]"
              >
                {copiedIdx === currentIdx ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-2.5 overflow-x-auto whitespace-pre leading-relaxed font-mono">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeLang = line.trim().replace('```', '');
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${index}`} className="font-bold text-sm text-blue-900 mt-2 mb-1 flex items-center space-x-1">
          <span>{line.replace('### ', '')}</span>
        </h4>
      );
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${index}`} className="font-bold text-base text-blue-950 mt-2.5 mb-1">
          {line.replace('## ', '')}
        </h3>
      );
      return;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${index}`} className="font-bold text-lg text-blue-950 mt-3 mb-1.5 border-b border-gray-300 pb-0.5">
          {line.replace('# ', '')}
        </h2>
      );
      return;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`quote-${index}`} className="border-l-4 border-amber-500 pl-2.5 py-0.5 my-1.5 bg-amber-50/80 text-amber-950 italic text-xs rounded-r">
          {line.replace('> ', '')}
        </blockquote>
      );
      return;
    }

    // Unordered lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <li key={`li-${index}`} className="ml-4 list-disc text-xs text-gray-800 my-0.5 leading-relaxed">
          {line.trim().replace(/^[-*]\s+/, '')}
        </li>
      );
      return;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line.trim())) {
      elements.push(
        <li key={`oli-${index}`} className="ml-4 list-decimal text-xs text-gray-800 my-0.5 leading-relaxed">
          {line.trim().replace(/^\d+\.\s+/, '')}
        </li>
      );
      return;
    }

    // Regular paragraphs (skipping empty lines or rendering spacer)
    if (line.trim() === '') {
      elements.push(<div key={`sp-${index}`} className="h-1.5" />);
      return;
    }

    elements.push(
      <p key={`p-${index}`} className="text-xs text-gray-800 leading-relaxed my-1">
        {line}
      </p>
    );
  });

  return <div className={`markdown-content select-text ${className}`}>{elements}</div>;
};

export default MarkdownRenderer;
