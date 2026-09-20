"use client"

export type NewsletterBookshelfItem = {
  id: string
  title: string
  date: string
  href: string
  color?: string
}

interface NewsletterBookshelfProps {
  items: NewsletterBookshelfItem[]
  brand?: string
  onSelect?: (item: NewsletterBookshelfItem) => void
}

export function NewsletterBookshelf({ items, brand = "Studio Notes", onSelect }: NewsletterBookshelfProps) {
  return (
    <section className="archive">
      <h2 className="archive-title">{brand}</h2>
      <div className="archive-list">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="archive-item"
            style={{ background: item.color || "transparent", color: item.color ? (item.color === "#16277a" ? "#fff" : "#111") : "inherit" }}
            onClick={(e) => {
              e.preventDefault()
              onSelect?.(item)
            }}
          >
            <div className="archive-info">
              <span className="archive-tag">EDITION {item.id.split("-")[1].toUpperCase()}</span>
              <span className="archive-heading">{item.title}</span>
              <span className="archive-date">{item.date}</span>
            </div>
            <span className="archive-arrow">→</span>
          </a>
        ))}
      </div>
    </section>
  )
}
