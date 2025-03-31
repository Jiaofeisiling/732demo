import React from 'react';

// 任务卡片组件
const TaskCard = ({ 
  task, 
  onComplete, 
  onDelete, 
  onEdit, 
  onEquip, 
  onUnequip, 
  draggable = false,
  onDragStart,
  isEquipped = false
}) => {
  // 根据任务状态设置不同的样式
  const getStatusClass = (status) => {
    switch (status) {
      case '待完成':
        return 'bg-yellow-100 text-yellow-800';
      case '进行中':
        return 'bg-blue-100 text-blue-800';
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '过期':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 根据任务优先级设置不同的样式
  const getPriorityClass = (priority) => {
    switch (priority) {
      case '高':
        return 'bg-red-100 text-red-800';
      case '中':
        return 'bg-orange-100 text-orange-800';
      case '低':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 根据任务类型设置不同的样式
  const getTypeClass = (type) => {
    switch (type) {
      case '短期':
        return 'bg-purple-100 text-purple-800';
      case '长期':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '无截止日期';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 渲染子任务（如果有）
  const renderSubTasks = () => {
    if (!task.subTasks || task.subTasks.length === 0) return null;
    
    return (
      <div className="mt-3 border-t pt-3">
        <h4 className="text-sm font-medium mb-2">子任务:</h4>
        <ul className="text-sm">
          {task.subTasks.map((subTask, index) => (
            <li key={index} className="flex items-center mb-1">
              <span className={`w-2 h-2 rounded-full mr-2 ${getStatusClass(subTask.status)}`}></span>
              <span>{subTask.title}</span>
              {subTask.dueDate && (
                <span className="ml-2 text-xs text-gray-500">
                  ({formatDate(subTask.dueDate)})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div 
      className={`card mb-4 hover:shadow-lg transition-shadow duration-300 ${isEquipped ? 'border-2 border-blue-500' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart ? (e) => onDragStart(e, task) : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <div className="flex space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
              task.status
            )}`}
          >
            {task.status}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
              task.priority
            )}`}
          >
            {task.priority}优先级
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeClass(
              task.type
            )}`}
          >
            {task.type}
          </span>
        </div>
      </div>

      {task.category && (
        <div className="text-sm text-gray-500 mb-2">
          分类: {task.category}
        </div>
      )}

      <p className="text-gray-600 mb-3">{task.description || '无描述'}</p>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <div>截止日期: {formatDate(task.dueDate)}</div>
        <div className="flex space-x-2">
          <div>经验值: +{task.experienceReward}</div>
          <div>金币: +{task.goldReward}</div>
        </div>
      </div>

      {renderSubTasks()}

      <div className="flex justify-end space-x-2 mt-4">
        {task.status !== '已完成' && (
          <button
            onClick={() => onComplete(task._id)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            完成
          </button>
        )}
        
        {onEquip && !isEquipped && (
          <button
            onClick={() => onEquip(task)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
          >
            装备
          </button>
        )}
        
        {onUnequip && isEquipped && (
          <button
            onClick={() => onUnequip(task._id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            卸下
          </button>
        )}
        
        <button
          onClick={() => onEdit(task)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          编辑
        </button>
        
        <button
          onClick={() => onDelete(task._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          删除
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
