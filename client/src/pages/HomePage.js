import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Demo Example
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            一个基于MERN技术栈的游戏化任务管理系统，帮助你更有效地管理学习和生活任务。
          </p>
          
          <div className="mt-8 flex justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center"
              >
                进入仪表盘
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="btn-primary">
                  登录
                </Link>
                <Link to="/register" className="btn-secondary">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            主要功能
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-primary-600 text-3xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
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
              <h3 className="text-xl font-semibold mb-2">任务管理</h3>
              <p className="text-gray-600">
                创建、编辑和删除任务，设置优先级和截止日期，跟踪任务完成情况。
              </p>
            </div>

            <div className="card">
              <div className="text-primary-600 text-3xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
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
              <h3 className="text-xl font-semibold mb-2">游戏化激励</h3>
              <p className="text-gray-600">
                完成任务获得经验值和金币奖励，提高学习和工作的积极性。
              </p>
            </div>

            <div className="card">
              <div className="text-primary-600 text-3xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
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
              <h3 className="text-xl font-semibold mb-2">AI辅助</h3>
              <p className="text-gray-600">
                利用人工智能技术，智能分析用户数据，提供个性化的任务管理建议。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            技术栈
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-gray-600">
            <span className="px-4 py-2 bg-white rounded-full shadow-sm">MongoDB</span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm">Express.js</span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm">React</span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm">Node.js</span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm">JWT</span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm">Tailwind CSS</span>
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} 任务管理系统 | MERN架构演示项目
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
