import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Edit2, Save, X, Shield, Calendar } from 'lucide-react';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { PageContainer } from '@/components/common/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
    });
    setIsEditing(false);
  };

  return (
    <PageContainer>
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-blue-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Shield size={16} />
                  <span className="text-blue-100 capitalize">{user?.role}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={16} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {user?.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {user?.email || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* User ID Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield size={16} />
                  User ID
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {user?.userId}
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} />
                  Role
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
                  {user?.role}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </Button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Card */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-3xl mx-auto mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-gray-700" size={24} />
            <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Button className="w-full">
              <Lock size={18} className="mr-2" />
              Update Password
            </Button>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-600 mt-1">Salesmen</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">156</p>
            <p className="text-sm text-gray-600 mt-1">Orders</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">₹45.2L</p>
            <p className="text-sm text-gray-600 mt-1">Revenue</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">92%</p>
            <p className="text-sm text-gray-600 mt-1">Performance</p>
          </div>
        </div>
      </main>
    </PageContainer>
  );
};
