import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';
import { getTasks } from '../services/taskService';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
  });

  // 获取任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks(user.token);
        setTasks(data);
        
        // 计算统计数据
        const completed = data.filter((task) => task.status === '已完成').length;
        const pending = data.filter((task) => task.status === '待完成').length;
        const inProgress = data.filter((task) => task.status === '进行中').length;
        const highPriority = data.filter((task) => task.priority === '高').length;
        
        setStats({
          total: data.length,
          completed,
          pending,
          inProgress,
          highPriority,
        });
      } catch (error) {
        setError('获取任务数据失败');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchTasks();
    }
  }, [user]);

  // 计算完成率
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  // 获取最近的任务
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // 获取即将到期的任务
  const upcomingTasks = tasks
    .filter((task) => task.status !== '已完成' && task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <Link to="/tasks" className="btn-primary">
            查看所有任务
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-white border-l-4 border-primary-500">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary-600"
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
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">总任务数</p>
                    <p className="text-xl font-semibold">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-white border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">已完成任务</p>
                    <p className="text-xl font-semibold">{stats.completed}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-white border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">待完成任务</p>
                    <p className="text-xl font-semibold">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-white border-l-4 border-red-500">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">高优先级任务</p>
                    <p className="text-xl font-semibold">{stats.highPriority}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 完成率进度条 */}
            <div className="card mb-8">
              <h2 className="text-lg font-semibold mb-4">任务完成率</h2>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary-600 h-4 rounded-full"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <div className="mt-2 text-right text-sm text-gray-500">
                {completionRate.toFixed(1)}%
              </div>
            </div>

            {/* 用户信息卡片 */}
            <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold mb-2">欢迎回来，{user.username}！</h2>
                  <p className="opacity-80">继续努力完成你的任务吧！</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{user.experience}</div>
                  <div className="text-sm opacity-80">经验值</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{user.gold}</div>
                  <div className="text-sm opacity-80">金币</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 最近添加的任务 */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">最近添加的任务</h2>
                {recentTasks.length > 0 ? (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === '已完成'
                              ? 'bg-green-100 text-green-800'
                              : task.status === '进行中'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">暂无任务</p>
                )}
              </div>

              {/* 即将到期的任务 */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">即将到期的任务</h2>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">
                            截止日期: {new Date(task.dueDate).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === '高'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === '中'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority}优先级
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">暂无即将到期的任务</p>
                )}
              </div>
            </div>

            {/* AI助手提示 */}
            <div className="card mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <div className="flex items-start">
                <div className="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2">AI助手提示</h2>
                  <p className="opacity-90">
                    根据您的任务完成情况，建议您优先处理高优先级任务，并合理安排时间完成即将到期的任务。
                  </p>
                  <p className="mt-2 opacity-90">
                    您的任务完成率为{completionRate.toFixed(1)}%，继续保持！
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
