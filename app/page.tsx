import { NewsletterBookshelf, type NewsletterBookshelfItem } from "@/components/ui/newsletter-bookshelf"

const editions: NewsletterBookshelfItem[] = [
  { id: "edition-04", title: "The useful systems issue", date: "JUL 24, 2026", href: "/posts/useful-systems" },
  { id: "edition-03", title: "A better creative workflow", date: "JUL 17, 2026", href: "/posts/creative-workflow" },
  { id: "edition-02", title: "Notes on building in public", date: "JUL 10, 2026", href: "/posts/building-in-public", color: "#efe8d4" },
  { id: "edition-01", title: "The small team advantage", date: "JUL 3, 2026", href: "/posts/small-team-advantage", color: "#16277a" },
]

export default function Home() {
  return (
    <main className="container">
      <nav>
        <div className="logo">ADITHYAN 7e</div>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#social">Connect</a>
          <a href="#contact">Contact ↗</a>
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
            <h3>forma. </h3>
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
          <span className="tag">Visual design</span>
          <span className="tag">Creative development</span>
          <span className="tag">WebGL / Three.js</span>
          <span className="tag">Interaction design</span>
        </div>
      </section>

      {/* ✅ Removed onSelect prop */}
      <NewsletterBookshelf
        items={editions}
        brand="Studio Notes"
      />

      <section id="social">
        <h2 className="section-title">Let's Connect</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>Find me across the digital universe</p>
        <div className="social-grid">
          <a href="https://github.com/adithyan7e" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/adithyan7e" className="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://twitter.com/adithyan7e" className="social-link" target="_blank" rel="noopener noreferrer">X / Twitter</a>
          <a href="https://instagram.com/7edhee" className="social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://dribbble.com/adithyan7e" className="social-link" target="_blank" rel="noopener noreferrer">Dribbble</a>
          <a href="https://behance.net/adithyan7e" className="social-link" target="_blank" rel="noopener noreferrer">Behance</a>
          <a href="https://youtube.com/@7edhee" className="social-link" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="mailto:7e.adithyan@gmail.com" className="social-link">Email</a>
        </div>
      </section>

      <section className="final-cta" id="contact">
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
