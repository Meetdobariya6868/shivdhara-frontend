import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/shared/layout/PageContainer';

interface ProductDetailData {
  id: string;
  name: string;
  code?: string;
  size: string;
  imageUrl?: string;
  piece: number;
  sqFtRate: number;
  pricePerPiece: number;
  description?: string;
}

// Mock data - replace with actual API call
const mockProductData: Record<string, ProductDetailData> = {
  'p1': {
    id: 'p1',
    name: 'P. Grey White',
    code: 'GW-001',
    size: '100 X 100 inch',
    imageUrl: undefined,
    piece: 10,
    sqFtRate: 10,
    pricePerPiece: 694.44,
  },
  'p2': {
    id: 'p2',
    name: 'P. Blue Diamond',
    code: 'BD-002',
    size: '80 X 80 inch',
    imageUrl: undefined,
    piece: 5,
    sqFtRate: 12,
    pricePerPiece: 768.0,
  },
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const location = useLocation();

  // Get product data - replace with actual API call
  const productData = id ? mockProductData[id] : undefined;

  const [piece, setPiece] = useState(productData?.piece || 0);

  if (!productData) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-600">Product not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const handlePieceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setPiece(value);
  };

  const handleEdit = () => {
    // Navigate to edit product page
    navigate(`/admin/product/${productData.id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', productData.id);
      // Implement delete functionality
      navigate(-1);
    }
  };

  // Calculate if this is coming from order detail or my products
  // const isFromOrder = location.pathname.includes('/order/');

  return (
    <PageContainer>
      <div className="min-h-screen bg-[#F5F5F5] pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#F5F5F5] px-4 py-4">
          <div className="flex items-center max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>

            <h1 className="text-lg md:text-xl font-bold text-gray-900 flex-1 text-center px-4">
              Product details
            </h1>

            {/* Empty space for alignment */}
            <div className="w-10" />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Product Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
            {productData.imageUrl ? (
              <img
                src={productData.imageUrl}
                alt={productData.name}
                className="w-full h-auto max-h-[500px] object-contain bg-white"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-500 font-medium">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {productData.name}
              </h2>
              <span className="text-lg md:text-xl font-semibold text-gray-700">
                {productData.size}
              </span>
            </div>

            <div className="border-t-2 border-gray-300" />
          </div>

          {/* Description Section */}
          <div className="space-y-5">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Description
            </h3>

            {/* Piece Input */}
            <div className="flex items-center justify-between">
              <label className="text-lg md:text-xl font-semibold text-gray-900">
                Piece :
              </label>
              <input
                type="number"
                value={piece}
                onChange={handlePieceChange}
                min="0"
                className="w-48 md:w-56 px-4 py-2.5 md:py-3 text-center text-base md:text-lg font-semibold bg-[#D9E5D6] border-2 border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sq.Ft Rate */}
            <div className="flex items-center justify-between">
              <label className="text-lg md:text-xl font-medium text-gray-400">
                Sq.Ft Rate:
              </label>
              <span className="text-lg md:text-xl font-medium text-gray-400">
                {productData.sqFtRate}
              </span>
            </div>

            {/* Price per Piece */}
            <div className="flex items-center justify-between">
              <label className="text-lg md:text-xl font-medium text-gray-400">
                Price per Piece:
              </label>
              <span className="text-lg md:text-xl font-medium text-gray-400">
                {productData.pricePerPiece.toFixed(2)}
              </span>
            </div>
          </div>
        </main>

        {/* Bottom Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-lg z-10">
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
            <button
              onClick={handleEdit}
              className="bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 md:py-3.5 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 md:py-3.5 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
