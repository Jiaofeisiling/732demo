import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RegisterForm = ({ isEmbedded = false }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少为6个字符');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      await register(username, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : '注册失败，请稍后再试'
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
          <label htmlFor="username" className={labelClasses}>
            用户名
          </label>
          <input
            type="text"
            id="username"
            className={inputClasses}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            required
          />
        </div>
        
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
            placeholder="请输入邮箱"
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
            placeholder="请输入密码（至少6个字符）"
            required
            minLength={6}
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className={labelClasses}>
            确认密码
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={inputClasses}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入密码"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          className={buttonClasses}
          disabled={isLoading}
        >
          {isLoading ? '注册中...' : '注册'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
