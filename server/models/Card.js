const mongoose = require('mongoose');

// 卡片模型架构
const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // 关联到User模型
    },
    type: {
      type: String,
      enum: ['blank', 'special', 'periodic'],
      default: 'blank',
      required: true,
    },
    title: {
      type: String,
      required: [true, '请提供卡片标题'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    bonus: {
      experienceMultiplier: {
        type: Number,
        default: 1.0,
      },
      goldMultiplier: {
        type: Number,
        default: 1.0,
      },
      specialEffect: {
        type: String,
        default: '',
      },
    },
    reusable: {
      type: Boolean,
      default: false, // 默认卡片不可重复使用
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date, // 可选，卡片过期时间
    },
    used: {
      type: Boolean,
      default: false, // 标记卡片是否已使用
    },
    cooldownUntil: {
      type: Date, // 周期性卡片的冷却时间
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
  }
);

// 添加索引以提高查询性能
cardSchema.index({ user: 1, type: 1 });
cardSchema.index({ user: 1, used: 1 });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
