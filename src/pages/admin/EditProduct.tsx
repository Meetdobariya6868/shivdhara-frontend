import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { ImageUpload } from '@/components/common/ImageUpload';
import { DatePicker } from '@/components/common/DatePicker';

interface ProductFormData {
  id: string;
  imageUrl?: string;
  productType: string;
  measurementType: 'boxes' | 'pieces';
  numberOfPieces: number;
  sqFtRate: number;
  height: number;
  width: number;
  unit: 'inch' | 'cm' | 'ft';
  calculation: number;
  productPrice: number;
  transportationCharge: number;
  customerName: string;
  customerNumber: string;
  orderType: 'Local' | 'Station';
  selectedDate: string;
}

// Mock data - replace with actual API call
const mockProductTypes = ['Marble', 'Granite', 'Quartz', 'Tiles', 'Stone'];
const mockUnits = ['inch', 'cm', 'ft'];
const mockOrderTypes = ['Local', 'Station'];

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>({
    id: id || '',
    imageUrl: undefined,
    productType: 'Marble',
    measurementType: 'pieces',
    numberOfPieces: 10,
    sqFtRate: 10,
    height: 100,
    width: 100,
    unit: 'inch',
    calculation: 694.44,
    productPrice: 694.44,
    transportationCharge: 10,
    customerName: 'demo',
    customerNumber: '1234567890',
    orderType: 'Local',
    selectedDate: new Date().toISOString().split('T')[0],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Calculate product price based on inputs
  useEffect(() => {
    const { numberOfPieces, sqFtRate, height, width, unit } = formData;

    // Convert dimensions to square feet
    let heightInFeet = height;
    let widthInFeet = width;

    if (unit === 'inch') {
      heightInFeet = height / 12;
      widthInFeet = width / 12;
    } else if (unit === 'cm') {
      heightInFeet = height / 30.48;
      widthInFeet = width / 30.48;
    }

    const sqFt = heightInFeet * widthInFeet;
    const pricePerPiece = sqFt * sqFtRate;
    const calculation = numberOfPieces * pricePerPiece;

    setFormData((prev) => ({
      ...prev,
      calculation: parseFloat(calculation.toFixed(2)),
      productPrice: parseFloat(calculation.toFixed(2)),
    }));
  }, [
    formData.numberOfPieces,
    formData.sqFtRate,
    formData.height,
    formData.width,
    formData.unit,
  ]);

  const handleImageUpload = (file: File | null, previewUrl: string | null) => {
    setImageFile(file);
    setFormData((prev) => ({
      ...prev,
      imageUrl: previewUrl || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (!formData.customerNumber.trim()) {
      alert('Please enter customer number');
      return;
    }

    if (formData.numberOfPieces <= 0) {
      alert('Please enter a valid number of pieces');
      return;
    }

    console.log('Form submitted:', formData);
    console.log('Image file:', imageFile);

    // TODO: Implement API call to update product
    // const formDataToSend = new FormData();
    // if (imageFile) {
    //   formDataToSend.append('image', imageFile);
    // }
    // Object.keys(formData).forEach((key) => {
    //   formDataToSend.append(key, formData[key as keyof ProductFormData].toString());
    // });

    // Show success message
    alert('Product updated successfully!');
    navigate(-1);
  };

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
              Update Detail
            </h1>

            {/* Empty space for alignment */}
            <div className="w-10" />
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Image Upload */}
          <ImageUpload
            value={formData.imageUrl}
            onChange={handleImageUpload}
          />

          {/* Product Type Dropdown */}
          <div className="relative">
            <select
              value={formData.productType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, productType: e.target.value }))
              }
              className="w-full px-6 py-4 text-lg font-semibold bg-[#D9E5D6] border-2 border-gray-300 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              {mockProductTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              size={24}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            />
          </div>

          {/* Measurement Type Radio Buttons */}
          <div className="flex items-center justify-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="measurementType"
                value="boxes"
                checked={formData.measurementType === 'boxes'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    measurementType: 'boxes' as const,
                  }))
                }
                className="w-6 h-6 accent-green-600"
              />
              <span className="text-lg font-medium text-gray-900">Boxes</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="measurementType"
                value="pieces"
                checked={formData.measurementType === 'pieces'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    measurementType: 'pieces' as const,
                  }))
                }
                className="w-6 h-6 accent-green-600"
              />
              <span className="text-lg font-medium text-gray-900">Pieces</span>
            </label>
          </div>

          {/* Number of Pieces */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 px-2">
              Enter no of piece
            </label>
            <input
              type="number"
              value={formData.numberOfPieces}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numberOfPieces: parseInt(e.target.value) || 0,
                }))
              }
              min="0"
              className="w-full px-6 py-4 text-lg font-semibold bg-[#D9E5D6] border-2 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sq Ft Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 px-2">
              Enter product Sq Ft Rate:
            </label>
            <input
              type="number"
              value={formData.sqFtRate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sqFtRate: parseFloat(e.target.value) || 0,
                }))
              }
              min="0"
              step="0.01"
              className="w-full px-6 py-4 text-lg font-semibold bg-[#D9E5D6] border-2 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Dimensions */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Height
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    height: parseFloat(e.target.value) || 0,
                  }))
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-3 text-lg font-semibold text-center bg-white border-b-2 border-gray-400 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>

            <span className="text-2xl font-bold text-gray-700 mt-6">X</span>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Width
              </label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    width: parseFloat(e.target.value) || 0,
                  }))
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-3 text-lg font-semibold text-center bg-white border-b-2 border-gray-400 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>

            <div className="relative mt-6">
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    unit: e.target.value as 'inch' | 'cm' | 'ft',
                  }))
                }
                className="px-4 py-3 pr-10 text-lg font-semibold bg-white border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
              >
                {mockUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
            </div>
          </div>

          {/* Calculation */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 px-2">
              Calculation
            </label>
            <div className="w-full px-6 py-4 text-lg font-bold bg-[#D9E5D6] border-2 border-gray-300 rounded-3xl text-gray-900">
              {formData.calculation.toFixed(2)}
            </div>
          </div>

          {/* Product Price */}
          <div className="flex items-center justify-between px-2">
            <span className="text-lg font-medium text-gray-400">Product price:</span>
            <span className="text-2xl font-bold text-gray-400">
              {formData.productPrice.toFixed(2)}
            </span>
          </div>

          {/* Transportation Charge */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 px-2">
              Transportation Charge
            </label>
            <input
              type="number"
              value={formData.transportationCharge}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  transportationCharge: parseFloat(e.target.value) || 0,
                }))
              }
              min="0"
              step="0.01"
              className="w-full px-6 py-4 text-lg font-semibold bg-[#D9E5D6] border-2 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 px-2">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, customerName: e.target.value }))
              }
              className="w-full px-6 py-4 text-lg font-semibold bg-[#D9E5D6] border-2 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter customer name"
            />
          </div>

          {/* Customer Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 px-2">
              Customer Number
            </label>
            <div className="flex items-center gap-2 w-full px-6 py-4 bg-[#D9E5D6] border-2 border-gray-300 rounded-3xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all">
              <span className="text-lg font-semibold text-gray-700">+91</span>
              <input
                type="tel"
                value={formData.customerNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerNumber: e.target.value.replace(/\D/g, ''),
                  }))
                }
                maxLength={10}
                className="flex-1 bg-transparent text-lg font-semibold focus:outline-none"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Order Type Dropdown */}
          <div className="relative">
            <select
              value={formData.orderType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  orderType: e.target.value as 'Local' | 'Station',
                }))
              }
              className="w-full px-6 py-4 text-lg font-semibold bg-[#D9E5D6] border-2 border-gray-300 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              {mockOrderTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              size={24}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            />
          </div>

          {/* Date Picker */}
          <DatePicker
            value={formData.selectedDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, selectedDate: date }))
            }
          />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-4 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
