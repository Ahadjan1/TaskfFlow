const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// All task routes require authentication
router.use(authMiddleware);

// GET /api/tasks - Get all tasks for the logged-in user
router.get('/', async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    if (tasks.length === 0) return res.json([]);

    const taskIds = tasks.map(t => t.id);
    const [subtasks] = await db.query(
      'SELECT * FROM subtasks WHERE task_id IN (?) ORDER BY created_at ASC',
      [taskIds]
    );

    const tasksWithSubtasks = tasks.map(t => {
      // Parse JSON tags if they exist and are strings, or default to []
      let parsedTags = [];
      if (typeof t.tags === 'string') {
        try { parsedTags = JSON.parse(t.tags); } catch (e) {}
      } else if (Array.isArray(t.tags)) {
        parsedTags = t.tags;
      }
      return {
        ...t,
        tags: parsedTags,
        subtasks: subtasks.filter(st => st.task_id === t.id)
      };
    });

    res.json(tasksWithSubtasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  const { title, description, status, priority, due_date, tags } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  try {
    const tagsJson = tags ? JSON.stringify(tags) : '[]';
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, status, priority, due_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        req.user.id,
        title,
        description || null,
        status || 'Todo',
        priority || 'Medium',
        due_date || null,
        tagsJson
      ]
    );

    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    
    let parsedTags = [];
    if (newTask[0].tags) {
       try { parsedTags = typeof newTask[0].tags === 'string' ? JSON.parse(newTask[0].tags) : newTask[0].tags; } catch(e){}
    }
    res.status(201).json({ ...newTask[0], tags: parsedTags, subtasks: [] });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date, tags } = req.body;

  try {
    // Verify ownership
    const [rows] = await db.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    const tagsJson = tags ? JSON.stringify(tags) : '[]';
    await db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, tags = ? WHERE id = ?',
      [title, description || null, status, priority, due_date || null, tagsJson, id]
    );

    const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    const [subtasks] = await db.query('SELECT * FROM subtasks WHERE task_id = ?', [id]);
    
    let parsedTags = [];
    if (updated[0].tags) {
       try { parsedTags = typeof updated[0].tags === 'string' ? JSON.parse(updated[0].tags) : updated[0].tags; } catch(e){}
    }
    res.json({ ...updated[0], tags: parsedTags, subtasks });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;

// --- SUBTASKS ENDPOINTS ---

// POST /api/tasks/:id/subtasks
router.post('/:id/subtasks', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Subtask title required.' });

  try {
    const [rows] = await db.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found.' });

    const [result] = await db.query('INSERT INTO subtasks (task_id, title) VALUES (?, ?)', [id, title]);
    const [newSubtask] = await db.query('SELECT * FROM subtasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newSubtask[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// PUT /api/tasks/:taskId/subtasks/:subtaskId
router.put('/:taskId/subtasks/:subtaskId', async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const { title, is_completed } = req.body;

  try {
    const [rows] = await db.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found.' });

    await db.query('UPDATE subtasks SET title = COALESCE(?, title), is_completed = COALESCE(?, is_completed) WHERE id = ? AND task_id = ?', 
      [title, is_completed !== undefined ? is_completed : null, subtaskId, taskId]);
    
    const [updated] = await db.query('SELECT * FROM subtasks WHERE id = ?', [subtaskId]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// DELETE /api/tasks/:taskId/subtasks/:subtaskId
router.delete('/:taskId/subtasks/:subtaskId', async (req, res) => {
  const { taskId, subtaskId } = req.params;
  try {
    const [rows] = await db.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found.' });

    await db.query('DELETE FROM subtasks WHERE id = ? AND task_id = ?', [subtaskId, taskId]);
    res.json({ message: 'Subtask deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});
