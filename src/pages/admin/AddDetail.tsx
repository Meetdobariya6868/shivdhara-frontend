import React from 'react';
import { FileText, Upload, Image, FileSpreadsheet } from 'lucide-react';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { PageContainer } from '@/components/common/PageContainer';

export const AddDetail: React.FC = () => {
  return (
    <PageContainer>
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="text-purple-600" size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Detail</h1>
          </div>
          <p className="text-gray-600">Upload and manage business details</p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="flex justify-center gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Upload className="text-blue-600" size={32} />
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Image className="text-green-600" size={32} />
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <FileSpreadsheet className="text-orange-600" size={32} />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              This section will allow you to add and manage detailed business information.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Planned Features:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Upload product catalogs and images
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Add business documents and contracts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  Manage inventory and stock details
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Upload pricing sheets and invoices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </PageContainer>
  );
};
