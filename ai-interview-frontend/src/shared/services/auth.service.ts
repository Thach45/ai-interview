import apiClient from './apiClient';

class AuthService {
  logout(): void {
    // Clear token ngay lập tức để UI không bị block 
    localStorage.removeItem('token');

    // Gọi API ở background để clear cookie ở server, không cần await
    apiClient.post('/auth/logout').catch(error => {
      console.error('Logout failed:', error);
    });

    // Điều hướng ngay lập tức
    window.location.href = '/login';
  }
}

export const authService = new AuthService();
