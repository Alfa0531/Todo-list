const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  updateSubtask,  
  addComment,
  deleteComment,
  updateComment    
} = require('../controllers/taskController');

router.use(auth);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.post('/:taskId/subtasks', addSubtask);
router.put('/:taskId/subtasks/:subtaskId/toggle', toggleSubtask);
router.put('/:taskId/subtasks/:subtaskId', updateSubtask);  
router.delete('/:taskId/subtasks/:subtaskId', deleteSubtask);

router.post('/:taskId/comments', addComment);
router.put('/:taskId/comments/:commentId', updateComment); 
router.delete('/:taskId/comments/:commentId', deleteComment);

module.exports = router;
