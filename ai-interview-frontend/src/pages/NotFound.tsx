import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Trang không tồn tại</h2>
      <p className="text-gray-500 mb-8">Có vẻ như bạn đã đi lạc vào một phòng phỏng vấn không tồn tại.</p>
      <Link 
        to="/" 
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
