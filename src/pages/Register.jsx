import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext.jsx'
import forestBg from '../assets/forest-bg.jpg'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuthData } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { token, user } = res.data
      setAuthData(token, user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center flex-col min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${forestBg})` }}
    >

      <div>
        <h1 className='text-white text-3xl mb-4'><span className='text-orange-600 font-bold'>Elore</span>Tasks</h1>
      </div>

      <form onSubmit={handleSubmit} className="relative bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-2xl w-80">
        <h1 className="text-xl text-white font-bold mb-4 flex justify-center">Register</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="border-b-2 w-full border-white text-white p-2 mb-4 outline-none disabled:opacity-50"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="border-b-2 w-full border-white text-white p-2 mb-4 outline-none disabled:opacity-50"
          required
        />
        <div className="relative mb-3">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    autoComplete="new password"
    disabled={loading}
    className="border-b-2 border-white placeholder-white/70 text-white w-full p-2 pr-10 outline-none disabled:opacity-50"
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
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-pasword"
          disabled={loading}
          className="border-b-2 w-full border-white text-white p-2 mb-4 outline-none disabled:opacity-50"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="border-2 border-white text-white w-full py-2 rounded cursor-pointer transition-colors hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>

        <p className="text-sm text-white mt-3 text-center">
          Already have an account? <Link to="/login" className="text-orange-600 hover:text-orange-400">Log In</Link>
        </p>
      </form>
    </div>
  )
}

export default Register