import { useState } from 'react'
import { api } from '../lib/api'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 text-center">
        Contact Us
      </h1>
      <p className="mt-4 text-slate-700 text-center text-lg">
        Send us a message and we’ll get back to you.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setBusy(true)
          setError('')
          setSent(false)
          try {
            await api.post('/api/contact', { name, email, message })
            setSent(true)
            setName('')
            setEmail('')
            setMessage('')
          } catch (err) {
            setError(err?.response?.data?.message || 'Failed to send message')
          } finally {
            setBusy(false)
          }
        }}
        className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-800">Name</span>
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-800">Email</span>
          <input
            type="email"
            className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-800">Message</span>
          <textarea
            rows={5}
            className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            placeholder="How can we help?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        {sent ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Message sent successfully.
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-fit items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {busy ? 'Sending…' : 'Send message'}
        </button>
      </form>
      </div>
    </div>
  )
}

