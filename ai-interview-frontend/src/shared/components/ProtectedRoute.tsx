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
    
    // 3. Không kiểm tra exp ở đây nữa, để cho apiClient interceptor tự lo vụ Refresh Token
    // Nếu hết hạn thì khi gọi API, apiClient sẽ tự catch 401 và gọi /refresh-token

    // 4. Kiểm tra phân quyền (Role-based Authorization)
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // Nếu không đủ quyền, trả về trang không đủ thẩm quyền hoặc trang chủ
      return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // Nếu token lỗi định dạng nặng
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};
