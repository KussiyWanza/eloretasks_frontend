function TaskCard({ task, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
          <div className="flex gap-3 mt-2 text-xs text-gray-500">
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">{task.status}</span>
            {task.deadline && (
              <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(task._id)}
          className="text-red-500 text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskCard