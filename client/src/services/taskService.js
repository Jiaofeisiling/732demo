import axios from 'axios';

// 创建一个带有认证token的请求配置
const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 获取所有任务
export const getTasks = async (token) => {
  try {
    const { data } = await axios.get('/api/tasks', getConfig(token));
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '获取任务失败'
    );
  }
};

// 获取已装备的任务
export const getEquippedTasks = async (token) => {
  try {
    const { data } = await axios.get('/api/tasks/equipped', getConfig(token));
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '获取已装备任务失败'
    );
  }
};

// 创建新任务
export const createTask = async (taskData, token) => {
  try {
    // 先调用卡片消耗接口
    const consumeResponse = await axios.post(
      '/api/cards/consume',
      {
        cardId: taskData.cardId,
        taskData: taskData
      },
      getConfig(token)
    );

    if (!consumeResponse.data.success) {
      throw new Error(consumeResponse.data.error || '卡片消耗失败');
    }

    // 使用处理后的任务数据创建任务
    const { data } = await axios.post(
      '/api/tasks', 
      consumeResponse.data.processedTask,
      getConfig(token)
    );
    
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '创建任务失败'
    );
  }
};

// 获取单个任务
export const getTaskById = async (id, token) => {
  try {
    const { data } = await axios.get(`/api/tasks/${id}`, getConfig(token));
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '获取任务详情失败'
    );
  }
};

// 更新任务
export const updateTask = async (id, taskData, token) => {
  try {
    const { data } = await axios.put(`/api/tasks/${id}`, taskData, getConfig(token));
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '更新任务失败'
    );
  }
};

// 删除任务
export const deleteTask = async (id, token) => {
  try {
    const { data } = await axios.delete(`/api/tasks/${id}`, getConfig(token));
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '删除任务失败'
    );
  }
};

// 完成任务
export const completeTask = async (id, token) => {
  try {
    const { data } = await axios.put(
      `/api/tasks/${id}`,
      { status: '已完成' },
      getConfig(token)
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '完成任务失败'
    );
  }
};

// 装备任务到任务槽
export const equipTask = async (id, slotPosition, token) => {
  try {
    const { data } = await axios.put(
      `/api/tasks/${id}/equip`,
      { slotPosition },
      getConfig(token)
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '装备任务失败'
    );
  }
};

// 卸下已装备的任务
export const unequipTask = async (id, token) => {
  try {
    const { data } = await axios.put(
      `/api/tasks/${id}/unequip`,
      {},
      getConfig(token)
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : '卸下任务失败'
    );
  }
};
