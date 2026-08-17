import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const snippetStore = new Map();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), server: 'CodeForge Backend v2.5' });
});

// Save Snippet Endpoint
app.post('/api/snippets', (req, res) => {
  try {
    const { html, css, js, language, title } = req.body;
    const id = Math.random().toString(36).substring(2, 9);
    const snippet = {
      id,
      title: title || 'Untitled Project',
      language: language || 'react',
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

// Serve static assets in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`⚡ CodeForge Backend Server running on http://localhost:${PORT}`);
});
