import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory snippet store
const snippetStore = new Map();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), server: 'COMPILE Backend v2.0' });
});

// Save Snippet Endpoint
app.post('/api/snippets', (req, res) => {
  try {
    const { html, css, js, language, title } = req.body;
    const id = Math.random().toString(36).substring(2, 9);
    const snippet = {
      id,
      title: title || 'Untitled Project',
      language: language || 'html',
      html: html || '',
      css: css || '',
      js: js || '',
      createdAt: new Date().toISOString(),
    };
    snippetStore.set(id, snippet);
    res.status(201).json({ success: true, id, snippet });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save snippet.' });
  }
});

// Get Snippet Endpoint
app.get('/api/snippets/:id', (req, res) => {
  const { id } = req.params;
  if (snippetStore.has(id)) {
    return res.json({ success: true, snippet: snippetStore.get(id) });
  }
  res.status(404).json({ error: 'Snippet not found.' });
});

// Node.js Backend Code Execution Endpoint
app.post('/api/execute', (req, res) => {
  const { code, language = 'nodejs' } = req.body;

  if (!code || !code.trim()) {
    return res.json({ success: true, stdout: '', stderr: '', executionTime: 0 });
  }

  // Create temporary file to execute
  const tmpDir = os.tmpdir();
  const tmpFilePath = path.join(tmpDir, `compile_exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.js`);

  fs.writeFile(tmpFilePath, code, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create execution file.' });
    }

    const startTime = Date.now();
    // Execute Node.js script with 5s timeout limit
    exec(`node "${tmpFilePath}"`, { timeout: 5000, maxBuffer: 1024 * 1024 }, (execErr, stdout, stderr) => {
      const executionTime = Date.now() - startTime;

      // Clean up temp file
      fs.unlink(tmpFilePath, () => {});

      if (execErr && execErr.killed) {
        return res.json({
          success: false,
          stdout: stdout || '',
          stderr: 'Execution Error: Timed out after 5000ms',
          executionTime,
        });
      }

      res.json({
        success: !execErr,
        stdout: stdout || '',
        stderr: stderr || (execErr ? execErr.message : ''),
        executionTime,
      });
    });
  });
});

// Serve static assets in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`⚡ COMPILE Backend Server running on http://localhost:${PORT}`);
});
