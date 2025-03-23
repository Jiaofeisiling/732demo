import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 切换菜单
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">任务管理系统</span>
            </Link>
          </div>

          {/* 桌面导航 */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-primary-700">
              首页
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md hover:bg-primary-700"
                >
                  仪表盘
                </Link>
                <Link
                  to="/tasks"
                  className="px-3 py-2 rounded-md hover:bg-primary-700"
                >
                  任务
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md hover:bg-primary-700"
                >
                  个人资料
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md hover:bg-primary-700"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md hover:bg-primary-700"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md hover:bg-primary-700"
                >
                  注册
                </Link>
              </>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md hover:bg-primary-700"
              onClick={toggleMenu}
            >
              首页
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-primary-700"
                  onClick={toggleMenu}
                >
                  仪表盘
                </Link>
                <Link
                  to="/tasks"
                  className="block px-3 py-2 rounded-md hover:bg-primary-700"
                  onClick={toggleMenu}
                >
                  任务
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md hover:bg-primary-700"
                  onClick={toggleMenu}
                >
                  个人资料
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-primary-700"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md hover:bg-primary-700"
                  onClick={toggleMenu}
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md hover:bg-primary-700"
                  onClick={toggleMenu}
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
