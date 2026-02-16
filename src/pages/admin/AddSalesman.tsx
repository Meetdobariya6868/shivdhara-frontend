import React, { useState } from 'react';
import { UserPlus, User, Phone, Lock, Check, AlertCircle } from 'lucide-react';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { PageContainer } from '@/components/common/PageContainer';
import { Button } from '@/components/common/Button';

interface FormData {
  name: string;
  mobile: string;
  password: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  password?: string;
}

export const AddSalesman: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobile: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Salesman name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccess(false);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', mobile: '', password: '' });
        setSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <PageContainer>
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="text-blue-600" size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Salesman</h1>
          </div>
          <p className="text-gray-600">Create a new salesman account</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <Check className="text-green-600" size={24} />
            <div>
              <p className="text-green-800 font-medium">Salesman added successfully!</p>
              <p className="text-green-600 text-sm">The new salesman account has been created.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                Salesman Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Enter salesman name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} />
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={handleChange('mobile')}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.mobile
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.mobile && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.mobile}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} />
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Enter password (min. 6 characters)"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                loading={loading}
                className="w-full text-base md:text-lg"
              >
                <UserPlus size={20} className="mr-2" />
                Add Salesman
              </Button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-blue-800 font-medium text-sm">Important Information</p>
              <ul className="text-blue-700 text-sm mt-1 space-y-1 list-disc list-inside">
                <li>All fields are mandatory</li>
                <li>Mobile number must be a valid 10-digit Indian number</li>
                <li>Password must be at least 6 characters long</li>
                <li>Salesman will receive login credentials via SMS</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </PageContainer>
  );
};
