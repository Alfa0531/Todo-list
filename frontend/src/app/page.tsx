"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard, { Task } from '../components/TaskCard';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

export default function TodosPage() {
  const [todos, setTodos] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/tasks', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.log(`Error al obtener las tareas: ${res.status}`);
        return;
      }
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refresh]);

  const filteredTodos = todos.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleCreateTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      if (res.ok) {
        setNewTaskTitle('');
        setRefresh((prev) => prev + 1);
      } else {
        console.error('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  const handleUpdate = async (updatedTask: Task) => {
    try {
      const token = localStorage.getItem('token');
      const { _id, title, completed } = updatedTask;
      const res = await fetch(`http://localhost:4000/api/tasks/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, completed }),
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      } else {
        console.error('Error al actualizar la tarea');
      }
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: subtaskTitle }),
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error al agregar subtarea:', error);
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error al togglear la subtarea:', error);
    }
  };

  const handleDeleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error al eliminar la subtarea:', error);
    }
  };

  const handleUpdateSubtask = async (
    taskId: string,
    subtaskId: string,
    updatedData: { title?: string; completed?: boolean }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      } else {
        console.error('Error al actualizar la subtarea');
      }
    } catch (error) {
      console.error('Error al actualizar la subtarea:', error);
    }
  };

  const handleAddComment = async (taskId: string, commentText: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleDeleteComment = async (taskId: string, commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  const handleUpdateComment = async (
    taskId: string,
    commentId: string,
    updatedData: { text: string }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setRefresh((prev) => prev + 1);
      } else {
        console.error('Error al actualizar el comentario');
      }
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Tareas
      </Typography>

      {/* Controles de filtrado */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(event, newFilter) => {
            setFilter(newFilter ?? 'all');
          }}
          aria-label="Filtrar tareas"
        >
          <ToggleButton value="all" aria-label="Todas">
            Todas
          </ToggleButton>
          <ToggleButton value="pending" aria-label="Pendientes">
            Pendientes
          </ToggleButton>
          <ToggleButton value="completed" aria-label="Completadas">
            Completadas
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Sección para crear una nueva tarea */}
      <Box sx={{ display: 'flex', mb: 4 }}>
        <TextField
          label="Título de la tarea"
          variant="outlined"
          fullWidth
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={handleCreateTask}
          disabled={!newTaskTitle.trim()}
        >
          Crear Tarea
        </Button>
      </Box>

      {filteredTodos.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onUpdateSubtask={handleUpdateSubtask}
          onUpdateComment={handleUpdateComment}
        />
      ))}
    </Container>
  );
}
