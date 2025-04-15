# 游戏化任务管理系统实现文档

本文档详细描述了游戏化任务管理系统的实现过程，包括后端和前端的修改。

## 功能概述

本系统实现了以下功能：

1. **任务卡创建与分类**
   - 支持创建短期任务和长期任务
   - 任务可以设置类别、优先级等属性
   - 长期任务支持添加子任务

2. **任务卡展示与动态管理**
   - 每日任务槽界面，限制为3个任务槽
   - 长期任务链视图，展示任务分解后的各个阶段
   - 任务状态显示（待办、进行中、已完成、过期）

3. **任务装备与执行交互**
   - 支持将任务从任务仓库拖动到每日任务槽
   - 提供装备/卸下任务的功能
   - 任务完成时提供奖励反馈

4. **任务仓库的设计**
   - 存储尚未装备的任务卡
   - 支持任务归类、排序、搜索和预览

## 技术实现

### 后端修改

#### 1. 任务模型扩展 (server/models/Task.js)

扩展了Task模型，添加了以下字段：

- `type`: 任务类型（短期/长期）
- `category`: 任务分类
- `equipped`: 是否已装备到任务槽
- `slotPosition`: 任务槽位置
- `subTasks`: 长期任务的子任务数组

```javascript
// 子任务模型架构
const subTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['待完成', '进行中', '已完成'],
    default: '待完成',
  },
  dueDate: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
});

// 任务模型架构
const taskSchema = new mongoose.Schema(
  {
    // 原有字段...
    type: {
      type: String,
      enum: ['短期', '长期'],
      default: '短期',
    },
    status: {
      type: String,
      enum: ['待完成', '进行中', '已完成', '过期'],
      default: '待完成',
    },
    category: {
      type: String,
      trim: true,
      default: '默认',
    },
    equipped: {
      type: Boolean,
      default: false,
    },
    slotPosition: {
      type: Number,
      default: -1, // -1表示未装备到任务槽
    },
    subTasks: [subTaskSchema], // 长期任务的子任务
  },
  {
    timestamps: true,
  }
);
```

#### 2. 任务控制器扩展 (server/controllers/taskController.js)

添加了以下API端点：

- `getEquippedTasks`: 获取已装备的任务
- `equipTask`: 装备任务到任务槽
- `unequipTask`: 卸下已装备的任务

同时，更新了现有的API端点以支持新字段：

- `createTask`: 支持创建带有类型、分类和子任务的任务
- `updateTask`: 支持更新任务的类型、分类、装备状态和子任务

#### 3. 路由配置更新 (server/routes/taskRoutes.js)

添加了新的路由：

```javascript
// 获取已装备的任务
router.route('/equipped')
  .get(getEquippedTasks);

// 装备任务到任务槽
router.route('/:id/equip')
  .put(equipTask);

// 卸下已装备的任务
router.route('/:id/unequip')
  .put(unequipTask);
```

### 前端修改

#### 1. 任务服务扩展 (client/src/services/taskService.js)

添加了新的API调用方法：

- `getEquippedTasks`: 获取已装备的任务
- `equipTask`: 装备任务到任务槽
- `unequipTask`: 卸下已装备的任务

#### 2. 任务卡组件更新 (client/src/components/TaskCard.js)

更新了TaskCard组件，添加了对新字段和功能的支持：

- 显示任务类型（短期/长期）
- 显示任务分类
- 显示子任务（如果有）
- 添加装备/卸下按钮
- 支持拖拽功能

#### 3. 新组件创建

创建了以下新组件：

- **DailyTaskSlots.js**: 用于展示每日任务槽
  - 显示3个任务槽
  - 支持拖放任务到任务槽
  - 支持卸下已装备的任务

- **TaskChain.js**: 用于展示长期任务链
  - 按状态分组显示长期任务
  - 显示子任务进度条
  - 使用连接线展示任务链关系

- **TaskRepository.js**: 用于展示任务仓库
  - 显示未装备的任务
  - 支持按标题搜索、按分类和类型过滤
  - 支持排序功能
  - 支持拖拽任务到任务槽

- **TaskForm.js**: 用于创建和编辑任务
  - 支持设置任务类型、分类、优先级等属性
  - 对于长期任务，支持添加和删除子任务
  - 表单验证功能

#### 4. 任务页面更新 (client/src/pages/TasksPage.js)

完全重写了TasksPage组件，整合了所有新组件：

- 添加标签导航，支持切换不同视图（每日任务、长期任务链、任务仓库）
- 使用TaskForm组件替代原有的表单
- 添加成功消息提示
- 实现任务装备、卸下和拖放功能

## 使用说明

### 创建任务

1. 点击"创建新任务"按钮
2. 填写任务信息，包括标题、描述、类型、优先级、分类等
3. 如果是长期任务，可以添加子任务
4. 点击"创建任务"按钮提交

### 管理任务

1. **每日任务视图**
   - 查看已装备的任务
   - 将任务从仓库拖放到任务槽
   - 点击"装备"按钮将任务装备到空闲的任务槽
   - 点击"卸下"按钮将任务从任务槽卸下

2. **长期任务链视图**
   - 查看所有长期任务，按状态分组
   - 查看子任务进度

3. **任务仓库视图**
   - 查看所有未装备的任务
   - 使用搜索、过滤和排序功能找到特定任务
   - 将任务拖放到任务槽

### 任务操作

- 点击"完成"按钮标记任务为已完成
- 点击"编辑"按钮修改任务信息
- 点击"删除"按钮删除任务

## 启动应用

1. 启动后端服务器
   ```
   cd server
   npm run dev
   ```

2. 启动前端应用
   ```
   cd client
   npm start
   ```

## 注意事项

- 每日任务槽限制为3个，如果所有槽位已满，需要先卸下一个任务才能装备新任务
- 长期任务需要至少添加一个子任务
- 任务完成后会获得经验值和金币奖励
