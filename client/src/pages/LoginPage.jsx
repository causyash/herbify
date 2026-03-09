import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthProvider.jsx'
import { Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(1) // 1: credentials, 2: OTP verification
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (step === 1) {
        await login({ email: email.trim().toLowerCase(), password })
        nav('/')
      } else {
        const verifyRes = await api.post('/api/auth/verify-otp', { email: email.trim().toLowerCase(), code: otp.trim() })
        if (verifyRes.data.token) {
          localStorage.setItem('herbify_token', verifyRes.data.token)
        }
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 text-center">
        {step === 1 ? 'Login' : 'Verify Email'}
      </h1>
      <p className="mt-2 text-slate-600 text-center">
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
        className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 pr-10 outline-none ring-emerald-500 focus:ring-2"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
    </div>
  )
}

