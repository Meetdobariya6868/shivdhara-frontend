import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { ProductDetail } from '@/types/common/product.types';

export interface Product {
  id: string;
  name: string;
  code?: string;
  size: string;
  imageUrl?: string;
  quantity: number;
}

interface ProductItemProps {
  product: Product;
  index: number;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onEdit?: (product: Product) => void;
  onImageClick?: (product: Product) => void;
  editable?: boolean;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  product,
  index,
  onQuantityChange,
  onEdit,
  onImageClick,
  editable = true,
}) => {
  const [quantity, setQuantity] = useState(product.quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
    onQuantityChange?.(product.id, value);
  };

  return (
    <div className="mb-4">
      {/* Product Number Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl md:text-3xl font-bold text-gray-900">{index}</span>
        {editable && onEdit && (
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Edit product"
          >
            <Edit2 size={20} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Product Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <button
            onClick={() => onImageClick?.(product)}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label={`View ${product.name} details`}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-white cursor-pointer"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer">
                <span className="text-gray-500 text-xs">No Image</span>
              </div>
            )}
          </button>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              {product.size}
            </p>
          </div>

          {/* Quantity Input */}
          <div className="flex-shrink-0">
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="0"
              disabled={!editable}
              className="w-20 md:w-24 px-3 py-2 md:py-2.5 text-center text-base md:text-lg font-semibold bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
