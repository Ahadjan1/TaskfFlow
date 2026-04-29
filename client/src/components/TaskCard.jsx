import { useEffect, useRef } from 'react';

const PRIORITY_COLORS = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#ef4444',
};

const STATUS_ICONS = {
  Todo: '○',
  'In Progress': '◑',
  Done: '●',
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'Done') return false;
  return new Date(dateStr) < new Date();
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handler = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-2px)`;
    };
    const reset = () => { card.style.transform = ''; };
    card.addEventListener('mousemove', handler);
    card.addEventListener('mouseleave', reset);
    return () => {
      card.removeEventListener('mousemove', handler);
      card.removeEventListener('mouseleave', reset);
    };
  }, []);

  const overdue = isOverdue(task.due_date, task.status);

  const nextStatus = { Todo: 'In Progress', 'In Progress': 'Done', Done: 'Todo' };

  const completedSubtasks = task.subtasks?.filter(st => st.is_completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div ref={cardRef} className={`task-card ${task.status === 'Done' ? 'task-done' : ''}`}>
      <div className="task-card-header">
        <button
          className="status-toggle"
          onClick={() => onStatusChange(task.id, nextStatus[task.status])}
          title={`Move to ${nextStatus[task.status]}`}
          id={`status-btn-${task.id}`}
        >
          <span className={`status-icon status-${task.status.replace(' ', '-')}`}>
            {STATUS_ICONS[task.status]}
          </span>
        </button>
        <div className="task-meta">
          <span
            className="priority-badge"
            style={{ color: PRIORITY_COLORS[task.priority], borderColor: PRIORITY_COLORS[task.priority] + '40' }}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <h3 className={`task-title ${task.status === 'Done' ? 'strikethrough' : ''}`}>
        {task.title}
      </h3>

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, i) => (
            <span key={i} className="task-tag">#{tag}</span>
          ))}
        </div>
      )}

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {totalSubtasks > 0 && (
        <div className="task-progress">
          <div className="progress-text">
            <span>Sub-tasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}

      <div className="task-footer">
        {task.due_date && (
          <span className={`due-date ${overdue ? 'overdue' : ''}`}>
            {overdue ? '⚠ ' : '📅 '}
            {formatDate(task.due_date)}
          </span>
        )}
        <div className="task-actions">
          <button id={`edit-btn-${task.id}`} className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit task">✎</button>
          <button id={`delete-btn-${task.id}`} className="icon-btn delete-btn" onClick={() => onDelete(task.id)} title="Delete task">✕</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
