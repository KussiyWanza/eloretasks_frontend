import { useState } from 'react'
import { Check, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { updateTask } from '../services/taskService'

function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [expanded, setExpanded] = useState(false)

  const [description, setDescription] = useState(task.description || '')
  const [deadline, setDeadline] = useState(
    task.deadline ? task.deadline.slice(0, 10) : ''
  )

  const isCompleted = task.status === 'completed'
  const hasDetails = task.description || task.deadline

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

  const saveDetails = async () => {
    const res = await updateTask(task._id, {
      description,
      deadline: deadline || null,
    })
    onUpdate(res.data)
  }

  return (
    <div
      className={`rounded-lg mb-2 transition-colors ${
        isCompleted ? 'bg-green-500/15' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div
        onDoubleClick={() => !isEditing && setExpanded((prev) => !prev)}
        className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer select-none"
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
              onDoubleClick={(e) => e.stopPropagation()}
              className="bg-transparent border-b border-white/40 text-white flex-1 outline-none"
            />
          ) : (
            <span className={`truncate ${isCompleted ? 'line-through text-white/40' : 'text-white'}`}>
              {task.title}
            </span>
          )}

          {hasDetails && !expanded && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded((prev) => !prev)
            }}
            className="text-white/50 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="text-white/50 hover:text-white transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task._id)
            }}
            className="text-white/50 hover:text-red-400 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-white/10">
          <textarea
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={saveDetails}
            rows={2}
            className="w-full bg-white/5 border border-white/20 placeholder-white/40 text-white text-sm p-2 rounded-lg mb-2 outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="text-white/50 text-xs">Due:</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              onBlur={saveDetails}
              className="bg-white/5 border border-white/20 text-white text-sm px-2 py-1 rounded-lg outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard