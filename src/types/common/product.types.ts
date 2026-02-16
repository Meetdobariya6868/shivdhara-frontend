// Base product interface
export interface Product {
  id: string;
  name: string;
  code?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product with box/piece quantity (for list views)
export interface ProductWithBoxes extends Product {
  date: string;
  quantity: {
    boxes: number;
    piecesPerBox: number;
  };
}

// Product with item details (for detail/edit views)
export interface ProductDetail extends Product {
  size: string;
  quantity: number;
  sqFtRate?: number;
  pricePerPiece?: number;
  description?: string;
}

// Product form data for add/edit
export interface ProductFormData {
  id?: string;
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

// Helper to calculate total pieces
export const calculateTotalPieces = (product: ProductWithBoxes): number => {
  return product.quantity.boxes * product.quantity.piecesPerBox;
};
