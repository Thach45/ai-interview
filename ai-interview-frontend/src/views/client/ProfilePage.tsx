import React, { useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { EditProfile } from '../../features/profile/components/EditProfile';
import { AccountSettings } from '../../features/profile/components/AccountSettings';
import { PurchaseHistory } from '../../features/profile/components/PurchaseHistory';
import { ProfileNotifications } from '../../features/profile/components/ProfileNotifications';
import { PageHeader } from '@/shared/components/PageHeader';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'purchase' | 'notifications'>('profile');

  return (
    <MainLayout maxWidth="1600px" className="px-6 lg:px-10 pt-3 pb-12 flex flex-col">
      <>
        
        {/* Page Header */}
        <PageHeader
          title="Quản lý tài khoản"
          description="Quản lý cài đặt và tùy chọn tài khoản của bạn"
          
        />

        {/* Tabs - pill style */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all whitespace-nowrap border ${
              activeTab === 'profile' 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-transparent text-text-tertiary border-border-hairline hover:bg-primary/5 hover:text-primary hover:border-primary/20'
            }`}
          >
            Chỉnh sửa Thông tin hồ sơ
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all whitespace-nowrap border ${
              activeTab === 'purchase' 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-transparent text-text-tertiary border-border-hairline hover:bg-primary/5 hover:text-primary hover:border-primary/20'
            }`}
          >
            Lịch sử mua hàng
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all whitespace-nowrap border ${
              activeTab === 'notifications' 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-transparent text-text-tertiary border-border-hairline hover:bg-primary/5 hover:text-primary hover:border-primary/20'
            }`}
          >
            Thông báo
          </button>
        </div>

        {/* Content */}
        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <EditProfile />
            </div>
            <div className="lg:col-span-2">
              <AccountSettings />
            </div>
          </div>
        ) : activeTab === 'purchase' ? (
          <PurchaseHistory />
        ) : (
          <ProfileNotifications />
        )}

      </>
    </MainLayout>
  );
};

export default ProfilePage;
