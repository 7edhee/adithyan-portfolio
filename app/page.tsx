export default function Home() {
  return (
    <main className="container">
      <nav>
        <div className="logo">ADITHYAN 7e</div>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#social">Connect</a>
          <a href="mailto:7e.adithyan@gmail.com">Contact ↗</a>
        </div>
      </nav>

      <header>
        <h1>Independent creative</h1>
        <div className="subtitle">Portfolio / Design + code + a little strange</div>
        <p>I turn curious ideas into distinct digital experiences. Thoughtfully designed. Carefully built. Impossible to ignore.</p>
        <a href="#work" className="cta">Explore selected work →</a>
      </header>

      <section id="work">
        <h2 className="section-title">Selected experiments</h2>
        <div className="interactive-note">
          Drag or use the arrows • Click a side icon to bring it forward, click the front icon to visit
        </div>
        <div className="grid">
          <article className="card">
            <div className="card-tag">01 / Live • Brand & digital concept</div>
            <h3>forma. ↗</h3>
            <p>Forma — Less, but considered.</p>
            <div className="card-skills">
              <span>Art direction</span><span>Web design</span><span>Development</span>
            </div>
          </article>
          <article className="card">
            <div className="card-tag">02 / Interactive • Interactive concept</div>
            <h3>offscript ↗</h3>
            <p>Offscript — Break the pattern.</p>
            <div className="card-skills">
              <span>Creative direction</span><span>Interaction</span><span>3D</span>
            </div>
          </article>
        </div>
      </section>

      <section id="about">
        <h2>The person behind the pixels</h2>
        <p className="lead">A designer's eye. A developer's mind.</p>
        <p>I'm Adithyan, an independent designer and creative developer working at the intersection of clarity and experimentation. I care about the small details that make a website feel like something, not just look like something.</p>
        <div className="tags">
          {["Visual design", "Creative development", "WebGL / Three.js", "Interaction design"].map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </section>

      {/* Newsletter Archive */}
      <section className="archive">
        <h2 className="section-title">Studio Notes Archive</h2>
        <div className="archive-list">
          {[
            { id: "04", title: "The useful systems issue", date: "JUL 24, 2026", href: "/posts/useful-systems" },
            { id: "03", title: "A better creative workflow", date: "JUL 17, 2026", href: "/posts/creative-workflow" },
            { id: "02", title: "Notes on building in public", date: "JUL 10, 2026", href: "/posts/building-in-public", color: "#efe8d4", text: "#111" },
            { id: "01", title: "The small team advantage", date: "JUL 3, 2026", href: "/posts/small-team-advantage", color: "#16277a", text: "#fff" },
          ].map((item) => (
            <a key={item.id} href={item.href} className="archive-item" style={{ background: item.color || "transparent", color: item.text || "inherit" }}>
              <div className="archive-info">
                <span className="archive-tag">EDITION {item.id}</span>
                <span className="archive-title">{item.title}</span>
                <span className="archive-date">{item.date}</span>
              </div>
              <span className="archive-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      <section id="social">
        <h2 className="section-title">Let's Connect</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>Find me across the digital universe</p>
        <div className="social-grid">
          {[
            ["GitHub", "https://github.com/adithyan7e"],
            ["LinkedIn", "https://linkedin.com/in/adithyan7e"],
            ["X / Twitter", "https://twitter.com/adithyan7e"],
            ["Instagram", "https://instagram.com/7edhee"],
            ["Dribbble", "https://dribbble.com/adithyan7e"],
            ["Behance", "https://behance.net/adithyan7e"],
            ["YouTube", "https://youtube.com/@7edhee"],
            ["Email", "mailto:7e.adithyan@gmail.com"]
          ].map(([name, url]) => (
            <a key={name} href={url} className="social-link" target="_blank" rel="noopener noreferrer">{name}</a>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Have something in mind?</h2>
        <p>Let's make it real.</p>
        <a href="mailto:7e.adithyan@gmail.com" className="cta">Get in touch ↗</a>
      </section>

      <footer>
        © 2026 ADITHYAN — Designed with intent. Built with curiosity.
      </footer>
    </main>
  )
}
