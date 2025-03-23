const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT密钥，在实际项目中应该存储在环境变量中
const JWT_SECRET = process.env.JWT_SECRET || 'mern_demo_secret_key';

// 验证用户是否已登录的中间件
const protect = async (req, res, next) => {
  let token;

  // 检查请求头中是否包含token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取token
      token = req.headers.authorization.split(' ')[1];

      // 验证token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 获取用户信息（不包含密码）
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: '未授权，token无效' });
    }
  }

  if (!token) {
    res.status(401).json({ message: '未授权，没有token' });
  }
};

// 检查用户是否为管理员的中间件
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '没有权限，仅限管理员访问' });
  }
};

// 生成JWT token的工具函数
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d', // token有效期30天
  });
};

module.exports = { protect, admin, generateToken };
