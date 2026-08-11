# CodeForge — Professional React 18 & Web Compiler IDE

**CodeForge** is an ultra-clean, high-performance browser-based **React 18 & Web Compiler IDE** built with React, Monaco Editor, Tailwind CSS, and Babel Standalone.

---

## ⚡ System-Controlled Sandboxed Execution Pipeline

Students and developers write code without installing npm/Vite locally:

```text
Student App.jsx
       ↓
Babel JSX compilation
       ↓
System-controlled index.html (React 18 + ReactDOM 18 + Babel Standalone)
       ↓
Sandboxed iframe
       ↓
Live Preview
```

---

## 📁 Project Structure

- `🔒 index.html`: **Locked, read-only system file** containing React 18, ReactDOM 18, and Babel Standalone scripts + `<div id="root"></div>`.
- `App.jsx`: Student/developer editable React JSX component.
- `styles.css`: Editable CSS stylesheet.

---

## 🎨 Professional Dark IDE Palette

- **Background**: `#0B0D12`
- **Panels**: `#12151E`
- **Active Elements**: `#1A1D27`
- **Borders**: `#2A2D35`
- **Blue**: `#4F8CFF`
- **Green**: `#3FB950`
- **Red**: `#F85149`
- **Yellow**: `#D29922`
- **Purple**: `#A371F7`
- **Typography**: JetBrains Mono / Fira Code.

---

## 🌐 Deploying to GitHub Pages

This project is fully configured for 1-click deployment to **GitHub Pages**.

### Step 1: Initialize Git & Commit
```bash
git init
git add .
git commit -m "Initial commit of CodeForge IDE"
```

### Step 2: Connect Remote GitHub Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to GitHub Pages
Run the automated deployment command:
```bash
npm run deploy
```

Vite will build the production bundle to `dist/`, and `gh-pages` will push it directly to your repository's `gh-pages` branch.

Your live IDE will be published at:
`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite Development Server (http://localhost:3000)
npm run dev
```
