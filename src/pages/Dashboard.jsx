import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import TaskList from '../components/TaskList.jsx'
import forestBg from '../assets/forest-bg.jpg'

function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading...</p>
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${forestBg})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative">
        <header className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-lg">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
            <button
              onClick={handleLogout}
              className="border-2 border-white text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer hover:bg-white/10"
            >
              Log Out
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <TaskList />
        </main>
      </div>
    </div>
  )
}

export default Dashboard