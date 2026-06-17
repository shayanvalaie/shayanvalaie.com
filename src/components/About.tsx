import { ABOUT, CAPABILITIES } from '../data/content'

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1320px] scroll-mt-20 px-6 py-28 sm:px-10 lg:px-14 lg:py-44"
    >
      <div className="reveal max-w-3xl">
        <h2 className="text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-balance">
          {ABOUT.headline}
        </h2>
        <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-muted text-pretty">
          {ABOUT.body}
        </p>
      </div>

      <ul className="mt-16 grid grid-cols-1 border-t border-line md:grid-cols-2">
        {CAPABILITIES.map((cap) => (
          <li
            key={cap.title}
            className="reveal group border-b border-line py-8 transition-colors duration-300 md:px-8 md:odd:border-r md:first:pl-0 md:[&:nth-child(2)]:pr-0"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
                {cap.title}
              </h3>
              <span
                aria-hidden
                className="mt-1 font-mono text-sm text-line transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
              >
                &gt;
              </span>
            </div>
            <p className="mt-3 max-w-md leading-relaxed text-muted">
              {cap.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
