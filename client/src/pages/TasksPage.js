import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import AuthContext from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask, completeTask } from '../services/taskService';

const TasksPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '中',
    dueDate: '',
    experienceReward: 10,
    goldReward: 5,
  });

  // 获取任务数据
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(user.token);
      setTasks(data);
      setError('');
    } catch (error) {
      setError('获取任务数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchTasks();
    }
  }, [user]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingTask) {
        // 更新任务
        await updateTask(editingTask._id, formData, user.token);
      } else {
        // 创建新任务
        await createTask(formData, user.token);
      }
      
      // 重新获取任务列表
      await fetchTasks();
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        priority: '中',
        dueDate: '',
        experienceReward: 10,
        goldReward: 5,
      });
      
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      setError(editingTask ? '更新任务失败' : '创建任务失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑任务
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      experienceReward: task.experienceReward,
      goldReward: task.goldReward,
    });
    setShowForm(true);
  };

  // 处理完成任务
  const handleComplete = async (id) => {
    try {
      setLoading(true);
      await completeTask(id, user.token);
      await fetchTasks();
    } catch (error) {
      setError('完成任务失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理删除任务
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      try {
        setLoading(true);
        await deleteTask(id, user.token);
        await fetchTasks();
      } catch (error) {
        setError('删除任务失败');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 处理过滤变化
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // 处理排序变化
  const handleSortChange = (e) => {
    const { value } = e.target;
    setSortBy(value);
  };

  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // 过滤和排序任务
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      // 状态过滤
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      
      // 优先级过滤
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
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
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">我的任务</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingTask(null);
                setFormData({
                  title: '',
                  description: '',
                  priority: '中',
                  dueDate: '',
                  experienceReward: 10,
                  goldReward: 5,
                });
              }
            }}
            className="btn-primary"
          >
            {showForm ? '取消' : '创建新任务'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* 任务表单 */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-lg font-semibold mb-4">
              {editingTask ? '编辑任务' : '创建新任务'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    任务标题 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优先级
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="低">低</option>
                    <option value="中">中</option>
                    <option value="高">高</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    截止日期
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      经验值奖励
                    </label>
                    <input
                      type="number"
                      name="experienceReward"
                      value={formData.experienceReward}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      金币奖励
                    </label>
                    <input
                      type="number"
                      name="goldReward"
                      value={formData.goldReward}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  任务描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? '处理中...' : editingTask ? '更新任务' : '创建任务'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 过滤和排序控件 */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态过滤
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">全部</option>
                <option value="待完成">待完成</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                优先级过滤
              </label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">全部</option>
                <option value="低">低</option>
                <option value="中">中</option>
                <option value="高">高</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序方式
              </label>
              <div className="flex">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="createdAt">创建时间</option>
                  <option value="dueDate">截止日期</option>
                  <option value="priority">优先级</option>
                  <option value="experienceReward">经验值奖励</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md bg-gray-50 hover:bg-gray-100"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 任务列表 */}
        {loading && !showForm ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : filteredAndSortedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
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
            <p className="mt-2 text-gray-500">暂无任务</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 btn-primary-outline"
            >
              创建第一个任务
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
