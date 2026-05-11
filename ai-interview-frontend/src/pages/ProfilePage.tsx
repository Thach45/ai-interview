import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { EditProfile } from '../features/profile/components/EditProfile';
import { AccountSettings } from '../features/profile/components/AccountSettings';
import { PurchaseHistory } from '../features/profile/components/PurchaseHistory';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'purchase'>('profile');

  return (
    <MainLayout title="Quản lý tài khoản">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-[36px] font-semibold text-text-primary leading-[1.2] tracking-[-0.5px] mb-2">Quản lý tài khoản</h1>
          <p className="text-[18px] text-text-secondary font-normal">Quản lý cài đặt và tùy chọn tài khoản</p>
        </div>

        {/* Tabs - pill style as per DESIGN.md */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap border ${
              activeTab === 'profile' 
                ? 'bg-black text-white border-black' 
                : 'bg-transparent text-text-tertiary border-border-hairline hover:bg-bg-surface'
            }`}
          >
            Chỉnh sửa Thông tin hồ sơ
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap border ${
              activeTab === 'purchase' 
                ? 'bg-black text-white border-black' 
                : 'bg-transparent text-text-tertiary border-border-hairline hover:bg-bg-surface'
            }`}
          >
            Lịch sử mua hàng
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
        ) : (
          <PurchaseHistory />
        )}

      </div>
    </MainLayout>
  );
};

export default ProfilePage;

