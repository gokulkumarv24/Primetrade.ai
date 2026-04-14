import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import TaskModal from '../components/TaskModal';

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      const res = await taskAPI.getAll(params);
      setTasks(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filters]);

  const showMessage = (msg, type = 'success') => {
    if (type === 'success') {
      setSuccess(msg);
      setError('');
    } else {
      setError(msg);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  const handleCreate = async (data) => {
    try {
      await taskAPI.create(data);
      showMessage('Task created successfully!');
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to create task.',
        'error'
      );
    }
  };

  const handleUpdate = async (data) => {
    try {
      await taskAPI.update(editingTask._id, data);
      showMessage('Task updated successfully!');
      setShowModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update task.',
        'error'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(id);
      showMessage('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to delete task.',
        'error'
      );
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Welcome, {user.name}!</h2>
        <button className="btn-primary" onClick={openCreate}>
          + New Task
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => {
            setFilters({ ...filters, priority: e.target.value });
            setPage(1);
          }}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      ) : (
        <>
          {tasks.map((task) => (
            <div className="card" key={task._id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h3>{task.title}</h3>
                  {task.description && (
                    <p style={{ color: 'var(--text-light)', marginTop: 4 }}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="task-meta">
                <span className={`badge badge-${task.status}`}>
                  {task.status}
                </span>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                {user.role === 'admin' && task.user && (
                  <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
                    By: {task.user.name || task.user.email}
                  </span>
                )}
              </div>
              <div className="task-actions">
                <button className="btn-primary" onClick={() => openEdit(task)}>
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span style={{ lineHeight: '40px' }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
