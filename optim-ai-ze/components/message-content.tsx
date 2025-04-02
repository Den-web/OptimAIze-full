"use client"

import { useMemo } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MessageContentProps {
  content: string
  isAssistant: boolean
}

export function MessageContent({ content, isAssistant }: MessageContentProps) {
  // Process content to handle raw SSE data format, JSON objects, etc.
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    // Handle case where content might be a raw SSE data format
    if (content.includes('data:')) {
      try {
        // Try to extract actual content from raw SSE format
        const matches = content.match(/data: (\{.*\})/g);
        if (matches && matches.length) {
          const lastMatch = matches[matches.length - 1].replace('data: ', '');
          const parsed = JSON.parse(lastMatch);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
            return parsed.choices[0].delta.content || '';
          }
        }
      } catch (e) {
        // If parsing fails, just use the content as is
        console.log('Error parsing SSE content:', e);
      }
    }
    
    // Check if content is JSON for API responses
    try {
      const parsed = JSON.parse(content);
      // If it parsed successfully, it's JSON, so stringify it with formatting
      return '```json\n' + JSON.stringify(parsed, null, 2) + '\n```';
    } catch (e) {
      // Not JSON, just use as is
    }
    
    return content;
  }, [content]);

  if (!isAssistant) {
    // For user messages, just display as plain text with newlines preserved
    return <div className="whitespace-pre-wrap text-sm">{content}</div>;
  }

  // For AI messages, use Markdown with syntax highlighting
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Add responsive table styling
        table({ node, ...props }) {
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border" {...props} />
            </div>
          );
        },
        // Style table headers
        th({ node, ...props }) {
          return (
            <th
              className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              {...props}
            />
          );
        },
        // Style table cells
        td({ node, ...props }) {
          return <td className="px-3 py-2 text-sm" {...props} />;
        },
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}

