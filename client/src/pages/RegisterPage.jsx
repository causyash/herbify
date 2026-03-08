import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthProvider.jsx'

export function RegisterPage() {
  const nav = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(1) // 1: registration, 2: OTP verification

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (step === 1) {
        await api.post('/api/auth/register', { name, email: email.trim().toLowerCase(), password })
        setStep(2)
      } else {
        await api.post('/api/auth/verify-otp', { email: email.trim().toLowerCase(), code: otp.trim() })
        // Use local AuthContext to update the user
        // Wait, I should use the login function if I want to be safe, but verify-otp already sets cookie.
        // Let's just refresh auth after verification.
        window.location.href = '/' // Simple refresh to sync auth
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Action failed')
    } finally {
      setBusy(false)
    }
  }

  async function onResend() {
    setError('')
    setBusy(true)
    try {
      await api.post('/api/auth/resend-otp', { email: email.trim().toLowerCase() })
      alert('OTP resent successfully')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        {step === 1 ? 'Create account' : 'Verify Email'}
      </h1>
      <p className="mt-2 text-slate-600">
        {step === 1 ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-700">
              Login
            </Link>
            .
          </>
        ) : (
          `We've sent an OTP to ${email}.`
        )}
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {step === 1 ? (
          <>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-800">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                placeholder="Your name"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-800">Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-800">Password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>
          </>
        ) : (
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Enter OTP</span>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2 text-center text-lg tracking-widest"
              placeholder="000000"
              required
            />
          </label>
        )}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy ? 'Processing…' : step === 1 ? 'Create account' : 'Verify'}
        </button>

        {step === 2 && (
          <button
            type="button"
            onClick={onResend}
            disabled={busy}
            className="text-center text-sm font-medium text-emerald-700 hover:underline"
          >
            Resend OTP
          </button>
        )}
      </form>
    </div>
  )
}

