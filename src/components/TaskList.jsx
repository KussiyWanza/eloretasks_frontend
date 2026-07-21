import { useState, useEffect } from 'react'
import { getTasks, deleteTask } from '../services/taskService'
import TaskCard from './TaskCard.jsx'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((task) => task._id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  if (loading) return <p className="text-gray-500">Loading tasks...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (tasks.length === 0) return <p className="text-gray-500 select-none">No tasks yet. Create one!</p>

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default TaskList