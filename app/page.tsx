import NewsletterArchive from "@/components/NewsletterArchive"

export default function Home() {
  return (
    <main className="container">
      <nav>
        <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>ADITHYAN 7e</div>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#social">Connect</a>
          <a href="mailto:7e.adithyan@gmail.com">Contact ↗</a>
        </div>
      </nav>

      <header>
        <h1>Independent creative</h1>
        <p>Portfolio / Design + code + a little strange</p>
        <p style={{ marginBottom: "2rem" }}>I turn curious ideas into distinct digital experiences. Thoughtfully designed. Carefully built. Impossible to ignore.</p>
        <a href="#work" className="cta-btn">Explore selected work →</a>
      </header>

      <section id="work">
        <h2>Selected experiments ↘</h2>
        <div className="grid">
          <article className="card">
            <span className="tag">01 / Live • Brand & digital concept</span>
            <h3>forma. ↗</h3>
            <p>Forma — Less, but considered.</p>
            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Art direction • Web design • Development</p>
          </article>
          <article className="card">
            <span className="tag">02 / Interactive • Interactive concept</span>
            <h3>offscript ↗</h3>
            <p>Offscript — Break the pattern.</p>
            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Creative direction • Interaction • 3D</p>
          </article>
        </div>
      </section>

      <NewsletterArchive />

      <section id="about" style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem", marginTop: "3rem" }}>
        <h2>The person behind the pixels</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>A designer's eye. A developer's mind.</p>
        <p>I'm Adithyan, an independent designer and creative developer working at the intersection of clarity and experimentation. I care about the small details that make a website feel like something, not just look like something.</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          {["Visual design", "Creative development", "WebGL / Three.js", "Interaction design"].map((skill) => (
            <span key={skill} style={{ padding: "0.4rem 0.8rem", border: "1px solid var(--border)", borderRadius: "20px", fontSize: "0.85rem" }}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="social" style={{ marginTop: "3rem" }}>
        <h2>Let's Connect</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Find me across the digital universe</p>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
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
            <a key={name} href={url} className="cta-btn" style={{ textAlign: "center" }}>{name}</a>
          ))}
        </div>
      </section>

      <section style={{ textAlign: "center", padding: "4rem 0" }}>
        <h2>Have something in mind?</h2>
        <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 1.5rem" }}>Let's make it real.</p>
        <a href="mailto:7e.adithyan@gmail.com" className="cta-btn">Get in touch ↗</a>
      </section>

      <footer>
        © 2026 ADITHYAN — Designed with intent. Built with curiosity.
      </footer>
    </main>
  )
}
