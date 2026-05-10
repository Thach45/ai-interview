import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardOverview } from '../features/dashboard/components/DashboardOverview';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <DashboardOverview />
    </MainLayout>
  );
};

export default DashboardPage;
