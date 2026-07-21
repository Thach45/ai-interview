import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/client/Dashboard';
import JobsPage from '../pages/client/Jobs';
import InterviewSetupPage from '../pages/client/InterviewSetup';

import InterviewResultPage from '../pages/client/InterviewResult';
import InterviewRoomVideoPage from '../pages/client/InterviewRoomVideo';
import InterviewRoomTextPage from '../pages/client/InterviewRoomText';
import { WaitingRoom } from '../pages/client/WaitingRoom';
import NotFoundPage from '../pages/client/NotFound.tsx';



import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminJobsPage } from '../pages/admin/AdminJobsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminCvTemplatesPage } from '../pages/admin/AdminCvTemplatesPage';
import { AdminTransactionsPage } from '../pages/admin/AdminTransactionsPage';
import { AdminPackagesPage } from '../pages/admin/AdminPackagesPage';
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { VerifyOTPPage } from '../pages/auth/VerifyOTPPage';

import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import ProfilePage from "../pages/client/ProfilePage.tsx";
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import CVAnalysisResultPage from '../pages/client/CVAnalysisResult';

import MyCvsPage from '../pages/client/MyCvs.tsx';
import SubscriptionPage from '../pages/client/SubscriptionPage';
import { LoadingTestPage } from '../pages/client/LoadingTestPage';
import CvBuilderPage from '../pages/client/CvBuilderPage.tsx';


import LandingPage from '../pages/client/LandingPage';
import { CvTemplatesPage } from '../pages/client/CvTemplatesPage.tsx';

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        
        {/* Test Route cho Component LoadingIndicator */}
        <Route path="/test-loading/:type" element={<LoadingTestPage />} />

        {/* Private Routes (Bất kỳ user nào đăng nhập cũng vào được) */}
        <Route path="/dashboard" element={
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
        <Route path="/subscription" element={
          <ProtectedRoute>
            <SubscriptionPage />
          </ProtectedRoute>
        } />
        <Route path="/cv-builder/templates" element={
          <ProtectedRoute>
            <CvTemplatesPage />
          </ProtectedRoute>
        } />
        <Route path="/cv-builder/:templateId" element={
          <ProtectedRoute>
            <CvBuilderPage />
          </ProtectedRoute>
        } />
        <Route path="/interviews/setup" element={
          <ProtectedRoute>
            <InterviewSetupPage />
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
        <Route path="/interview/waiting" element={
          <ProtectedRoute>
            <WaitingRoom />
          </ProtectedRoute>
        } />
        <Route path="/interviews/report" element={
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
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
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
        <Route path="/admin/cv-templates" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCvTemplatesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTransactionsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/packages" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPackagesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminNotificationsPage />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
