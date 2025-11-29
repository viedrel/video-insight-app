import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisType } from '../types';
import { Sparkles, Copy, Check } from 'lucide-react';

interface ResultDisplayProps {
  markdown: string;
  type: AnalysisType;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ markdown, type }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-400" size={20} />
          <h2 className="text-xl font-semibold text-white">Analysis Result</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy Text"}
        </button>
      </div>

      <div className="prose prose-invert prose-slate max-w-none bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-blue-400 mb-4 pb-2 border-b border-slate-700" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium text-slate-300 mt-4 mb-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 space-y-2 text-slate-300" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 space-y-2 text-slate-300" {...props} />,
            li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
            p: ({node, ...props}) => <p className="text-slate-300 leading-7 mb-4" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-4" {...props} />,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
