const Task = require('../models/Task');
const User = require('../models/User');

// @desc    获取当前用户的所有任务
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    创建新任务
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, experienceReward, goldReward } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
      experienceReward,
      goldReward,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取单个任务
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // 检查任务是否存在
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    // 检查任务是否属于当前用户
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新任务
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // 检查任务是否存在
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    // 检查任务是否属于当前用户
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限' });
    }

    // 更新任务字段
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.experienceReward = req.body.experienceReward || task.experienceReward;
    task.goldReward = req.body.goldReward || task.goldReward;

    // 如果任务状态变为已完成，记录完成时间并奖励用户
    if (req.body.status === '已完成' && task.status !== '已完成') {
      task.completedAt = Date.now();
      
      // 奖励用户经验和金币
      const user = await User.findById(req.user._id);
      user.experience += task.experienceReward;
      user.gold += task.goldReward;
      await user.save();
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除任务
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // 检查任务是否存在
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    // 检查任务是否属于当前用户
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限' });
    }

    await task.deleteOne();
    res.json({ message: '任务已删除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};
