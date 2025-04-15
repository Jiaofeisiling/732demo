import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, ChartBarIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('login');

  const features = [
    {
      name: '任务游戏化',
      description: '将待办事项变成可收集的卡牌',
      icon: SparklesIcon,
    },
    {
      name: '进度追踪',
      description: '可视化你的成就成长轨迹',
      icon: ChartBarIcon,
    },
    {
      name: '知识管理',
      description: '建立你的数字任务图书馆',
      icon: BookOpenIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* 导航栏 */}
      <nav className="fixed w-full bg-black/30 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">TaskMaster</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                登录
              </Link>
              <Link 
                to="/register" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all"
              >
                立即开始
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* 左侧文字内容 */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <h1 className="text-5xl font-bold text-white leading-tight">
                把你的待办事项
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  变成可收集的卡牌
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                通过独特的卡牌收集系统，让任务管理变得像游戏一样有趣。完成目标、解锁成就、打造你的专属任务卡册。
              </p>
              
              {/* 功能亮点 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <motion.div 
                    key={feature.name}
                    whileHover={{ scale: 1.05 }}
                    className="p-6 bg-white/10 backdrop-blur-lg rounded-xl"
                  >
                    <feature.icon className="h-8 w-8 text-purple-400" />
                    <h3 className="mt-4 text-lg font-semibold text-white">{feature.name}</h3>
                    <p className="mt-2 text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA按钮 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <Link 
                  to="/register" 
                  className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg"
                >
                  <span>立即开始旅程</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* 右侧交互展示 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full" />
              <div className="relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl">
                <div className="border border-white/10 rounded-2xl p-6">
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`px-6 py-3 rounded-xl ${
                        activeTab === 'login' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      登录
                    </button>
                    <button
                      onClick={() => setActiveTab('register')}
                      className={`px-6 py-3 rounded-xl ${
                        activeTab === 'register' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      注册
                    </button>
                  </div>
                  
                  {activeTab === 'login' ? (
                    <LoginForm isEmbedded={true} />
                  ) : (
                    <RegisterForm isEmbedded={true} />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
