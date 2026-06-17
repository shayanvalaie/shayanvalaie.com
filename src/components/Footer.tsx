import { CONTACT } from '../data/content'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-3 px-6 py-10 sm:flex-row sm:items-center sm:px-10 lg:px-14">
        <p className="font-mono text-sm">
          SV<span className="text-accent">.</span>
        </p>
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Shayan Valaie.
        </p>
        <a
          href={`mailto:${CONTACT.email}`}
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          {CONTACT.email}
        </a>
      </div>
    </footer>
  )
}
