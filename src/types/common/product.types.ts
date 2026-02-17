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

// Room product interface for room management
export interface RoomProduct {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  totalPrice: number;
  imageUrl?: string;
}

// Room interface for room management
export interface Room {
  id: string;
  name: string;
  products: RoomProduct[];
}

// Helper to calculate total pieces
export const calculateTotalPieces = (product: ProductWithBoxes): number => {
  return product.quantity.boxes * product.quantity.piecesPerBox;
};

// Helper to calculate room total
export const calculateRoomTotal = (room: Room): number => {
  return room.products.reduce((sum, product) => sum + product.totalPrice, 0);
};

// Helper to calculate grand total from all rooms
export const calculateGrandTotal = (rooms: Room[]): number => {
  return rooms.reduce((total, room) => total + calculateRoomTotal(room), 0);
};
