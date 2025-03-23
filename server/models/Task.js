const mongoose = require('mongoose');

// 任务模型架构
const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // 关联到User模型
    },
    title: {
      type: String,
      required: [true, '请提供任务标题'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['待完成', '进行中', '已完成'],
      default: '待完成',
    },
    priority: {
      type: String,
      enum: ['低', '中', '高'],
      default: '中',
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    experienceReward: {
      type: Number,
      default: 10,
    },
    goldReward: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
