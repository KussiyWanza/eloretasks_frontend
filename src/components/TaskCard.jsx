import { useState, useEffect } from 'react'
import { Check, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { updateTask } from '../services/taskService'

function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [expanded, setExpanded] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  const [description, setDescription] = useState(task.description || '')
  const [deadline, setDeadline] = useState(
    task.deadline ? task.deadline.slice(0, 10) : ''
  )

  const isCompleted = task.status === 'completed'
  const hasDetails = task.description || task.deadline

  const isOverdue =
    task.deadline &&
    !isCompleted &&
    new Date(task.deadline) < new Date(new Date().toDateString())

  useEffect(() => {
    const timeout = setTimeout(() => setHasEntered(true), 10)
    return () => clearTimeout(timeout)
  }, [])

  const toggleComplete = async () => {
    const newStatus = isCompleted ? 'pending' : 'completed'
    onUpdate({ ...task, status: newStatus })

    try {
      const res = await updateTask(task._id, { status: newStatus })
      onUpdate(res.data)
    } catch (err) {
      onUpdate(task)
    }
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

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      onDelete(task._id)
    }, 300)
  }

  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isDeleting || !hasEntered ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
      }`}
    >
      <div className="overflow-hidden">
        <div
          className={`rounded-lg mb-2 transition-colors ${
            isCompleted ? 'bg-green-500/15' : isOverdue ? 'bg-red-500/30' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          {/* Normal card content — collapses when confirmingDelete */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              confirmingDelete ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
            }`}
          >
            <div className="overflow-hidden">
              <div
                onDoubleClick={() => !isEditing && setExpanded((prev) => !prev)}
                className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleComplete()
                    }}
                    className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
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
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isOverdue ? 'bg-red-600' : 'bg-orange-400'
                      }`}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpanded((prev) => !prev)
                    }}
                    className="text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    className="text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmingDelete(true)
                    }}
                    className="text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
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
                        className={`bg-white/5 border text-sm px-2 py-1 rounded-lg outline-none cursor-pointer ${
                          isOverdue ? 'border-red-400/50 text-red-300' : 'border-white/20 text-white'
                        }`}
                      />
                      {isOverdue && (
                        <span className="text-red-400 text-xs font-medium">Overdue</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm-delete content — expands when confirmingDelete */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              confirmingDelete ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                <p className="text-white text-sm truncate">Delete "{task.title}"?</p>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="px-3 py-1.5 rounded-lg border border-white/30 text-white text-sm hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard