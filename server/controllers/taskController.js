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
    const { 
      title, 
      description, 
      type, 
      priority, 
      category,
      dueDate, 
      experienceReward, 
      goldReward,
      subTasks 
    } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      type: type || '短期',
      priority,
      category: category || '默认',
      dueDate,
      experienceReward,
      goldReward,
      subTasks: subTasks || [],
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
    task.type = req.body.type || task.type;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.category = req.body.category || task.category;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.experienceReward = req.body.experienceReward || task.experienceReward;
    task.goldReward = req.body.goldReward || task.goldReward;
    
    // 更新子任务（如果提供）
    if (req.body.subTasks) {
      task.subTasks = req.body.subTasks;
    }

    // 更新装备状态（如果提供）
    if (req.body.equipped !== undefined) {
      task.equipped = req.body.equipped;
    }

    // 更新任务槽位置（如果提供）
    if (req.body.slotPosition !== undefined) {
      task.slotPosition = req.body.slotPosition;
    }

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

// @desc    获取已装备的任务
// @route   GET /api/tasks/equipped
// @access  Private
const getEquippedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      user: req.user._id,
      equipped: true
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    装备任务到任务槽
// @route   PUT /api/tasks/:id/equip
// @access  Private
const equipTask = async (req, res) => {
  try {
    const { slotPosition } = req.body;
    
    if (slotPosition === undefined || slotPosition < 0 || slotPosition > 2) {
      return res.status(400).json({ message: '无效的任务槽位置' });
    }

    // 查找要装备的任务
    const task = await Task.findById(req.params.id);
    
    // 检查任务是否存在
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    // 检查任务是否属于当前用户
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限' });
    }

    // 检查该槽位是否已有任务
    const existingTask = await Task.findOne({
      user: req.user._id,
      equipped: true,
      slotPosition
    });

    // 如果该槽位已有任务，则将其卸下
    if (existingTask) {
      existingTask.equipped = false;
      existingTask.slotPosition = -1;
      await existingTask.save();
    }

    // 装备新任务
    task.equipped = true;
    task.slotPosition = slotPosition;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    卸下已装备的任务
// @route   PUT /api/tasks/:id/unequip
// @access  Private
const unequipTask = async (req, res) => {
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

    // 卸下任务
    task.equipped = false;
    task.slotPosition = -1;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
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
  getEquippedTasks,
  equipTask,
  unequipTask,
};
