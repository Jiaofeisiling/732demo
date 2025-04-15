<h1 align="center">
  <a href="https://github.com">
    <img src="https://github.com/Jiaofeisiling/732demo/blob/099be042fc88f0b0be3fa42862fa6fc8611953ec/client/public/logo.png?raw=true" width="150" height="150" alt="banner" />
  </a>
</h1>
<p align="center">
  <a href="./README_EN.md">English</a> | 中文 <br></p>
<div align="center">
</div>

# 游戏化任务管理系统

基于MERN技术栈(MongoDB, Express, React, Node.js)开发的任务管理系统，结合游戏化元素（如任务卡、装备槽、奖励机制）提升用户体验。

## 功能特性

### 核心功能
- ✅ 用户认证（注册/登录）
- ✅ 任务管理（创建/编辑/删除）
- ✅ 任务分类（短期/长期）
- ✅ 子任务系统（长期任务分解）
- ✅ 任务装备槽（每日3个槽位）

### 游戏化元素
- 🃏 卡片系统（空白卡、奖励卡）
- 🎯 每日卡片配额机制
- ⏳ 周期性卡片冷却
- 🏆 任务完成奖励加成

## 技术栈

### 前端
- React 18 + React Router 6
- Tailwind CSS + 自定义主题
- Axios HTTP客户端
- Framer Motion动画库

### 后端
- Express.js 服务框架
- MongoDB 数据库
- Mongoose ODM
- JWT 认证

## 快速启动

### 前置要求
- Node.js 16+
- MongoDB 4.4+

### 安装步骤
1. 克隆仓库
   ```bash
   git clone <仓库地址>
   ```

2. 安装依赖
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. 配置环境
    - 复制`.env.example`为`.env`并填写配置
    - 确保MongoDB服务已运行

4. 启动开发服务器
   ```bash
   # 后端
   cd server && npm run dev
   
   # 前端
   cd client && npm start
   ```

## 项目结构

```
├── client/            # 前端React应用
│   ├── public/        # 静态资源
│   └── src/           # 源码目录
│       ├── components/ # 可复用组件
│       ├── pages/      # 页面组件
│       └── services/   # API服务层
│
├── server/            # 后端Express服务
│   ├── config/        # 数据库配置
│   ├── controllers/   # 业务逻辑
│   ├── models/        # 数据模型
│   └── routes/        # API路由
└── README.md          # 项目文档
```

## 开发指南

### 常用命令
| 命令                | 作用                  |
|---------------------|----------------------|
| `npm run dev`       | 启动后端开发服务器    |
| `npm start`         | 启动前端开发服务器    |
| `npm test`          | 运行前端测试          |

### 扩展建议
- 添加更多卡片类型
- 实现成就系统
- 开发移动端适配

## 贡献说明
欢迎提交Issue和PR，请遵循现有代码风格。