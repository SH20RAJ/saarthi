"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`markdown-body space-y-2 text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-white mt-3 mb-1 border-b border-[#2f3336] pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-white mt-2.5 mb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-semibold text-white mt-2 mb-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1d9bf0] inline-block shrink-0" />
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-neutral-200 mt-1.5 mb-0.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-1 text-[#e7e9ea] leading-relaxed">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-neutral-300 italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="my-1 space-y-1 pl-4 list-disc marker:text-[#71767b]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1 space-y-1 pl-4 list-decimal marker:text-[#71767b]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[#e7e9ea] pl-1 leading-normal">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#1d9bf0] pl-3 py-1 my-2 bg-[#16181c]/60 text-neutral-300 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 rounded-xl border border-[#2f3336]">
              <table className="min-w-full text-xs text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#16181c] text-white border-b border-[#2f3336]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#2f3336] bg-black">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-neutral-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-[#e7e9ea]">
              {children}
            </td>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1.5 py-0.5 rounded bg-[#16181c] border border-[#2f3336] text-[#1d9bf0] font-mono text-[11px]">
                {children}
              </code>
            ) : (
              <div className="my-2 p-3 rounded-xl bg-[#16181c] border border-[#2f3336] overflow-x-auto">
                <code className="text-[12px] font-mono text-neutral-200">
                  {children}
                </code>
              </div>
            );
          },
          hr: () => <hr className="my-3 border-[#2f3336]" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
