import { useState, useEffect } from 'react'
import { Trash2, Search, ChevronDown } from 'lucide-react'
import { getTasks, deleteTask } from '../services/taskService'
import TaskCard from './TaskCard.jsx'
import CreateTaskForm from './CreateTaskForm.jsx'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [sortOpen, setSortOpen] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search.trim()) params.search = search.trim()
      if (sortBy !== 'newest') params.sortBy = sortBy

      const res = await getTasks(params)
      setTasks(res.data)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTasks()
    }, 350)
    return () => clearTimeout(timeout)
  }, [search, sortBy])

  useEffect(() => {
    const handleClickOutside = () => setSortOpen(false)
    if (sortOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [sortOpen])

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
    <div className="relative bg-white/10 backdrop-blur-md border-x-2 border-white/30 shadow-lg p-6 max-w-md mx-auto rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Todo List</h2>
      </div>

      <CreateTaskForm onTaskCreated={handleTaskCreated} />

      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/20 placeholder-white/40 text-white text-sm pl-8 pr-3 py-1.5 rounded-lg outline-none"
          />
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            className="flex items-center gap-1.5 bg-white/5 border border-white/20 text-white text-sm px-3 py-1.5 rounded-lg outline-none hover:bg-white/10 transition-colors capitalize cursor-pointer"
          >
            {sortBy}
            <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-cyan-950/60 backdrop-blur-lg border border-white/30 rounded-lg shadow-2xl shadow-black/60 ring-1 ring-black/20 overflow-hidden z-10">
              {['newest', 'oldest', 'deadline'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSortBy(option)
                    setSortOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm capitalize transition-colors cursor-pointer ${
                    sortBy === option ? 'bg-white/25 text-white' : 'text-white/70 hover:bg-white/15'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {['all', 'incomplete', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize border transition-colors cursor-pointer ${
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
          className="ml-auto p-2 rounded-full border border-white/20 text-white/40 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-red-500/20 enabled:hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {loading && <p className="text-white/60 text-center py-6">Loading...</p>}
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