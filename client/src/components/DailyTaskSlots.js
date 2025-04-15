import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';

// 每日任务槽组件
const DailyTaskSlots = ({ 
  equippedTasks, 
  onComplete, 
  onDelete, 
  onEdit, 
  onUnequip,
  onDrop,
  onCreateTask
}) => {
  // 创建3个任务槽
  const [slots, setSlots] = useState([null, null, null]);

  // 当已装备任务变化时，更新任务槽
  useEffect(() => {
    const newSlots = [null, null, null];
    
    equippedTasks.forEach(task => {
      if (task.slotPosition >= 0 && task.slotPosition < 3) {
        newSlots[task.slotPosition] = task;
      }
    });
    
    setSlots(newSlots);
  }, [equippedTasks]);

  // 处理拖拽进入
  const handleDragOver = (e, slotIndex) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  };

  // 处理拖拽离开
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  // 处理放置
  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    
    try {
      const taskData = JSON.parse(e.dataTransfer.getData('task'));
      if (taskData && onDrop) {
        onDrop(taskData._id, slotIndex);
      }
    } catch (error) {
      console.error('拖放任务时出错:', error);
    }
  };

  // 渲染任务槽
  const renderSlot = (task, index) => {
    return (
      <div 
        key={index}
        className="task-slot border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex items-center justify-center"
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
      >
        {task ? (
          <TaskCard 
            task={task} 
            onComplete={onComplete}
            onDelete={onDelete}
            onEdit={onEdit}
            onUnequip={onUnequip}
            isEquipped={true}
          />
        ) : (
          <button
            onClick={() => onCreateTask(index)}
            className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mb-2 transform group-hover:scale-110 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            <p>点击创建新任务</p>
            <p className="text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              或拖放现有任务到此处
            </p>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">每日任务槽</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slots.map((task, index) => renderSlot(task, index))}
      </div>
    </div>
  );
};

export default DailyTaskSlots;
