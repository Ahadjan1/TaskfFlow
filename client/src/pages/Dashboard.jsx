import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../api/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLUMNS = ['Todo', 'In Progress', 'Done'];
const COLORS = ['#3b82f6', '#f59e0b', '#22c55e'];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (form) => {
    const res = await api.post('/tasks', form);
    setTasks((prev) => [res.data, ...prev]);
  };

  const handleUpdate = async (form) => {
    const res = await api.put(`/tasks/${editTask.id}`, form);
    setTasks((prev) => prev.map((t) => (t.id === editTask.id ? res.data : t)));
  };

  const handleStatusChange = async (id, newStatus) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const res = await api.put(`/tasks/${id}`, { ...task, status: newStatus });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const countByStatus = (status) => tasks.filter((t) => t.status === status).length;

  const chartData = COLUMNS.map(col => ({
    name: col,
    value: countByStatus(col)
  })).filter(d => d.value > 0);

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        {/* Top Summary Section */}
        <div className="dashboard-top">
          <div className="stats-row">
            {COLUMNS.map((col) => (
              <div key={col} className={`stat-card stat-${col.replace(' ', '-')}`}>
                <span className="stat-count">{countByStatus(col)}</span>
                <span className="stat-label">{col}</span>
              </div>
            ))}
          </div>

          <div className="chart-container">
            <h3>Activity Overview</h3>
            <div className="chart-wrapper">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[COLUMNS.indexOf(entry.name)]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-chart-data">No active tasks</div>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              id="task-search"
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            {['All', 'Low', 'Medium', 'High'].map((p) => (
              <button
                key={p}
                id={`filter-${p}`}
                className={`filter-btn ${filterPriority === p ? 'active' : ''}`}
                onClick={() => setFilterPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button id="new-task-btn" className="btn-primary" onClick={openCreate}>
            + New Task
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Kanban Board */}
        {loading ? (
          <div className="loading-state">
            <div className="big-spinner"></div>
            <p>Loading tasks…</p>
          </div>
        ) : (
          <div className="kanban-board">
            {COLUMNS.map((col) => {
              const colTasks = filtered.filter((t) => t.status === col);
              return (
                <div key={col} className={`kanban-col kanban-${col.replace(' ', '-')}`}>
                  <div className="col-header">
                    <span className="col-title">{col}</span>
                    <span className="col-count">{colTasks.length}</span>
                  </div>
                  <div className="col-tasks">
                    {colTasks.length === 0 ? (
                      <div className="empty-col">
                        <span>No tasks here</span>
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={editTask ? handleUpdate : handleCreate}
        editTask={editTask}
      />
    </div>
  );
};

export default Dashboard;
