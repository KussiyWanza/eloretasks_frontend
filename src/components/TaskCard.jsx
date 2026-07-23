import { useState } from 'react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { updateTask } from '../services/taskService'

function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const isCompleted = task.status === 'completed'

  const toggleComplete = async () => {
    const res = await updateTask(task._id, { status: isCompleted ? 'pending' : 'completed' })
    onUpdate(res.data)
  }

  const saveEdit = async () => {
    setIsEditing(false)
    if (title.trim() && title !== task.title) {
      const res = await updateTask(task._id, { title })
      onUpdate(res.data)
    } else {
      setTitle(task.title)
    }
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg mb-2 transition-colors ${
        isCompleted ? 'bg-green-500/15' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={toggleComplete}
          className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors ${
            isCompleted ? 'bg-green-500 border-green-500' : 'border-white/40 hover:border-white/70'
          }`}
        >
          {isCompleted && <Check size={12} className="text-white" />}
        </button>

        {isEditing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            className="bg-transparent border-b border-white/40 text-white flex-1 outline-none"
          />
        ) : (
          <span className={`truncate ${isCompleted ? 'line-through text-white/40' : 'text-white'}`}>
            {task.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => setIsEditing(true)} className="text-white/50 hover:text-white transition-colors">
          <Pencil size={15} />
        </button>
        <button onClick={() => onDelete(task._id)} className="text-white/50 hover:text-red-400 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

export default TaskCard