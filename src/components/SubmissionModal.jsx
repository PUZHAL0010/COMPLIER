import React from 'react';
import { Award, CheckCircle2, X, Send, Clock, ShieldCheck } from 'lucide-react';

export function SubmissionModal({ isOpen, onClose, testResults, isAutoSubmitted }) {
  if (!isOpen || !testResults) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-forge-panel border border-forge-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative font-sans text-forge-text">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-forge-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-forge-green/20 border border-forge-green/30 flex items-center justify-center text-forge-green">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isAutoSubmitted ? 'Assessment Auto-Submitted' : 'Assessment Submitted'}
              </h2>
              <p className="text-xs text-forge-muted">
                {isAutoSubmitted ? 'Timer expired. Submission processed automatically.' : 'Submission verified and stored on CodeForge server.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-forge-muted hover:text-white hover:bg-forge-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Summary Banner */}
        <div className="my-6 p-4 rounded-xl bg-forge-bg border border-forge-border text-center">
          <div className="inline-block p-3 rounded-full bg-forge-green/10 border border-forge-green/30 text-forge-green mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-1">
            {testResults.scoreText}
          </h3>
          <p className="text-xs text-forge-green font-bold uppercase tracking-wider mb-2">
            {testResults.summaryText}
          </p>
          <span className="text-[11px] text-forge-muted font-mono">
            Submission Hash: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </span>
        </div>

        {/* Detailed Test Results List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {testResults.results.map((t) => (
            <div
              key={t.id}
              className="p-2.5 rounded-lg bg-forge-bg border border-forge-border flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forge-green" />
                <span className="font-semibold text-white">{t.name}</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-forge-green/20 text-forge-green px-2 py-0.5 rounded">
                PASS
              </span>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-4 border-t border-forge-border mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-forge-blue hover:bg-forge-blueHover text-white shadow-md transition-all"
          >
            Return to IDE
          </button>
        </div>
      </div>
    </div>
  );
}
