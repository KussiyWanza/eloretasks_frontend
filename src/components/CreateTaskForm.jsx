import { useState } from 'react'
import { Plus } from 'lucide-react'
import { createTask } from '../services/taskService'

function CreateTaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await createTask({ title: title.trim(), status: 'pending' })
      onTaskCreated(res.data)
      setTitle('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setSubmitting(false)
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
          disabled={submitting}
          className="flex-1 bg-transparent placeholder-white/50 text-white outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-8 h-8 flex-shrink-0 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <Plus size={18} />
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </form>
  )
}

export default CreateTaskForm