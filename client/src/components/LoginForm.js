import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginForm = ({ isEmbedded = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('请填写所有字段');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
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

  const inputClasses = isEmbedded
    ? 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
    : 'form-input';

  const labelClasses = isEmbedded
    ? 'block text-gray-300 font-medium mb-2'
    : 'block text-gray-700 font-medium mb-2';

  const buttonClasses = isEmbedded
    ? 'w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-200'
    : 'btn-primary w-full';

  return (
    <div>
      {error && (
        <div className={`px-4 py-3 rounded mb-4 ${
          isEmbedded 
            ? 'bg-red-900/50 border border-red-500/50 text-red-200'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClasses}>
            邮箱
          </label>
          <input
            type="email"
            id="email"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入您的邮箱"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className={labelClasses}>
            密码
          </label>
          <input
            type="password"
            id="password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入您的密码"
            required
          />
        </div>
        
        <button
          type="submit"
          className={buttonClasses}
          disabled={isLoading}
        >
          {isLoading ? '登录中...' : '登录'}
        </button>

        {isEmbedded && (
          <div className="text-sm text-gray-400 mt-4">
            <p>演示账号：demo@example.com</p>
            <p>密码：password123</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
