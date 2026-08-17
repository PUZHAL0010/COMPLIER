import React, { useState } from 'react';
import { Send, Server, Clock, Copy, Check } from 'lucide-react';

export function ApiTesterPanel({ onSendRequest, isExecuting }) {
  const [method, setMethod] = useState('GET');
  const [urlPath, setUrlPath] = useState('/students/1');
  const [activeTab, setActiveTab] = useState('body');
  const [jsonBody, setJsonBody] = useState('{\n  "name": "Pugal",\n  "department": "AI & DS",\n  "cgpa": 8.5\n}');
  const [customHeaders, setCustomHeaders] = useState('{\n  "Accept": "application/json"\n}');

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sanitize URL input: Ensure only relative path like /students/1
  const sanitizePath = (input) => {
    let clean = input.trim().replace(/^https?:\/\/[^\/]+/, '');
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }
    return clean;
  };

  const getMethodColor = (m) => {
    switch (m) {
      case 'GET': return 'bg-forge-blue/20 text-forge-blue border-forge-blue/40';
      case 'POST': return 'bg-forge-green/20 text-forge-green border-forge-green/40';
      case 'PUT': return 'bg-forge-yellow/20 text-forge-yellow border-forge-yellow/40';
      case 'PATCH': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'DELETE': return 'bg-forge-red/20 text-forge-red border-forge-red/40';
      default: return 'bg-forge-active text-white border-forge-border';
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-forge-green bg-forge-green/10 border-forge-green/30';
    if (status >= 400 && status < 500) return 'text-forge-yellow bg-forge-yellow/10 border-forge-yellow/30';
    return 'text-forge-red bg-forge-red/10 border-forge-red/30';
  };

  const handleSend = async (overrideMethod, overridePath) => {
    setIsLoading(true);
    setResponse(null);

    const targetMethod = overrideMethod || method;
    const rawPath = overridePath || urlPath;
    const cleanPath = sanitizePath(rawPath);

    setUrlPath(cleanPath);

    let parsedBody = null;
    let parsedHeaders = {};

    if (targetMethod !== 'GET') {
      try {
        parsedBody = JSON.parse(jsonBody);
      } catch (e) {
        parsedBody = jsonBody;
      }
    }

    try {
      parsedHeaders = JSON.parse(customHeaders);
    } catch (e) {}

    const result = await onSendRequest({
      method: targetMethod,
      path: cleanPath,
      headers: parsedHeaders,
      body: parsedBody,
    });

    setResponse(result);
    setIsLoading(false);
  };

  const handlePresetSelect = (m, p) => {
    setMethod(m);
    setUrlPath(p);
    handleSend(m, p);
  };

  const handleCopyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-forge-panel border-l border-forge-border font-mono text-xs overflow-hidden select-none">
      {/* Header Bar */}
      <div className="px-3 py-2 bg-forge-bg border-b border-forge-border flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4 text-forge-blue" />
          <span className="font-bold text-white">API TESTER (Express Endpoint)</span>
        </div>
      </div>

      {/* Preset Quick Test Buttons */}
      <div className="px-3 py-1.5 bg-forge-bg/80 border-b border-forge-border flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <span className="text-forge-muted font-semibold mr-1">Presets:</span>
        <button
          onClick={() => handlePresetSelect('GET', '/students')}
          className="px-2 py-0.5 rounded bg-forge-blue/10 border border-forge-blue/30 text-forge-blue hover:bg-forge-blue/20 transition-all shrink-0"
        >
          GET /students
        </button>
        <button
          onClick={() => handlePresetSelect('GET', '/students/1')}
          className="px-2 py-0.5 rounded bg-forge-blue/10 border border-forge-blue/30 text-forge-blue hover:bg-forge-blue/20 transition-all shrink-0 font-bold"
        >
          GET /students/1
        </button>
        <button
          onClick={() => handlePresetSelect('GET', '/students/999')}
          className="px-2 py-0.5 rounded bg-forge-yellow/10 border border-forge-yellow/30 text-forge-yellow hover:bg-forge-yellow/20 transition-all shrink-0"
        >
          GET /students/999 (404)
        </button>
        <button
          onClick={() => handlePresetSelect('POST', '/students')}
          className="px-2 py-0.5 rounded bg-forge-green/10 border border-forge-green/30 text-forge-green hover:bg-forge-green/20 transition-all shrink-0"
        >
          POST /students
        </button>
        <button
          onClick={() => handlePresetSelect('DELETE', '/students/1')}
          className="px-2 py-0.5 rounded bg-forge-red/10 border border-forge-red/30 text-forge-red hover:bg-forge-red/20 transition-all shrink-0"
        >
          DELETE /students/1
        </button>
      </div>

      {/* URL Request Controls Bar */}
      <div className="p-3 bg-forge-bg/50 border-b border-forge-border space-y-2">
        <div className="flex items-center space-x-2">
          {/* Method Select */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`px-2 py-1.5 rounded font-bold border text-xs focus:outline-none ${getMethodColor(method)}`}
          >
            <option value="GET" className="bg-forge-panel text-forge-blue">GET</option>
            <option value="POST" className="bg-forge-panel text-forge-green">POST</option>
            <option value="PUT" className="bg-forge-panel text-forge-yellow">PUT</option>
            <option value="PATCH" className="bg-forge-panel text-purple-400">PATCH</option>
            <option value="DELETE" className="bg-forge-panel text-forge-red">DELETE</option>
          </select>

          {/* Path Input */}
          <input
            type="text"
            value={urlPath}
            onChange={(e) => setUrlPath(e.target.value)}
            onBlur={() => setUrlPath(sanitizePath(urlPath))}
            placeholder="/students/1"
            className="flex-1 bg-forge-bg border border-forge-border rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-forge-blue"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={isLoading || isExecuting}
            className="px-4 py-1.5 rounded font-bold text-white bg-forge-blue hover:bg-blue-600 transition-colors flex items-center space-x-1.5 shrink-0 disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Sending...' : 'SEND'}</span>
          </button>
        </div>

        {/* Request Options Tabs */}
        {method !== 'GET' && (
          <div className="flex items-center space-x-2 pt-1 border-t border-forge-border/40">
            <button
              onClick={() => setActiveTab('body')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeTab === 'body' ? 'bg-forge-active text-white' : 'text-forge-muted hover:text-white'
              }`}
            >
              JSON Body
            </button>
            <button
              onClick={() => setActiveTab('headers')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeTab === 'headers' ? 'bg-forge-active text-white' : 'text-forge-muted hover:text-white'
              }`}
            >
              Headers
            </button>
          </div>
        )}
      </div>

      {/* Request Options Body Textarea */}
      {method !== 'GET' && activeTab === 'body' && (
        <div className="p-2 border-b border-forge-border bg-forge-bg/30">
          <textarea
            value={jsonBody}
            onChange={(e) => setJsonBody(e.target.value)}
            rows={3}
            className="w-full bg-forge-editor border border-forge-border rounded p-2 text-white font-mono text-[11px] focus:outline-none focus:border-forge-blue resize-none"
            placeholder='{"name": "Pugal", "department": "AI & DS"}'
          />
        </div>
      )}

      {/* Response Panel */}
      <div className="flex-1 flex flex-col min-h-0 bg-forge-editor">
        {/* Response Metadata Bar */}
        <div className="px-3 py-1.5 bg-forge-bg border-b border-forge-border flex items-center justify-between">
          <span className="text-[11px] font-semibold text-forge-muted">Response</span>

          {response && (
            <div className="flex items-center space-x-3 text-[11px]">
              {/* Status Code */}
              <div className={`px-2 py-0.5 rounded font-bold border flex items-center space-x-1 ${getStatusColor(response.status)}`}>
                <span>{response.status}</span>
                <span>{response.statusText}</span>
              </div>

              {/* Response Time */}
              <div className="flex items-center space-x-1 text-forge-muted">
                <Clock className="w-3 h-3" />
                <span>{response.responseTime}ms</span>
              </div>

              {/* Copy Response */}
              <button
                onClick={handleCopyResponse}
                className="p-1 text-forge-muted hover:text-white transition-colors"
                title="Copy Response Body"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-forge-green" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Response Content Viewer */}
        <div className="flex-1 p-3 overflow-y-auto font-mono text-xs select-text">
          {!response && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-forge-muted text-[11px] text-center p-4">
              <Server className="w-8 h-8 mb-2 opacity-40 text-forge-blue" />
              <p className="font-semibold text-white mb-1">Click [ SEND ] or choose a Preset above</p>
              <p className="text-[10px] text-forge-muted">Executes real Express router logic for GET, POST, PUT, DELETE</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex items-center justify-center text-forge-muted text-[11px]">
              Dispatching request to Express router...
            </div>
          )}

          {response && (
            <pre className="text-forge-text font-mono text-[11px] whitespace-pre-wrap break-all">
              {JSON.stringify(response.body, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
