import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 简单的表单验证
    if (!email || !password) {
      setError('请填写所有字段');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // 调用登录函数
      await login(email, password);
      
      // 登录成功后跳转到仪表盘
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : '登录失败，请检查您的凭据'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="max-w-md mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            登录
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                邮箱
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的邮箱"
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                密码
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入您的密码"
                required
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </div>
            
            <div className="text-center text-gray-600">
              还没有账号？{' '}
              <Link to="/register" className="text-primary-600 hover:underline">
                注册
              </Link>
            </div>
          </form>
        </div>

        {/* 演示账号信息 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">演示账号</h3>
          <p className="text-blue-700 mb-1">邮箱: demo@example.com</p>
          <p className="text-blue-700">密码: password123</p>
          <p className="text-sm text-blue-600 mt-2">
            注意: 这只是一个演示账号，实际应用中不会显示此信息。
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
