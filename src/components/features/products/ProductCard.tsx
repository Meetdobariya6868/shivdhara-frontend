import React from 'react';
import { ProductWithBoxes } from '@/types/common/product.types';

interface ProductCardProps {
  product: ProductWithBoxes;
  onClick?: (product: ProductWithBoxes) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const getTotalPieces = () => {
    return product.quantity.boxes * product.quantity.piecesPerBox;
  };

  const getQuantityColor = () => {
    const total = getTotalPieces();
    if (total >= 20) return 'text-green-600';
    if (total >= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="mb-6">
      {/* Date Header */}
      <div className="text-sm text-gray-600 font-medium mb-2 px-1">
        {product.date}
      </div>

      {/* Product Card */}
      <button
        onClick={() => onClick?.(product)}
        className="w-full bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-left"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 uppercase leading-tight">
              {product.name}
            </h3>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              {product.code}
            </p>
          </div>

          {/* Quantity Badge */}
          <div className={`flex-shrink-0 text-right ${getQuantityColor()}`}>
            <span className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {product.quantity.boxes} X {product.quantity.piecesPerBox}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};
