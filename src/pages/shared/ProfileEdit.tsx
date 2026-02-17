import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, X, User, Phone, Mail, Building } from 'lucide-react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { ProfileAvatar } from '@/components/shared/profile/ProfileAvatar';
import { FormInput } from '@/components/shared/form/FormInput';
import { Button } from '@/components/shared/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  salesmanId?: string;
}

interface LocationState {
  userData?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    salesmanId?: string;
    avatar?: string;
  };
  returnPath?: string;
}

export const ProfileEdit: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  // Determine if editing own profile or another user's profile
  const isEditingOwnProfile = !id || id === user?.userId;
  const editingUser = isEditingOwnProfile ? user : state?.userData;
  const returnPath = state?.returnPath || (user?.role === 'admin' ? '/admin/profile' : '/salesman/dashboard');

  const [profileImage, setProfileImage] = useState<string | undefined>(editingUser?.avatar);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: editingUser?.name || '',
    email: editingUser?.email || '',
    phone: editingUser?.phone || '',
    salesmanId: editingUser?.salesmanId || '',
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data if needed (when accessing via direct URL)
  useEffect(() => {
    const fetchUserData = async () => {
      if (id && !state?.userData) {
        // TODO: Fetch user data from API
        console.log('Fetching data for user ID:', id);
        // For now, using mock data
      }
    };

    fetchUserData();
  }, [id, state]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (file: File) => {
    console.log('Upload file:', file);
    // TODO: Implement image upload to server
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      console.log('Saving profile:', {
        userId: id || user?.userId,
        ...formData,
        profileImage,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        isEditingOwnProfile
          ? 'Profile updated successfully!'
          : 'Salesman profile updated successfully!'
      );
      navigate(returnPath);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(returnPath);
  };

  const getPageTitle = () => {
    if (isEditingOwnProfile) {
      return 'Edit Profile';
    }
    return `Edit ${formData.name || 'Salesman'}'s Profile`;
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>
        </header>

        {/* Form Section */}
        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-2xl mx-auto">
            {/* Avatar Section */}
            <div className="mb-8">
              <ProfileAvatar
                imageUrl={profileImage}
                name={formData.name || 'User'}
                onImageChange={handleImageChange}
                editable={true}
              />
              <p className="text-center text-sm text-gray-600 mt-3">
                Tap to change profile picture
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="space-y-6">
                {/* Name Field */}
                <FormInput
                  label="Full Name"
                  icon={User}
                  type="text"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  placeholder="Enter full name"
                  required
                  error={errors.name}
                />

                {/* Email Field */}
                <FormInput
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  placeholder="Enter email address"
                  required
                  error={errors.email}
                />

                {/* Phone Field */}
                <FormInput
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  placeholder="Enter phone number"
                  required
                  error={errors.phone}
                />

                {/* Salesman ID Field (Only show if editing salesman) */}
                {!isEditingOwnProfile && (
                  <FormInput
                    label="Salesman ID"
                    icon={Building}
                    type="text"
                    value={formData.salesmanId || ''}
                    onChange={(value) => setFormData({ ...formData, salesmanId: value })}
                    placeholder="Salesman ID"
                    disabled={true}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Changes to email address will require verification.
                {!isEditingOwnProfile && ' Admin privileges required for this action.'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </PageContainer>
  );
};
