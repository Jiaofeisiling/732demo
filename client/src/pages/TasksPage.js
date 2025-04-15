import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import DailyTaskSlots from '../components/DailyTaskSlots';
import TaskChain from '../components/TaskChain';
import TaskRepository from '../components/TaskRepository';
import AuthContext from '../context/AuthContext';
import { 
  getTasks, 
  getEquippedTasks,
  createTask, 
  updateTask, 
  deleteTask, 
  completeTask,
  equipTask,
  unequipTask
} from '../services/taskService';

const TasksPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [equippedTasks, setEquippedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [createSlotIndex, setCreateSlotIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'longterm', 'repository'
  const [successMessage, setSuccessMessage] = useState('');

  // 获取任务数据
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [allTasks, equipped] = await Promise.all([
        getTasks(user.token),
        getEquippedTasks(user.token)
      ]);
      setTasks(allTasks);
      setEquippedTasks(equipped);
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

  // 显示成功消息
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // 处理表单提交
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (editingTask) {
        // 更新任务
        await updateTask(editingTask._id, formData, user.token);
        showSuccess('任务已更新');
      } else {
        // 创建新任务
        const response = await createTask(formData, user.token);
        
        // 如果是从任务槽创建，直接装备到对应槽位
        if (formData.fromSlot && formData.slotIndex >= 0) {
          await equipTask(response._id, formData.slotIndex, user.token);
          showSuccess('任务已创建并装备到任务槽');
        } else {
          showSuccess('任务已创建并存储到仓库');
        }
      }
      
      // 重新获取任务列表
      await fetchTasks();
      
      setShowForm(false);
      setEditingTask(null);
      setCreateSlotIndex(-1);
    } catch (error) {
      setError(editingTask ? '更新任务失败' : '创建任务失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理从任务槽创建任务
  const handleCreateFromSlot = (slotIndex) => {
    setCreateSlotIndex(slotIndex);
    setShowForm(true);
  };

  // 处理编辑任务
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // 处理完成任务
  const handleComplete = async (id) => {
    try {
      setLoading(true);
      await completeTask(id, user.token);
      showSuccess('任务已完成，获得奖励！');
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
        showSuccess('任务已删除');
        await fetchTasks();
      } catch (error) {
        setError('删除任务失败');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 处理装备任务
  const handleEquip = async (task) => {
    try {
      // 找到第一个空闲的任务槽
      const occupiedSlots = equippedTasks.map(t => t.slotPosition);
      let slotToUse = -1;
      
      for (let i = 0; i < 3; i++) {
        if (!occupiedSlots.includes(i)) {
          slotToUse = i;
          break;
        }
      }
      
      if (slotToUse === -1) {
        setError('所有任务槽已满，请先卸下一个任务');
        return;
      }
      
      setLoading(true);
      await equipTask(task._id, slotToUse, user.token);
      showSuccess('任务已装备到任务槽');
      await fetchTasks();
    } catch (error) {
      setError('装备任务失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理卸下任务
  const handleUnequip = async (id) => {
    try {
      setLoading(true);
      await unequipTask(id, user.token);
      showSuccess('任务已卸下');
      await fetchTasks();
    } catch (error) {
      setError('卸下任务失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理拖放到任务槽
  const handleDropToSlot = async (taskId, slotIndex) => {
    try {
      setLoading(true);
      await equipTask(taskId, slotIndex, user.token);
      showSuccess('任务已装备到任务槽');
      await fetchTasks();
    } catch (error) {
      setError('装备任务失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 渲染活动标签内容
  const renderActiveTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'daily':
        return (
          <>
            <DailyTaskSlots 
              equippedTasks={equippedTasks}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onUnequip={handleUnequip}
              onDrop={handleDropToSlot}
              onCreateTask={handleCreateFromSlot}
            />
            
            <TaskRepository 
              tasks={tasks}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onEquip={handleEquip}
            />
          </>
        );
      case 'longterm':
        return (
          <TaskChain 
            tasks={tasks}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        );
      case 'repository':
        return (
          <TaskRepository 
            tasks={tasks}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onEquip={handleEquip}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">我的任务</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>创建新任务</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* 创建任务模态框 */}
        <CreateTaskModal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
            setCreateSlotIndex(-1);
          }}
          onSubmit={handleSubmit}
          loading={loading}
          initialData={editingTask}
          slotIndex={createSlotIndex}
        />

        {/* 标签导航 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('daily')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'daily'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              每日任务
            </button>
            <button
              onClick={() => setActiveTab('longterm')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'longterm'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              长期任务链
            </button>
            <button
              onClick={() => setActiveTab('repository')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'repository'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              任务仓库
            </button>
          </nav>
        </div>

        {/* 活动标签内容 */}
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default TasksPage;
