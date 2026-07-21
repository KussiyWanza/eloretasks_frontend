import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext.jsx'
import forestBg from '../assets/forest-bg.jpg'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setAuthData } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { token, user } = res.data
      setAuthData(token, user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${forestBg})` }}
    >


      <form onSubmit={handleSubmit} className="relative bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Register</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded transition-colors">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account? <Link to="/login" className="text-orange-600">Log In</Link>
        </p>
      </form>
    </div>
  )
}

export default Register