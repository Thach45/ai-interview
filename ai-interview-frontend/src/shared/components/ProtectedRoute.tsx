import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { token, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  // 1. Kiểm tra xem có token và đã đăng nhập chưa
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    // 2. Giải mã Token để lấy Role và thời gian hết hạn
    const decoded: DecodedToken = jwtDecode(token);
    
    // 3. Kiểm tra xem Token đã hết hạn chưa (exp tính bằng giây)
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      logout(); // Logout nếu token hết hạn
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 4. Kiểm tra phân quyền (Role-based Authorization)
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // Nếu không đủ quyền, trả về trang không đủ thẩm quyền hoặc trang chủ
      return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // Nếu token lỗi, đá về login
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};
