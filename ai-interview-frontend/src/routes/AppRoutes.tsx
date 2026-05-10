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
