import React, { useState } from 'react';
import { X, Package, Plus } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { FormInput } from '@/components/shared/form/FormInput';
import { RoomProduct } from './RoomManagement';

interface ProductSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: RoomProduct) => void;
}

interface ProductFormData {
  name: string;
  quantity: string;
  rate: string;
  imageUrl?: string;
}

interface ProductFormErrors {
  name?: string;
  quantity?: string;
  rate?: string;
}

export const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    quantity: '',
    rate: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(parseFloat(formData.quantity)) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }

    if (!formData.rate.trim()) {
      newErrors.rate = 'Rate is required';
    } else if (isNaN(parseFloat(formData.rate)) || parseFloat(formData.rate) <= 0) {
      newErrors.rate = 'Please enter a valid rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const quantity = parseFloat(formData.quantity);
      const rate = parseFloat(formData.rate);
      const totalPrice = quantity * rate;

      const product: RoomProduct = {
        id: `product-${Date.now()}`,
        name: formData.name,
        quantity,
        rate,
        totalPrice,
        imageUrl: formData.imageUrl || undefined,
      };

      onAddProduct(product);

      // Reset form
      setFormData({
        name: '',
        quantity: '',
        rate: '',
        imageUrl: '',
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      quantity: '',
      rate: '',
      imageUrl: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Package className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Add Product
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormInput
              label="Product Name"
              icon={Package}
              type="text"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Enter product name"
              required
              error={errors.name}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Quantity"
                icon={Package}
                type="number"
                value={formData.quantity}
                onChange={(value) =>
                  setFormData({ ...formData, quantity: value })
                }
                placeholder="0"
                required
                error={errors.quantity}
              />

              <FormInput
                label="Rate (₹)"
                icon={Package}
                type="number"
                value={formData.rate}
                onChange={(value) => setFormData({ ...formData, rate: value })}
                placeholder="0.00"
                required
                error={errors.rate}
              />
            </div>

            <FormInput
              label="Image URL (Optional)"
              icon={Package}
              type="text"
              value={formData.imageUrl}
              onChange={(value) =>
                setFormData({ ...formData, imageUrl: value })
              }
              placeholder="https://example.com/image.jpg"
            />

            {/* Total Preview */}
            {formData.quantity && formData.rate && !isNaN(parseFloat(formData.quantity)) && !isNaN(parseFloat(formData.rate)) && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total Price:
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{(parseFloat(formData.quantity) * parseFloat(formData.rate)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                <Plus size={18} />
                <span>Add Product</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
