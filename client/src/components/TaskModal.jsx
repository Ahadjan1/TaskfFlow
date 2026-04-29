import { useState, useEffect } from 'react';

const EMPTY = { title: '', description: '', status: 'Todo', priority: 'Medium', due_date: '', tags: [], subtasks: [] };

const TaskModal = ({ isOpen, onClose, onSave, editTask }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        status: editTask.status || 'Todo',
        priority: editTask.priority || 'Medium',
        due_date: editTask.due_date ? editTask.due_date.split('T')[0] : '',
        tags: Array.isArray(editTask.tags) ? editTask.tags : [],
        subtasks: Array.isArray(editTask.subtasks) ? editTask.subtasks : [],
      });
      setTagInput(Array.isArray(editTask.tags) ? editTask.tags.join(', ') : '');
    } else {
      setForm(EMPTY);
      setTagInput('');
    }
    setError('');
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTagsChange = (e) => {
    setTagInput(e.target.value);
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setForm({ ...form, tags });
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setForm({
      ...form,
      subtasks: [...form.subtasks, { title: newSubtask, is_completed: false }]
    });
    setNewSubtask('');
  };

  const removeSubtask = (index) => {
    const subtasks = [...form.subtasks];
    subtasks.splice(index, 1);
    setForm({ ...form, subtasks });
  };

  const toggleSubtask = (index) => {
    const subtasks = [...form.subtasks];
    subtasks[index].is_completed = !subtasks[index].is_completed;
    setForm({ ...form, subtasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editTask ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add some details..."
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" name="status" value={form.status} onChange={handleChange}>
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" name="priority" value={form.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-tags">Tags (comma separated)</label>
            <input
              id="task-tags"
              type="text"
              value={tagInput}
              onChange={handleTagsChange}
              placeholder="work, urgent, study"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
            />
          </div>

          <div className="subtasks-section">
            <label>Sub-tasks</label>
            <div className="subtask-input-group">
              <input 
                type="text" 
                value={newSubtask} 
                onChange={(e) => setNewSubtask(e.target.value)} 
                placeholder="Add a sub-task..."
              />
              <button type="button" onClick={addSubtask} className="btn-add-subtask">+</button>
            </div>
            <div className="subtasks-list">
              {form.subtasks.map((st, i) => (
                <div key={i} className="subtask-item">
                  <input 
                    type="checkbox" 
                    checked={st.is_completed} 
                    onChange={() => toggleSubtask(i)} 
                  />
                  <span className={st.is_completed ? 'strikethrough' : ''}>{st.title}</span>
                  <button type="button" onClick={() => removeSubtask(i)} className="btn-remove-subtask">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} id="modal-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} id="modal-save-btn">
              {loading ? <span className="spinner"></span> : editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
