const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
    const subtask = task.subtasks.id(req.params.subtaskId);
    subtask.completed = !subtask.completed;
    if (task.subtasks.length > 0) {
      task.completed = task.subtasks.every(st => st.completed);
    } else {
      task.completed = false;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
    task.subtasks.push({ title: req.body.title });
    if (task.subtasks.length > 0) {
      task.completed = task.subtasks.every(st => st.completed);
    } else {
      task.completed = false;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    task.subtasks = task.subtasks.filter(
      (subtask) => subtask._id.toString() !== req.params.subtaskId
    );
    if (task.subtasks.length > 0) {
      task.completed = task.subtasks.every(st => st.completed);
    } else {
      task.completed = false;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ error: 'Subtarea no encontrada' });
    }
    if (req.body.title !== undefined) {
      subtask.title = req.body.title;
    }
    if (req.body.completed !== undefined) {
      subtask.completed = req.body.completed;
    }
    if (task.subtasks.length > 0) {
      task.completed = task.subtasks.every(st => st.completed);
    } else {
      task.completed = false;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
    task.comments.push({ text: req.body.text, author: req.user.id });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    task.comments = task.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    if (req.body.text !== undefined) {
      comment.text = req.body.text;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
