import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  // 用户状态
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 在组件挂载时从本地存储中加载用户信息
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    
    setUser(userInfo);
    setLoading(false);
  }, []);

  // 登录函数
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/users/login', { email, password });
      
      // 将用户信息保存到本地存储
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : '登录失败'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 注册函数
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/users/register', {
        username,
        email,
        password,
      });
      
      // 将用户信息保存到本地存储
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : '注册失败'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // 更新用户信息
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // 设置请求头中的认证token
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.put('/api/users/profile', userData, config);
      
      // 更新本地存储中的用户信息
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : '更新个人资料失败'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
