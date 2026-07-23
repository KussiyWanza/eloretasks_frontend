import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { getTasks, deleteTask } from '../services/taskService'
import TaskCard from './TaskCard.jsx'
import CreateTaskForm from './CreateTaskForm.jsx'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [confirmingClear, setConfirmingClear] = useState(false)

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

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev])
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
  }

  const handleClearAll = async () => {
    setConfirmingClear(false)
    const results = await Promise.allSettled(tasks.map((t) => deleteTask(t._id)))
    const failedIds = tasks
      .filter((_, i) => results[i].status === 'rejected')
      .map((t) => t._id)

    setTasks((prev) => prev.filter((t) => failedIds.includes(t._id)))

    if (failedIds.length > 0) {
      setError(`Failed to clear ${failedIds.length} task(s)`)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.status === 'completed'
    if (filter === 'incomplete') return task.status !== 'completed'
    return true
  })

  const remaining = tasks.filter((t) => t.status !== 'completed').length

  return (
    <div className="relative bg-white/10 backdrop-blur-md border-x-2 border-white/30 rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Todo List</h2>
      </div>

      <CreateTaskForm onTaskCreated={handleTaskCreated} />

      <div className="flex items-center gap-2 mb-4">
        {['all', 'incomplete', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize border transition-colors ${
              filter === f
                ? 'bg-white/20 border-white/40 text-white'
                : 'border-white/30 text-white/70 hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => setConfirmingClear(true)}
          disabled={tasks.length === 0}
          className="ml-auto p-2 rounded-full border border-white/20 text-white/40 disabled:opacity-40 enabled:hover:bg-red-500/20 enabled:hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {loading && <p className="text-white/60 text-center py-6">Loading :D</p>}
      {error && <p className="text-red-400 text-center py-6">{error}</p>}
      {!loading && filteredTasks.length === 0 && (
        <p className="text-white/50 text-center py-6">No todos yet. Add a task</p>
      )}

      {filteredTasks.map((task) => (
        <TaskCard key={task._id} task={task} onDelete={handleDelete} onUpdate={handleTaskUpdated} />
      ))}

      {tasks.length > 0 && (
        <p className="text-white/50 text-sm text-center mt-4 pt-4 border-t border-white/10">
          {remaining} remaining :D
        </p>
      )}

      {confirmingClear && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 max-w-xs text-center">
            <p className="text-white mb-4">
              Delete all {tasks.length} task{tasks.length !== 1 ? 's' : ''}? This can't be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmingClear(false)}
                className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList