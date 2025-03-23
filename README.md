# MERN 架构演示 - 任务管理系统

这是一个基于MERN (MongoDB, Express.js, React, Node.js) 技术栈的任务管理系统演示项目。该项目展示了MERN架构的核心组件和它们之间的交互方式，同时集成了JWT认证、Tailwind CSS和游戏化元素。


## 详细项目结构

```
732demo/
├── client/                  # 前端React应用
│   ├── public/              # 静态资源
│   │   ├── index.html       # HTML入口文件
│   │   └── manifest.json    # PWA配置
│   ├── src/                 # React源代码
│   │   ├── components/      # 可复用组件
│   │   │   ├── Navbar.js    # 导航栏组件
│   │   │   └── TaskCard.js  # 任务卡片组件
│   │   ├── pages/           # 页面组件
│   │   │   ├── HomePage.js          # 首页
│   │   │   ├── LoginPage.js         # 登录页
│   │   │   ├── RegisterPage.js      # 注册页
│   │   │   ├── DashboardPage.js     # 仪表盘页
│   │   │   ├── TasksPage.js         # 任务列表页
│   │   │   ├── ProfilePage.js       # 个人资料页
│   │   │   └── NotFoundPage.js      # 404页面
│   │   ├── context/         # 上下文(用于状态管理)
│   │   │   └── AuthContext.js       # 认证上下文
│   │   ├── services/        # API服务
│   │   │   └── taskService.js       # 任务API服务
│   │   ├── App.js           # 主应用组件
│   │   ├── index.js         # 入口文件
│   │   └── index.css        # 全局样式(包含Tailwind指令)
│   ├── package.json         # 前端依赖
│   └── tailwind.config.js   # Tailwind配置
│
├── server/                  # 后端Node.js/Express应用
│   ├── config/              # 配置文件
│   │   └── db.js            # MongoDB连接配置
│   ├── controllers/         # 控制器
│   │   ├── userController.js  # 用户相关控制器
│   │   └── taskController.js  # 任务相关控制器
│   ├── middleware/          # 中间件
│   │   └── auth.js          # JWT认证中间件
│   ├── models/              # MongoDB模型
│   │   ├── User.js          # 用户模型
│   │   └── Task.js          # 任务模型
│   ├── routes/              # API路由
│   │   ├── userRoutes.js    # 用户相关路由
│   │   └── taskRoutes.js    # 任务相关路由
│   ├── utils/               # 工具函数
│   ├── server.js            # 服务器入口文件
│   └── package.json         # 后端依赖
│
└── README.md                # 项目说明
```

## 技术栈详解

### 后端技术
- **MongoDB**: NoSQL数据库，用于存储用户数据、任务等
  - 使用Mongoose ODM进行数据建模和验证
  - 实现了用户和任务的数据模型
- **Express.js**: Node.js Web应用框架，处理后端API
  - RESTful API设计
  - 中间件架构
  - 错误处理机制
- **Node.js**: JavaScript运行时环境，运行服务器端代码
  - 异步I/O操作
  - 事件驱动架构
- **JWT (JSON Web Token)**: 用于用户认证和授权
  - 无状态认证机制
  - 安全的信息传输
  - 基于Token的用户会话管理

### 前端技术
- **React**: 前端JavaScript库，构建用户界面
  - 组件化架构
  - 虚拟DOM
  - 单向数据流
- **React Router**: 客户端路由管理
  - 声明式路由
  - 嵌套路由
  - 路由保护
- **Context API**: 状态管理
  - 全局状态共享
  - 避免prop drilling
- **Tailwind CSS**: 实用优先的CSS框架
  - 原子化CSS类
  - 响应式设计
  - 主题定制
- **Axios**: 基于Promise的HTTP客户端
  - 请求/响应拦截
  - 错误处理
  - 请求取消

## 功能详解

### 用户认证系统
- **注册**: 新用户可以创建账号
  - 用户名、邮箱和密码验证
  - 密码加密存储
- **登录**: 已注册用户可以登录
  - JWT认证
  - 安全的会话管理
- **个人资料**: 用户可以查看和编辑个人信息

### 任务管理系统
- **任务创建**: 用户可以创建新任务
  - 设置标题、描述、优先级和截止日期
  - 自定义奖励(经验值和金币)
- **任务列表**: 查看所有任务
  - 按状态、优先级等筛选
  - 排序功能
- **任务详情**: 查看单个任务的详细信息
- **任务编辑**: 修改任务信息
- **任务完成**: 标记任务为已完成
  - 自动奖励经验值和金币
- **任务删除**: 删除不需要的任务

### 游戏化元素
- **经验值系统**: 完成任务获得经验值
- **金币系统**: 完成任务获得金币奖励
- **进度追踪**: 任务完成率统计
- **成就系统**: 基于用户活动的成就解锁

### AI功能展示
- **智能任务推荐**: 基于用户习惯推荐任务
- **任务优先级建议**: AI分析帮助用户确定任务优先级
- **学习模式建议**: 基于用户数据提供学习建议

## API端点详解

### 用户相关
- `POST /api/users/register` - 用户注册
  - 请求体: `{ username, email, password }`
  - 响应: 用户信息和JWT token
- `POST /api/users/login` - 用户登录
  - 请求体: `{ email, password }`
  - 响应: 用户信息和JWT token
- `GET /api/users/profile` - 获取用户资料
  - 请求头: `Authorization: Bearer <token>`
  - 响应: 用户详细信息
- `PUT /api/users/profile` - 更新用户资料
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ username, email, password }`
  - 响应: 更新后的用户信息

### 任务相关
- `GET /api/tasks` - 获取当前用户的所有任务
  - 请求头: `Authorization: Bearer <token>`
  - 响应: 任务列表
- `POST /api/tasks` - 创建新任务
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ title, description, priority, dueDate, experienceReward, goldReward }`
  - 响应: 创建的任务信息
- `GET /api/tasks/:id` - 获取单个任务详情
  - 请求头: `Authorization: Bearer <token>`
  - 响应: 任务详细信息
- `PUT /api/tasks/:id` - 更新任务
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ title, description, status, priority, dueDate, experienceReward, goldReward }`
  - 响应: 更新后的任务信息
- `DELETE /api/tasks/:id` - 删除任务
  - 请求头: `Authorization: Bearer <token>`
  - 响应: 删除确认信息

## 安装与运行详解

### 环境要求
- Node.js (v14+)
- MongoDB (v4+)
- npm或yarn

### 后端设置
```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 启动服务器
npm start
```

### 前端设置
```bash
# 进入前端目录
cd client

# 安装依赖
npm install

# 启动开发服务器
npm start

## 项目扩展方向

### 功能扩展
- 社交功能: 好友系统、任务分享
- 团队协作: 团队任务、角色分配
- 高级统计: 详细的任务完成分析、时间追踪
- 通知系统: 邮件提醒、浏览器通知

### 技术扩展
- TypeScript集成: 类型安全
- Redux状态管理: 更复杂的状态处理
- 单元测试: Jest, React Testing Library
- CI/CD流程: 自动化测试和部署
- 容器化: Docker部署

## 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

