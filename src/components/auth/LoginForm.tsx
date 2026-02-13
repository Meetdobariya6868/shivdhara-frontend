import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/auth.types';
import { getDashboardPath } from '@/utils/helpers';

export const LoginForm: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({
    userId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const user = await login(formData);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Invalid credentials. Please try again.';
      setErrors({ userId: errorMessage });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6" onKeyPress={handleKeyPress}>
      <Input
        type="text"
        placeholder="User Id"
        value={formData.userId}
        onChange={handleChange('userId')}
        error={errors.userId}
        icon={<Mail size={20} />}
        autoComplete="username"
      />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          icon={<Lock size={20} />}
          autoComplete="current-password"
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-800 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="pt-4 sm:pt-6">
        <Button
          onClick={handleSubmit}
          loading={loading}
          className="w-full text-base sm:text-lg"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};
