import React from 'react';
import Modal from './Modal';
import TaskForm from './TaskForm';

const CreateTaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false,
  slotIndex = -1, // -1表示从主界面创建，>=0表示从特定任务槽创建
  initialData = null
}) => {
  const handleSubmit = async (formData) => {
    try {
      // 添加创建来源信息
      const taskData = {
        ...formData,
        fromSlot: slotIndex >= 0,
        slotIndex: slotIndex
      };
      
      await onSubmit(taskData);
      onClose(); // 提交成功后关闭模态框
    } catch (error) {
      console.error('创建任务失败:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={slotIndex >= 0 ? `创建任务到槽位 ${slotIndex + 1}` : '创建新任务'}
    >
      <div className="py-2">
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
