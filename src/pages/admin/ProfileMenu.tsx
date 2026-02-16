import React, { useState } from 'react';
import {
  Edit3,
  Package,
  ShoppingBag,
  FileCheck,
  Shield,
  Download,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileMenuItem } from '@/components/shared/profile/ProfileMenuItem';
import { ProfileAvatar } from '@/components/shared/profile/ProfileAvatar';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';

export const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  const handleImageChange = (file: File) => {
    // Here you would upload the file to your server
    console.log('Upload file:', file);
  };

  const handleEditProfile = () => {
    navigate('/admin/profile/edit');
  };

  const handleShowProducts = () => {
    navigate('/admin/products');
  };

  const handleMyProducts = () => {
    navigate('/admin/my-products');
  };

  const handleOrders = () => {
    navigate('/admin/orders');
  };

  const handlePrivacyPolicy = () => {
    navigate('/admin/privacy-policy');
  };

  const handleCheckUpdate = () => {
    // Implement version check logic
    alert('You are using the latest version!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              Profile
            </h1>
          </div>
        </div>

        {/* Profile Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Avatar */}
            <div className="mb-6">
              <ProfileAvatar
                imageUrl={profileImage}
                name={user?.name || 'Admin User'}
                onImageChange={handleImageChange}
                editable={true}
              />
            </div>

            {/* Name */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-wide">
                {user?.name || 'ADMIN USER'}
              </h2>
              <p className="text-gray-600 mt-1 capitalize">
                {user?.role || 'Administrator'}
              </p>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <ProfileMenuItem
                icon={Edit3}
                label="Edit Profile"
                onClick={handleEditProfile}
              />

              <ProfileMenuItem
                icon={Package}
                label="Show products"
                onClick={handleShowProducts}
              />

              <ProfileMenuItem
                icon={ShoppingBag}
                label="My products"
                onClick={handleMyProducts}
              />

              <ProfileMenuItem
                icon={FileCheck}
                label="Total confirm order"
                onClick={handleOrders}
              />

              <ProfileMenuItem
                icon={Shield}
                label="Privacy & Policy"
                onClick={handlePrivacyPolicy}
              />

              <ProfileMenuItem
                icon={Download}
                label="Check for software update"
                onClick={handleCheckUpdate}
              />

              <ProfileMenuItem
                icon={LogOut}
                label="Logout"
                onClick={handleLogout}
                variant="danger"
              />
            </div>

            {/* App Version */}
            <div className="text-center mt-8 text-sm text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
