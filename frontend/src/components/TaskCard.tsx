"use client";
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Edit,
  Delete,
  Save,
  Cancel,
  ExpandMore,
  ExpandLess,
  ToggleOn,
  ToggleOff,
} from '@mui/icons-material';

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  user: string;
  subtasks: {
    _id: string;
    title: string;
    completed: boolean;
  }[];
  comments: {
    _id: string;
    text: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, updatedData: { title?: string; completed?: boolean }) => void;
  onAddComment: (taskId: string, commentText: string) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
  onUpdateComment: (taskId: string, commentId: string, updatedData: { text: string }) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
}) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedCompleted, setEditedCompleted] = useState(task.completed);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const iconBtnStyle = { width: 36, height: 36, mx: 0.5 };

  const handleSaveEdit = () => {
    onUpdate({ ...task, title: editedTitle, completed: editedCompleted });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setEditedCompleted(task.completed);
    setIsEditing(false);
  };

  const handleSaveSubtaskEdit = (id: string) => {
    onUpdateSubtask(task._id, id, { title: editingSubtaskTitle });
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const handleSaveCommentEdit = (id: string) => {
    onUpdateComment(task._id, id, { text: editingCommentText });
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <CardHeader
        title={
          isEditing ? (
            <TextField fullWidth value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
          ) : (
            <Typography variant="h6" fontWeight="bold">{task.title}</Typography>
          )
        }
        subheader={
          isEditing ? (
            <FormControlLabel
              control={<Switch checked={editedCompleted} onChange={(e) => setEditedCompleted(e.target.checked)} />}
              label={editedCompleted ? 'Completada' : 'Pendiente'}
            />
          ) : (
            <Typography variant="subtitle2" color={task.completed ? 'success.main' : 'text.secondary'}>
              {task.completed ? 'Completada' : 'Pendiente'}
            </Typography>
          )
        }
        action={
          !isEditing && (
            <IconButton onClick={() => setIsEditing(true)} aria-label="Editar tarea" sx={iconBtnStyle} size="small" color="primary">
              <Edit fontSize="small" />
            </IconButton>
          )
        }
        sx={{ pb: 0 }}
      />

      <Divider />

      <CardContent>
        {isEditing && (
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Save />}
              onClick={handleSaveEdit}
              sx={{ minWidth: 90, mx: 0.5 }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Cancel />}
              onClick={handleCancelEdit}
              sx={{ minWidth: 90, mx: 0.5 }}
            >
              Cancelar
            </Button>
          </Box>
        )}

        {/* SUBTAREAS */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="medium" flexGrow={1}>Subtareas</Typography>
            <IconButton onClick={() => setShowSubtasks(!showSubtasks)} size="small" sx={iconBtnStyle} color="inherit">
              {showSubtasks ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showSubtasks}>
            {task.subtasks.length > 0 ? (
              task.subtasks.map((subtask) => (
                <Box
                  key={subtask._id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="grey.100"
                  p={1}
                  borderRadius={1}
                  mb={1}
                >
                  {editingSubtaskId === subtask._id ? (
                    <>
                      <TextField
                        value={editingSubtaskTitle}
                        onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <IconButton onClick={() => handleSaveSubtaskEdit(subtask._id)} sx={iconBtnStyle} color="primary">
                        <Save fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => {
                        setEditingSubtaskId(null);
                        setEditingSubtaskTitle('');
                      }} sx={iconBtnStyle} color="inherit">
                        <Cancel fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2">
                        {subtask.title} {subtask.completed ? '(Completada)' : '(Pendiente)'}
                      </Typography>
                      <Box>
                        <IconButton onClick={() => {
                          setEditingSubtaskId(subtask._id);
                          setEditingSubtaskTitle(subtask.title);
                        }} sx={iconBtnStyle} color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => onToggleSubtask(task._id, subtask._id)} sx={iconBtnStyle} color="secondary">
                          {subtask.completed ? <ToggleOff fontSize="small" /> : <ToggleOn fontSize="small" />}
                        </IconButton>
                        <IconButton onClick={() => onDeleteSubtask(task._id, subtask._id)} color="error" sx={iconBtnStyle}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No hay subtareas.</Typography>
            )}

            <Box display="flex" mt={1}>
              <TextField
                fullWidth
                size="small"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Nueva subtarea"
              />
              <Button
                variant="contained"
                size="small"
                sx={{ minWidth: 90, mx: 0.5 }}
                onClick={() => {
                  if (newSubtask.trim()) {
                    onAddSubtask(task._id, newSubtask);
                    setNewSubtask('');
                  }
                }}
              >
                Agregar
              </Button>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* COMENTARIOS */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="medium" flexGrow={1}>Comentarios</Typography>
            <IconButton onClick={() => setShowComments(!showComments)} size="small" sx={iconBtnStyle} color="inherit">
              {showComments ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showComments}>
            {task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <Box
                  key={comment._id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="grey.100"
                  p={1}
                  borderRadius={1}
                  mb={1}
                >
                  {editingCommentId === comment._id ? (
                    <>
                      <TextField
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <IconButton onClick={() => handleSaveCommentEdit(comment._id)} sx={iconBtnStyle} color="primary">
                        <Save fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => {
                        setEditingCommentId(null);
                        setEditingCommentText('');
                      }} sx={iconBtnStyle} color="inherit">
                        <Cancel fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2">{comment.text}</Typography>
                      <Box>
                        <IconButton onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditingCommentText(comment.text);
                        }} sx={iconBtnStyle} color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => onDeleteComment(task._id, comment._id)} color="error" sx={iconBtnStyle}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No hay comentarios.</Typography>
            )}

            <Box display="flex" mt={1}>
              <TextField
                fullWidth
                size="small"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Nuevo comentario"
              />
              <Button
                variant="contained"
                size="small"
                sx={{ minWidth: 90, mx: 0.5 }}
                onClick={() => {
                  if (newComment.trim()) {
                    onAddComment(task._id, newComment);
                    setNewComment('');
                  }
                }}
              >
                Agregar
              </Button>
            </Box>
          </Collapse>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          variant="contained"
          size="small"
          color="error"
          startIcon={<Delete />}
          sx={{ minWidth: 90 }}
          onClick={() => onDelete(task._id)}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
