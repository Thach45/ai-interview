import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { EditProfile } from '../features/profile/EditProfile';

const ProfilePage: React.FC = () => {
  return (
    <MainLayout title="Edit Profile">
      <div className="p-6">
        <EditProfile />
      </div>
    </MainLayout>
  );
};

export default ProfilePage;

