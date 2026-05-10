import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard';
import JobsPage from '../pages/Jobs';
import InterviewSetupPage from '../pages/InterviewSetup';
import InterviewPracticePage from '../pages/InterviewPractice';
import InterviewResultPage from '../pages/InterviewResult';
import NotFoundPage from '../pages/NotFound';

import { AdminJobsPage } from '../pages/admin/AdminJobsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminTransactionsPage } from '../pages/admin/AdminTransactionsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { VerifyOTPPage } from '../pages/auth/VerifyOTPPage';

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/interviews/setup" element={<InterviewSetupPage />} />
        <Route path="/interviews/practice" element={<InterviewPracticePage />} />
        <Route path="/interviews/result" element={<InterviewResultPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/jobs" replace />} />
        <Route path="/admin/jobs" element={<AdminJobsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
