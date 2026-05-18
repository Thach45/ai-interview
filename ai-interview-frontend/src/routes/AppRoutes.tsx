import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard';
import JobsPage from '../pages/Jobs';
import InterviewSetupPage from '../pages/InterviewSetup';
import InterviewPracticePage from '../pages/InterviewPractice';
import InterviewResultPage from '../pages/InterviewResult';
import InterviewRoomVideoPage from '../pages/InterviewRoomVideo';
import InterviewRoomTextPage from '../pages/InterviewRoomText';
import NotFoundPage from '../pages/NotFound';


import { AdminJobsPage } from '../pages/admin/AdminJobsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminTransactionsPage } from '../pages/admin/AdminTransactionsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { VerifyOTPPage } from '../pages/auth/VerifyOTPPage';

import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import ProfilePage from "../pages/ProfilePage.tsx";
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import CVAnalysisResultPage from '../pages/CVAnalysisResult';

import MyCvsPage from '../pages/MyCvs';


export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />

        {/* Private Routes (Bất kỳ user nào đăng nhập cũng vào được) */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        } />
        <Route path="/my-cvs" element={
          <ProtectedRoute>
            <MyCvsPage />
          </ProtectedRoute>
        } />
        <Route path="/interviews/setup" element={
          <ProtectedRoute>
            <InterviewSetupPage />
          </ProtectedRoute>
        } />
        <Route path="/interviews/practice" element={
          <ProtectedRoute>
            <InterviewPracticePage />
          </ProtectedRoute>
        } />
        <Route path="/interview/video" element={
          <ProtectedRoute>
            <InterviewRoomVideoPage />
          </ProtectedRoute>
        } />
        <Route path="/interview/chat" element={
          <ProtectedRoute>
            <InterviewRoomTextPage />
          </ProtectedRoute>
        } />
        <Route path="/interviews/result" element={
          <ProtectedRoute>
            <InterviewResultPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/jobs/cv-analysis/:id" element={
          <ProtectedRoute>
            <CVAnalysisResultPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes (Chỉ ADMIN mới vào được) */}
        <Route path="/admin" element={<Navigate to="/admin/jobs" replace />} />
        <Route path="/admin/jobs" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminJobsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsersPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCategoriesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTransactionsPage />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
