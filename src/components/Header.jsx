import React from 'react';
import { 
  Play, 
  Send, 
  Clock, 
  CheckCircle2, 
  RotateCw, 
  Hammer, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export function Header({
  assessmentMode,
  setAssessmentMode,
  onRun,
  onSubmit,
  timeLeftSeconds,
  isTimerRunning,
  autosaveStatus,
  isCompiling
}) {
  // Format seconds as MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isTimeLow = timeLeftSeconds < 300; // Under 5 mins

  return (
    <header className="bg-forge-panel border-b border-forge-border text-forge-text px-4 py-2 flex items-center justify-between z-20 select-none">
      {/* Brand & Assessment Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-forge-blue flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Hammer className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-sm tracking-tight text-white">
                CodeForge
              </h1>
              <span className="text-[10px] font-mono font-bold bg-forge-bg border border-forge-border text-forge-blue px-2 py-0.5 rounded-full">
                React Assessment
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-forge-border hidden md:block" />
        <span className="text-xs text-forge-muted hidden md:inline font-medium">
          Task 1: Interactive Counter Component
        </span>
      </div>

      {/* Center: Autosave & Assessment Timer */}
      <div className="flex items-center space-x-4">
        {/* Autosave Status */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-forge-muted">
          {autosaveStatus === 'saving' ? (
            <>
              <RotateCw className="w-3.5 h-3.5 text-forge-yellow animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-forge-green" />
              <span className="text-forge-text">Saved ✓</span>
            </>
          )}
        </div>

        {/* Countdown Timer */}
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-md border font-mono text-xs font-bold transition-all ${
          isTimeLow 
            ? 'bg-forge-red/10 border-forge-red text-forge-red animate-pulse' 
            : 'bg-forge-bg border-forge-border text-forge-text'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(timeLeftSeconds)}</span>
        </div>

        {/* Mode Selector */}
        <div className="relative hidden lg:block">
          <select
            value={assessmentMode}
            onChange={(e) => setAssessmentMode(e.target.value)}
            className="appearance-none bg-forge-bg border border-forge-border text-forge-text text-xs font-mono font-semibold pl-3 pr-7 py-1 rounded-md cursor-pointer focus:outline-none"
          >
            <option value="react">Mode: React (App.jsx)</option>
            <option value="html">Mode: HTML</option>
            <option value="css">Mode: CSS</option>
            <option value="js">Mode: JavaScript</option>
          </select>
          <ChevronDown className="w-3 h-3 text-forge-muted absolute right-2 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Action Buttons: Run & Submit */}
      <div className="flex items-center space-x-2">
        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={isCompiling}
          className="flex items-center space-x-1.5 bg-forge-green hover:bg-forge-greenHover text-white text-xs font-bold px-4 py-1.5 rounded-md shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          title="Compile & Run inside sandbox (Ctrl + Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isCompiling ? 'Running...' : 'Run'}</span>
        </button>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="flex items-center space-x-1.5 bg-forge-blue hover:bg-forge-blueHover text-white text-xs font-bold px-4 py-1.5 rounded-md shadow-md active:scale-95 transition-all cursor-pointer"
          title="Submit Assessment & Calculate Score"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit</span>
        </button>
      </div>
    </header>
  );
}
