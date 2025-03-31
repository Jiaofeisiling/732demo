import React, { useState } from 'react';
import TaskCard from './TaskCard';

// 任务仓库组件
const TaskRepository = ({ 
  tasks, 
  onComplete, 
  onDelete, 
  onEdit, 
  onEquip 
}) => {
  // 过滤出未装备的任务
  const unequippedTasks = tasks.filter(task => !task.equipped);
  
  // 状态：搜索关键词、分类和排序
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // 获取所有任务的分类
  const categories = ['全部', ...new Set(unequippedTasks.map(task => task.category))];
  
  // 任务类型
  const taskTypes = ['全部', '短期', '长期'];

  // 处理拖拽开始
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
    e.currentTarget.classList.add('opacity-50');
  };

  // 处理拖拽结束
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  // 过滤和排序任务
  const filteredAndSortedTasks = unequippedTasks
    .filter(task => {
      // 搜索过滤
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // 分类过滤
      if (selectedCategory !== '全部' && task.category !== selectedCategory) {
        return false;
      }
      
      // 类型过滤
      if (selectedType !== '全部' && task.type !== selectedType) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // 排序
      let valueA, valueB;
      
      if (sortBy === 'dueDate') {
        valueA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
        valueB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
      } else if (sortBy === 'priority') {
        const priorityValue = { '高': 3, '中': 2, '低': 1 };
        valueA = priorityValue[a.priority];
        valueB = priorityValue[b.priority];
      } else if (sortBy === 'experienceReward') {
        valueA = a.experienceReward;
        valueB = b.experienceReward;
      } else {
        valueA = new Date(a[sortBy]);
        valueB = new Date(b[sortBy]);
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">任务仓库</h2>
      
      {/* 搜索和过滤控件 */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* 搜索框 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              搜索任务
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="输入任务标题..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* 分类过滤 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* 类型过滤 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务类型
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {taskTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* 排序方式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序方式
            </label>
            <div className="flex">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="createdAt">创建时间</option>
                <option value="dueDate">截止日期</option>
                <option value="priority">优先级</option>
                <option value="experienceReward">经验值奖励</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md bg-gray-50 hover:bg-gray-100"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 任务列表 */}
      {filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-2 text-gray-500">没有找到匹配的任务</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTasks.map(task => (
            <div 
              key={task._id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              onDragEnd={handleDragEnd}
            >
              <TaskCard
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
                onEdit={onEdit}
                onEquip={onEquip}
                draggable={true}
                onDragStart={handleDragStart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskRepository;
