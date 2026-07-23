import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import forestBg from '../assets/forest-bg.jpg'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${forestBg})` }}
    >
      
      <form onSubmit={handleSubmit} className="relative bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-2xl w-80">
        <h1 className="text-xl text-white font-bold mb-4 flex justify-center">Login</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b-2 w-full border-white text-white p-2 mb-4 outline-none"
          required
        />
        <div className="relative mb-3">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
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

  

        <button type="submit" className="border-2 border-white text-white w-full py-2 rounded cursor-pointer">
          Log In
        </button>

        <p className="text-sm mt-3 text-white text-center">
          Don't have an account? <Link to="/register" className="text-orange-600">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login