import React, { useState } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { DashboardHeader } from '@/components/shared/dashboard/DashboardHeader';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { AddProductForm, AddProductFormData } from '@/components/features/products/AddProductForm';

export const AddDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: AddProductFormData) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Form submitted:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      alert('Order posted successfully!');

      // You can also navigate to another page here
      // navigate('/salesman/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to post order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Detail</h1>
              <p className="text-gray-600 text-sm">Create a new order with product details</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">Quick Tip</p>
            <p className="text-sm text-blue-700 mt-1">
              Fill in all required fields to create a complete order.
            </p>
          </div>
        </div>

        {/* Form */}
        <AddProductForm onSubmit={handleSubmit} loading={loading} />
      </main>
    </PageContainer>
  );
};
