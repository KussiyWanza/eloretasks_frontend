import { useState } from 'react'
import { Plus } from 'lucide-react'
import { createTask } from '../services/taskService'

function CreateTaskForm({ onTaskAdded, onTaskConfirmed, onTaskFailed }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setError('')

    // Optimistically add a temporary task immediately
    const tempId = `temp-${Date.now()}`
    const tempTask = { _id: tempId, title: trimmedTitle, status: 'pending' }
    onTaskAdded(tempTask)
    setTitle('')

    try {
      const res = await createTask({ title: trimmedTitle, status: 'pending' })
      onTaskConfirmed(tempId, res.data)
    } catch (err) {
      onTaskFailed(tempId)
      setError(err.response?.data?.message || 'Failed to create task')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center gap-3 border-b border-white/30 pb-2">
        <input
          type="text"
          placeholder="Add a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent placeholder-white/50 text-white outline-none"
        />
        <button
          type="submit"
          className="w-8 h-8 flex-shrink-0 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </form>
  )
}

export default CreateTaskForm