import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import emailjs from '@emailjs/browser'
import {
  PaperPlaneTilt,
  CircleNotch,
  ArrowUpRight,
} from '@phosphor-icons/react'
import { CONTACT } from '../data/content'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full rounded-[10px] border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted/55 outline-none transition-colors duration-200 focus:border-accent/70'

export default function Contact() {
  const reduceMotion = useReducedMotion()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(
        CONTACT.emailjs.serviceId,
        CONTACT.emailjs.templateId,
        {
          from_name: form.name,
          to_name: 'Shayan',
          from_email: form.email,
          to_email: CONTACT.email,
          message: form.message,
        },
        CONTACT.emailjs.publicKey,
      )
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1320px] scroll-mt-20 px-6 py-28 sm:px-10 lg:px-14 lg:py-44"
    >
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="reveal lg:col-span-5">
          <h2 className="text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold tracking-[-0.025em]">
            Get in touch
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            {CONTACT.body}
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="group mt-8 inline-flex items-center gap-2 font-mono text-sm text-accent"
          >
            <span className="border-b border-transparent transition-colors group-hover:border-accent">
              {CONTACT.email}
            </span>
            <ArrowUpRight
              size={16}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="reveal flex flex-col gap-6 lg:col-span-7"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ramin Aghazadeh"
                className={field}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={field}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="What are you building?"
              className={`${field} resize-y`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-bg transition-colors duration-200 hover:bg-white disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <CircleNotch size={17} weight="bold" className="animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <PaperPlaneTilt size={17} weight="bold" />
                  Send message
                </>
              )}
            </motion.button>

            <div aria-live="polite" className="text-sm">
              {status === 'sent' && (
                <p className="text-accent">
                  Thanks. I&apos;ll get back to you shortly.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-400">
                  Something went wrong. Email me directly instead.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
