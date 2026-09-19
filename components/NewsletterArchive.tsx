"use client"

type NewsletterItem = {
  id: string
  title: string
  date: string
  href: string
  color?: string
}

const editions: NewsletterItem[] = [
  { id: "edition-04", title: "The useful systems issue", date: "JUL 24, 2026", href: "/posts/useful-systems" },
  { id: "edition-03", title: "A better creative workflow", date: "JUL 17, 2026", href: "/posts/creative-workflow" },
  { id: "edition-02", title: "Notes on building in public", date: "JUL 10, 2026", href: "/posts/building-in-public", color: "#efe8d4" },
  { id: "edition-01", title: "The small team advantage", date: "JUL 3, 2026", href: "/posts/small-team-advantage", color: "#16277a" },
]

export default function NewsletterArchive() {
  return (
    <section id="newsletter" style={{ marginTop: "3rem" }}>
      <h2>Studio Notes Archive</h2>
      <div className="archive-list">
        {editions.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="archive-item"
            style={{
              background: item.color || "transparent",
              color: item.color ? (item.color === "#16277a" ? "#fff" : "#111") : "inherit",
            }}
            onClick={(e) => {
              e.preventDefault()
              console.log("Selected", item.id)
              // Replace with next/navigation `useRouter().push(item.href)` later
            }}
          >
            <div className="archive-info">
              <span className="archive-tag">EDITION {item.id.split("-")[1].toUpperCase()}</span>
              <span className="archive-title">{item.title}</span>
              <span className="archive-date">{item.date}</span>
            </div>
            <span className="archive-arrow">→</span>
          </a>
        ))}
      </div>
    </section>
  )
}
