import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, loading, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    taskCount: 0,
    completedTasks: 0,
    completionRate: 0,
  });

  // 当用户数据加载时，填充表单
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  // 模拟获取用户统计数据
  useEffect(() => {
    // 在实际应用中，这里应该从API获取数据
    // 这里使用模拟数据
    if (user) {
      setStats({
        taskCount: 24,
        completedTasks: 18,
        completionRate: 75,
      });
    }
  }, [user]);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);

    // 验证密码
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('两次输入的密码不一致');
      return;
    }

    try {
      // 准备更新数据
      const updateData = {
        username: formData.username,
        email: formData.email,
      };

      // 只有当密码字段有值时才包含密码
      if (formData.password) {
        updateData.password = formData.password;
      }

      // 调用更新个人资料API
      await updateProfile(updateData);
      
      // 清空密码字段
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
      
      setSuccess(true);
    } catch (err) {
      setFormError('更新个人资料失败');
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">个人资料</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 个人资料表单 */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">编辑个人资料</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {formError}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  个人资料更新成功！
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密码 (留空则保持不变)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? '更新中...' : '更新个人资料'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 用户信息卡片 */}
          <div className="lg:col-span-1">
            <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white mb-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white text-primary-600 flex items-center justify-center text-3xl font-bold mb-4">
                  {user && user.username ? user.username.charAt(0).toUpperCase() : '?'}
                </div>
                <h2 className="text-xl font-bold mb-1">{user && user.username}</h2>
                <p className="text-primary-100 mb-4">{user && user.email}</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user && user.experience}</div>
                    <div className="text-sm text-primary-100">经验值</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user && user.gold}</div>
                    <div className="text-sm text-primary-100">金币</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">任务统计</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">总任务数</span>
                    <span className="text-sm font-medium text-gray-700">{stats.taskCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">已完成任务</span>
                    <span className="text-sm font-medium text-gray-700">{stats.completedTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(stats.completedTasks / stats.taskCount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">完成率</span>
                    <span className="text-sm font-medium text-gray-700">{stats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 成就展示区 */}
        <div className="card mt-8">
          <h2 className="text-lg font-semibold mb-4">我的成就</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 成就项 - 已解锁 */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">初学者</h3>
              <p className="text-sm text-yellow-100">完成第一个任务</p>
            </div>

            {/* 成就项 - 已解锁 */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">高效达人</h3>
              <p className="text-sm text-green-100">一天内完成5个任务</p>
            </div>

            {/* 成就项 - 未解锁 */}
            <div className="bg-gray-300 text-gray-600 rounded-lg p-4 text-center opacity-60">
              <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">任务大师</h3>
              <p className="text-sm">完成50个任务</p>
            </div>

            {/* 成就项 - 未解锁 */}
            <div className="bg-gray-300 text-gray-600 rounded-lg p-4 text-center opacity-60">
              <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">闪电侠</h3>
              <p className="text-sm">提前完成10个任务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
