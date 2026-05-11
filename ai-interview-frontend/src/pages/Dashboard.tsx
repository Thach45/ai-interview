import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardOverview } from '../features/dashboard/components/DashboardOverview';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout maxWidth="1440px" className="px-8 lg:px-12 py-6">
      <DashboardOverview />
    </MainLayout>
  );
};

export default DashboardPage;
