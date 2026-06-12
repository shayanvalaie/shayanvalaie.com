import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import emailjs from '@emailjs/browser'
import { PaperPlaneTilt, CircleNotch, EnvelopeSimple } from '@phosphor-icons/react'
import { CONTACT } from '../data/content'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClasses =
  'w-full rounded-xl border border-edge bg-raised px-4 py-3 text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-accent/70'

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
    <section id="contact" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 lg:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            {CONTACT.headline}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            {CONTACT.body}
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-8 inline-flex items-center gap-3 font-mono text-sm text-accent hover:underline"
          >
            <EnvelopeSimple size={20} />
            {CONTACT.email}
          </a>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 lg:col-span-7"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-ink">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ramin Aghazadeh"
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={inputClasses}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="What would you like to build?"
              className={`${inputClasses} resize-y`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-base transition-colors hover:bg-[#b9a3fb] disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <CircleNotch size={18} weight="bold" className="animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <PaperPlaneTilt size={18} weight="bold" />
                  Send message
                </>
              )}
            </motion.button>

            <div aria-live="polite">
              {status === 'sent' && (
                <p className="text-sm text-accent">
                  Thank you. I will get back to you as soon as possible.
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-400">
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
