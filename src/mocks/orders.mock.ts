import { OrderListItem, OrderDetail } from '@/types/common/order.types';

// Orders list data
export const mockOrders: OrderListItem[] = [
  { id: '#12345', productName: 'Product A', salesmanName: 'Yogesh Patel', status: 'pending', date: '2024-02-15', amount: '₹5,000', userName: 'demo', userId: '1' },
  { id: '#12346', productName: 'Product B', salesmanName: 'Rajubhai Mehta', status: 'confirmed', date: '2024-02-14', amount: '₹3,500', userName: 'demo', userId: '2' },
  { id: '#12347', productName: 'Product C', salesmanName: 'Kevalbhai Ambani', status: 'delivered', date: '2024-02-13', amount: '₹7,200', userName: 'demo', userId: '3' },
  { id: '#12348', productName: 'Product D', salesmanName: 'VIVEK KORAT', status: 'pending', date: '2024-02-12', amount: '₹4,800', userName: 'demo', userId: '4' },
  { id: '#12349', productName: 'Product E', salesmanName: 'Prakash Shah', status: 'confirmed', date: '2024-02-11', amount: '₹6,100', userName: 'demo', userId: '5' },
];

// Order details data
export const mockOrderDetails: Record<string, OrderDetail> = {
  '1': {
    id: '1',
    customer: {
      name: 'demo',
      mobileNo: '1234567890',
      orderType: 'Local',
    },
    payment: {
      transportationCharge: 10,
      advancePayment: 10,
      remainingPayment: 6944,
      totalPayment: 6954.0,
    },
    products: [
      {
        id: 'p1',
        name: 'P. Grey White',
        code: 'GW-001',
        size: '100 X 100 inch',
        imageUrl: undefined,
        quantity: 10,
        sqFtRate: 10,
        pricePerPiece: 694.44,
      },
      {
        id: 'p2',
        name: 'P. Blue Diamond',
        code: 'BD-002',
        size: '80 X 80 inch',
        imageUrl: undefined,
        quantity: 5,
        sqFtRate: 12,
        pricePerPiece: 768.0,
      },
    ],
    status: 'pending',
    createdAt: '2024-02-15T10:00:00Z',
  },
};
