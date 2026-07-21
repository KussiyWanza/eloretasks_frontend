import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import forestBg from '../assets/forest-bg.jpg'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b-2 w-full border-white text-white p-2 mb-4 outline-none"
          required
        />
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded transition-colors">
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