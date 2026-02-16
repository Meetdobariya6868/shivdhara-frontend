import { ProductDetail } from '@/types/common/product.types';

// Product details data
export const mockProductDetails: Record<string, ProductDetail> = {
  'p1': {
    id: 'p1',
    name: 'P. Grey White',
    code: 'GW-001',
    size: '100 X 100 inch',
    imageUrl: undefined,
    quantity: 10,
    sqFtRate: 10,
    pricePerPiece: 694.44,
  },
  'p2': {
    id: 'p2',
    name: 'P. Blue Diamond',
    code: 'BD-002',
    size: '80 X 80 inch',
    imageUrl: undefined,
    quantity: 5,
    sqFtRate: 12,
    pricePerPiece: 768.0,
  },
};

// Mock product options
export const mockProductTypes = ['Marble', 'Granite', 'Quartz', 'Tiles', 'Stone'];
export const mockUnits = ['inch', 'cm', 'ft'];
export const mockOrderTypes = ['Local', 'Station'];
