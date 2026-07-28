import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import forestBg from '../assets/forest-bg.jpg'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown === 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cooldown > 0) return

    setError('')

    // Update the UI immediately, before the request resolves
    setCooldown(60)
    setSent(true)

    try {
      await api.post('/auth/forgot-password', { email })
    } catch (err) {
      // Only roll back if it actually failed
      setCooldown(0)
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${forestBg})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <form onSubmit={handleSubmit} className="relative bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-2xl w-80">
        <h1 className="text-xl font-bold mb-4 text-white">How could you forget your password so soon T-T</h1>

        {sent ? (
          <p className="text-white/80 mb-4">
            A link has been sent to your email. Kindly check your inbox.
          </p>
        ) : (
          <p className="text-white/70 mb-4 text-sm">
            Enter your email and we'll send you a link to reset your password.
          </p>
        )}

        {error && <p className="text-red-300 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b-2 norder-white text-white w-full p-2 mb-3  outline-none"
          required
        />

        <button
          type="submit"
          disabled={cooldown > 0}
          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white w-full py-2 rounded transition-colors cursor-pointer"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : sent ? 'Resend Link' : 'Send Reset Link'}
        </button>

        <p className="text-sm mt-3 text-center text-white/80">
          <Link to="/login" className="text-orange-600 hover:text-orange-400">Back to Login</Link>
        </p>
      </form>
    </div>
  )
}

export default ForgotPassword