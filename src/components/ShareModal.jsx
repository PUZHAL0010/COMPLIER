import React, { useState } from 'react';
import { X, Share2, Copy, Check, Link2, ExternalLink } from 'lucide-react';
import { encodeCodeToUrl } from '../utils/urlStorage';

export function ShareModal({ isOpen, onClose, html, css, js }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareHash = encodeCodeToUrl(html, css, js);
  const shareUrl = `${window.location.origin}${window.location.pathname}${shareHash}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Share Snippet Link</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6">
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Your entire HTML, CSS, and JavaScript project state is compressed into a shareable URL string. Anyone with this link can view and run your code!
          </p>

          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl p-2">
            <Link2 className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-slate-300 flex-1 focus:outline-none truncate font-mono select-all"
            />
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
