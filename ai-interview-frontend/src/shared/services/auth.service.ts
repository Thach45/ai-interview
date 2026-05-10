import apiClient from './apiClient';

export const logoutAccount = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};
