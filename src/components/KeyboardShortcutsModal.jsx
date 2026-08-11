import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

export function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + Enter', desc: 'Compile & Run Code' },
    { key: 'Alt + Shift + F', desc: 'Format Code with Prettier' },
    { key: 'Ctrl + S', desc: 'Save & Format Code' },
    { key: 'Ctrl + /', desc: 'Toggle Line Comment' },
    { key: 'Alt + Up / Down', desc: 'Move Line Up / Down' },
    { key: 'Shift + Alt + Down', desc: 'Duplicate Line' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6 space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[11px]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
