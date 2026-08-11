/**
 * Built-in Code Templates for CodeCraft Studio / OneCompiler
 */

export const TEMPLATES = {
  reactCounter: {
    id: 'reactCounter',
    name: 'React 18 Component & Hooks',
    description: 'Interactive React Counter application using React.useState, JSX syntax, and modern CSS styling.',
    badge: 'React & JSX',
    html: `<div id="root"></div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}

.react-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 24px;
  padding: 36px 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  width: 340px;
}

.react-card h1 {
  font-size: 1.8rem;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #61dafb, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.count-badge {
  font-size: 3rem;
  font-weight: 800;
  color: #38bdf8;
  margin: 16px 0;
}

.btn-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-react {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-react:hover {
  background: #0369a1;
  transform: translateY(-2px);
}`,
    js: `function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="react-card">
      <h1>⚛️ React 18 Counter</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
        Built with React Hooks & JSX
      </p>

      <div className="count-badge">{count}</div>

      <div className="btn-group">
        <button className="btn-react" onClick={() => setCount(count - 1)}>-</button>
        <button className="btn-react" onClick={() => setCount(0)}>Reset</button>
        <button className="btn-react" onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);
console.log("⚛️ React 18 Component mounted successfully!");`
  },

  particles: {
    id: 'particles',
    name: 'Canvas Particle Network',
    description: 'Interactive particle animation on HTML5 Canvas with mouse physics and glowing connections.',
    badge: 'Canvas & Math',
    html: `<div class="canvas-container">
  <canvas id="particleCanvas"></canvas>
  <div class="overlay-card">
    <h2>Particle Universe</h2>
    <p>Move your mouse around to interact with the particles!</p>
    <button id="pulseBtn">Trigger Energy Pulse</button>
  </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

body {
  margin: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  background: #090d16;
  color: #fff;
}

.canvas-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#particleCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.overlay-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 32px 48px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.overlay-card h2 {
  margin: 0 0 12px;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7, #6366f1, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.overlay-card p {
  color: #94a3b8;
  margin: 0 0 24px;
  font-size: 0.95rem;
}

#pulseBtn {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

#pulseBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(168, 85, 247, 0.6);
}`,
    js: `const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 70;
let mouse = { x: width / 2, y: height / 2, radius: 150 };

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = Math.random() * 2 + 1;
    this.color = ['#6366f1', '#a855f7', '#06b6d4'][Math.floor(Math.random() * 3)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius) {
      const angle = Math.atan2(dy, dx);
      const force = (mouse.radius - dist) / mouse.radius;
      this.x -= Math.cos(angle) * force * 3;
      this.y -= Math.sin(angle) * force * 3;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = \`rgba(99, 102, 241, \${1 - dist / 120})\`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();
console.log("🌌 Particle network initialized!");`
  },

  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism Cyber Card',
    description: 'Sleek dark mode glass card with ambient glow, glowing toggle controls, and interactive state.',
    badge: 'UI & Styling',
    html: `<div class="container">
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  
  <div class="glass-card">
    <div class="badge">PRO EDITION</div>
    <h1>OneCompiler Web IDE</h1>
    <p>Next-generation client-side code editor & live preview compiler.</p>
    
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-num" id="speedStat">0 ms</span>
        <span class="stat-label">Latency</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">100%</span>
        <span class="stat-label">Client-Side</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">Monaco</span>
        <span class="stat-label">Engine</span>
      </div>
    </div>
    
    <div class="action-row">
      <button class="btn primary" id="btnTest">Run Test Logs</button>
    </div>
  </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #030712;
  color: #f3f4f6;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container { position: relative; width: 100%; max-width: 480px; padding: 20px; }
.glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); z-index: 0; }
.orb-1 { width: 250px; height: 250px; background: #6366f1; top: -40px; left: -40px; opacity: 0.5; }
.orb-2 { width: 220px; height: 220px; background: #ec4899; bottom: -30px; right: -30px; opacity: 0.4; }
.glass-card {
  position: relative; z-index: 1;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px; padding: 40px 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  text-align: center;
}
.badge {
  display: inline-block; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.1em; color: #818cf8; background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3); padding: 4px 12px;
  border-radius: 9999px; margin-bottom: 16px;
}
h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 8px; color: #fff; }
p { color: #9ca3af; font-size: 0.95rem; margin-bottom: 28px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
.stat-item { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 14px 8px; border-radius: 16px; }
.stat-num { display: block; font-size: 1.1rem; font-weight: 700; color: #38bdf8; }
.stat-label { font-size: 0.75rem; color: #6b7280; }
.btn { width: 100%; padding: 14px; border-radius: 14px; font-weight: 600; font-size: 0.9rem; border: none; cursor: pointer; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; }`,
    js: `console.log("✨ Glassmorphism UI Loaded successfully!");
document.getElementById('btnTest')?.addEventListener('click', () => {
  console.log("🚀 Benchmark executed!");
});`
  },

  blank: {
    id: 'blank',
    name: 'Blank Workspace',
    description: 'Empty workspace to write custom HTML, CSS, and JS from scratch.',
    badge: 'Empty',
    html: `<div id="root">\n  <h1>Hello OneCompiler!</h1>\n</div>`,
    css: `body {\n  font-family: sans-serif;\n  padding: 20px;\n}`,
    js: `console.log("Hello from OneCompiler!");`
  }
};
