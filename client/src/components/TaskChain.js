import React from 'react';
import TaskCard from './TaskCard';

// 任务链组件（用于长期任务）
const TaskChain = ({ 
  tasks, 
  onComplete, 
  onDelete, 
  onEdit 
}) => {
  // 过滤出长期任务
  const longTermTasks = tasks.filter(task => task.type === '长期');

  // 根据任务状态对任务进行分组
  const groupedTasks = {
    '待完成': longTermTasks.filter(task => task.status === '待完成'),
    '进行中': longTermTasks.filter(task => task.status === '进行中'),
    '已完成': longTermTasks.filter(task => task.status === '已完成'),
    '过期': longTermTasks.filter(task => task.status === '过期'),
  };

  // 获取状态的颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '待完成':
        return 'bg-yellow-500';
      case '进行中':
        return 'bg-blue-500';
      case '已完成':
        return 'bg-green-500';
      case '过期':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 渲染任务链
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">长期任务链</h2>
      
      {longTermTasks.length === 0 ? (
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
          <p className="mt-2 text-gray-500">暂无长期任务</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            tasks.length > 0 && (
              <div key={status} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(status)} mr-2`}></div>
                  <h3 className="text-lg font-semibold">{status}</h3>
                  <div className="ml-2 bg-gray-200 rounded-full px-2 py-1 text-xs">
                    {tasks.length}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div key={task._id} className="relative">
                      {/* 任务卡片 */}
                      <TaskCard
                        task={task}
                        onComplete={onComplete}
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                      
                      {/* 子任务进度条 */}
                      {task.subTasks && task.subTasks.length > 0 && (
                        <div className="mt-2 mb-6">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>子任务进度</span>
                            <span>
                              {task.subTasks.filter(st => st.status === '已完成').length} / {task.subTasks.length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ 
                                width: `${(task.subTasks.filter(st => st.status === '已完成').length / task.subTasks.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* 连接线（除了最后一个任务） */}
                      {tasks.indexOf(task) < tasks.length - 1 && (
                        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskChain;
