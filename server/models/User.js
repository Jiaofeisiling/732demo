const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 用户模型架构
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, '请提供用户名'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, '请提供邮箱'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        '请提供有效的邮箱地址',
      ],
    },
    password: {
      type: String,
      required: [true, '请提供密码'],
      minlength: 6,
      select: false, // 默认查询不返回密码
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    experience: {
      type: Number,
      default: 0,
    },
    gold: {
      type: Number,
      default: 0,
    },
    // 每日卡片配额
    dailyCards: {
      blank: {
        type: Number,
        default: 3, // 默认每天3张空白卡片
      },
      lastIssued: {
        type: Date,
        default: null, // 上次发放日期
      },
    },
    // 卡片库存引用
    cardInventory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
  }
);

// 保存前加密密码
userSchema.pre('save', async function (next) {
  // 只有在密码被修改时才重新加密
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 验证密码的方法
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
