import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthProvider.jsx'

export function LoginPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(1) // 1: credentials, 2: OTP verification

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (step === 1) {
        await login({ email: email.trim().toLowerCase(), password })
        nav('/')
      } else {
        await api.post('/api/auth/verify-otp', { email: email.trim().toLowerCase(), code: otp.trim() })
        window.location.href = '/' // Simple refresh to sync auth
      }
    } catch (err) {
      if (err?.response?.data?.requiresVerification) {
        setStep(2)
        setError('') // Clear previous error like "Invalid credentials"
      } else {
        setError(err?.response?.data?.message || 'Login failed')
      }
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
        {step === 1 ? 'Login' : 'Verify Email'}
      </h1>
      <p className="mt-2 text-slate-600">
        {step === 1 ? (
          <>
            New here?{' '}
            <Link to="/register" className="font-semibold text-emerald-700">
              Create an account
            </Link>
            .
          </>
        ) : (
          `Please enter the OTP sent to ${email}.`
        )}
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {step === 1 ? (
          <>
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                placeholder="••••••••"
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
          {busy ? 'Processing…' : step === 1 ? 'Login' : 'Verify'}
        </button>

        {step === 2 && (
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={onResend}
              disabled={busy}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={busy}
              className="text-sm font-medium text-slate-500 hover:underline"
            >
              Change Email
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

