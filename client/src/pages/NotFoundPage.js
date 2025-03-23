import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFoundPage = () => {
  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-primary-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          404
        </h1>
        <p className="mt-4 text-xl text-gray-500">页面未找到</p>
        
        <p className="mt-6 text-base text-gray-500">
          您访问的页面不存在或已被移除。
        </p>
        
        <div className="mt-10">
          <Link to="/" className="btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
