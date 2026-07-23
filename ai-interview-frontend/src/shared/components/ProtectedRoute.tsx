'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Kiểm tra xem có token và đã đăng nhập chưa
    if (!isAuthenticated || !token) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      // 2. Giải mã Token để lấy Role và thời gian hết hạn
      const decoded: DecodedToken = jwtDecode(token);

      // 3. Kiểm tra phân quyền (Role-based Authorization)
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        router.replace('/unauthorized');
        return;
      }
    } catch {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [token, isAuthenticated, allowedRoles, router, pathname]);

  // Không render gì nếu chưa authenticated
  if (!isAuthenticated || !token) {
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);

    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return null;
    }

    return <>{children}</>;
  } catch {
    return null;
  }
};
