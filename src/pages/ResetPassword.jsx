import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import api from '../services/api'
import forestBg from '../assets/forest-bg.jpg'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${forestBg})` }}
    >
      <form onSubmit={handleSubmit} className="relative bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-2xl w-80">
        <h1 className="text-xl text-white font-bold mb-4 flex justify-center">Reset Password</h1>

        {success ? (
          <p className="text-green-300 mb-3 text-center">
            Password reset successful. Redirecting to login...
          </p>
        ) : (
          <>
            {error && <p className="text-red-600 mb-3">{error}</p>}

            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b-2 border-white placeholder-white/70 outline-none text-white w-full p-2 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-b-2 border-white placeholder-white/70 outline-none text-white w-full p-2 mb-4"
              required
            />

            <button
              type="submit"
              className="border-2 border-white text-white w-full py-2 rounded cursor-pointer transition-colors hover:bg-white/10"
            >
              Reset Password
            </button>
          </>
        )}

        <p className="text-sm mt-3 text-white text-center">
          <Link to="/login" className="text-orange-600 hover:text-orange-400">Back to Login</Link>
        </p>
      </form>
    </div>
  )
}

export default ResetPassword