:root {
  --bg: #050505;
  --text: #f0f0f0;
  --text-muted: rgba(240, 240, 240, 0.5);
  --border: rgba(255, 255, 255, 0.12);
  --hover: rgba(255, 255, 255, 0.9);
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; transition: opacity 0.2s; }
a:hover { opacity: 0.7; }

.container { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; }

nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem 0; border-bottom: 1px solid var(--border); margin-bottom: 3rem;
}
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { font-size: 0.9rem; letter-spacing: 0.02em; }

header { text-align: center; padding: 4rem 0 3rem; }
header h1 { font-size: 2.5rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
header p { color: var(--text-muted); max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem; }
.cta-btn {
  display: inline-block; padding: 0.75rem 1.5rem; border: 1px solid var(--border);
  border-radius: 8px; font-weight: 500; transition: all 0.2s;
}
.cta-btn:hover { background: var(--text); color: var(--bg); border-color: var(--text); }

.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
.card {
  border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem;
  background: rgba(255,255,255,0.02); transition: all 0.3s ease;
}
.card:hover { transform: translateY(-4px); border-color: var(--hover); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.card h3 { font-size: 1.2rem; margin: 0.5rem 0; }
.card p { color: var(--text-muted); font-size: 0.9rem; }
.card .tag { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }

section { margin: 3rem 0; }
section h2 { font-size: 1.5rem; margin-bottom: 1.5rem; }

footer {
  text-align: center; padding: 3rem 0; border-top: 1px solid var(--border); margin-top: 4rem;
  color: var(--text-muted); font-size: 0.9rem;
}

/* Newsletter Archive Styles */
.archive-list { display: flex; flex-direction: column; gap: 0.75rem; }
.archive-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.25rem; border-radius: 10px; border: 1px solid var(--border);
  transition: all 0.2s ease; background: var(--bg, transparent);
  color: var(--text, inherit);
}
.archive-item:hover { border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }
.archive-info { display: flex; flex-direction: column; gap: 0.15rem; }
.archive-tag { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.6; }
.archive-title { font-weight: 600; font-size: 0.95rem; }
.archive-date { font-size: 0.75rem; opacity: 0.5; }
.archive-arrow { opacity: 0; transition: all 0.2s ease; transform: translateX(-4px); }
.archive-item:hover .archive-arrow { opacity: 1; transform: translateX(0); }
