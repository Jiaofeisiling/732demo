const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// 所有任务路由都需要认证
router.use(protect);

// 获取所有任务和创建任务
router.route('/')
  .get(getTasks)
  .post(createTask);

// 获取、更新和删除单个任务
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
