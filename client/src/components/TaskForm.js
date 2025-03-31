import React, { useState, useEffect } from 'react';

// 任务表单组件
const TaskForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel,
  loading = false
}) => {
  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '短期',
    priority: '中',
    category: '默认',
    dueDate: '',
    experienceReward: 10,
    goldReward: 5,
    subTasks: []
  });

  // 子任务表单
  const [subTaskTitle, setSubTaskTitle] = useState('');
  const [subTaskDueDate, setSubTaskDueDate] = useState('');

  // 表单验证错误
  const [errors, setErrors] = useState({});

  // 如果有初始数据，则填充表单
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || '短期',
        priority: initialData.priority || '中',
        category: initialData.category || '默认',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
        experienceReward: initialData.experienceReward || 10,
        goldReward: initialData.goldReward || 5,
        subTasks: initialData.subTasks || []
      });
    }
  }, [initialData]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // 添加子任务
  const handleAddSubTask = () => {
    if (!subTaskTitle.trim()) {
      setErrors({
        ...errors,
        subTaskTitle: '请输入子任务标题'
      });
      return;
    }
    
    const newSubTask = {
      title: subTaskTitle,
      status: '待完成',
      dueDate: subTaskDueDate || null
    };
    
    setFormData({
      ...formData,
      subTasks: [...formData.subTasks, newSubTask]
    });
    
    // 重置子任务表单
    setSubTaskTitle('');
    setSubTaskDueDate('');
    setErrors({
      ...errors,
      subTaskTitle: null
    });
  };

  // 删除子任务
  const handleRemoveSubTask = (index) => {
    const updatedSubTasks = [...formData.subTasks];
    updatedSubTasks.splice(index, 1);
    
    setFormData({
      ...formData,
      subTasks: updatedSubTasks
    });
  };

  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入任务标题';
    }
    
    if (formData.type === '长期' && formData.subTasks.length === 0) {
      newErrors.subTasks = '长期任务至少需要一个子任务';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card mb-8">
      <h2 className="text-lg font-semibold mb-4">
        {initialData ? '编辑任务' : '创建新任务'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 任务标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务标题 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* 任务类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务类型
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="短期">短期</option>
              <option value="长期">长期</option>
            </select>
          </div>
          
          {/* 优先级 */}
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
          
          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* 截止日期 */}
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
          
          {/* 奖励 */}
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
        
        {/* 任务描述 */}
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
        
        {/* 子任务（仅长期任务） */}
        {formData.type === '长期' && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium mb-3">子任务</h3>
            
            {errors.subTasks && (
              <p className="mb-2 text-sm text-red-500">{errors.subTasks}</p>
            )}
            
            {/* 子任务列表 */}
            {formData.subTasks.length > 0 && (
              <ul className="mb-4 space-y-2">
                {formData.subTasks.map((subTask, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                    <div>
                      <span className="font-medium">{subTask.title}</span>
                      {subTask.dueDate && (
                        <span className="ml-2 text-xs text-gray-500">
                          截止: {new Date(subTask.dueDate).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubTask(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            {/* 添加子任务表单 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={subTaskTitle}
                  onChange={(e) => setSubTaskTitle(e.target.value)}
                  placeholder="输入子任务标题"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.subTaskTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.subTaskTitle && (
                  <p className="mt-1 text-sm text-red-500">{errors.subTaskTitle}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={subTaskDueDate}
                  onChange={(e) => setSubTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubTask}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 提交按钮 */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? '处理中...' : initialData ? '更新任务' : '创建任务'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
