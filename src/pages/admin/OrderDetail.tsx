import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Download, BarChart3, Type, MessageCircle } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { ProductItem, Product } from '@/components/common/ProductItem';

interface CustomerInfo {
  name: string;
  mobileNo: string;
  orderType: 'Local' | 'Station';
}

interface PaymentInfo {
  transportationCharge: number;
  advancePayment: number;
  remainingPayment: number;
  totalPayment: number;
}

interface OrderDetailData {
  id: string;
  customer: CustomerInfo;
  payment: PaymentInfo;
  products: Product[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Mock data - replace with actual API call
const mockOrderData: Record<string, OrderDetailData> = {
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
      },
      {
        id: 'p2',
        name: 'P. Blue Diamond',
        code: 'BD-002',
        size: '80 X 80 inch',
        imageUrl: undefined,
        quantity: 5,
      },
    ],
    status: 'pending',
  },
};

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'name' | 'code'>('name');
  const [products, setProducts] = useState<Product[]>([]);

  // Get order data - replace with actual API call
  const orderData = id ? mockOrderData[id] : undefined;

  React.useEffect(() => {
    if (orderData) {
      setProducts(orderData.products);
    }
  }, [orderData]);

  if (!orderData) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-600">Order not found</p>
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

  const handleQuantityChange = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  const handleProductEdit = (product: Product) => {
    console.log('Edit product:', product);
    // Navigate to edit page or open edit modal
  };

  const handleProductImageClick = (product: Product) => {
    // Navigate to product detail page
    navigate(`/admin/product/${product.id}`);
  };

  const handleDownloadCode = () => {
    console.log('Download code');
    // Implement download functionality
  };

  const handleDownloadName = () => {
    console.log('Download name');
    // Implement download functionality
  };

  const handleConfirmOrder = () => {
    console.log('Confirm order');
    // Implement confirm order functionality
  };

  const handleDeleteOrder = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      console.log('Delete order');
      // Implement delete order functionality
    }
  };

  const handleWhatsApp = () => {
    const message = `Order Details:\nCustomer: ${orderData.customer.name}\nTotal: ₹${orderData.payment.totalPayment}`;
    const url = `https://wa.me/${orderData.customer.mobileNo}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEditCustomer = () => {
    console.log('Edit customer');
    // Navigate to edit page or open edit modal
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>

            <h1 className="text-lg md:text-xl font-bold text-gray-900 flex-1 text-center px-4">
              List of Product
            </h1>

            <button
              onClick={handleEditCustomer}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Edit"
            >
              <Edit size={24} className="text-gray-900" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Customer Detail Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
              Customer detail
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">Name:</span>
                <span className="text-base md:text-lg text-gray-700">
                  {orderData.customer.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">Mo.No:</span>
                <a
                  href={`tel:${orderData.customer.mobileNo}`}
                  className="text-base md:text-lg text-gray-700 hover:text-green-600 transition-colors"
                >
                  {orderData.customer.mobileNo}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">Order Type:</span>
                <span className="text-base md:text-lg text-gray-700">
                  {orderData.customer.orderType}
                </span>
              </div>
            </div>
          </section>

          {/* Payment Detail Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
              Payment detail
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">
                  Transporotaion charge :
                </span>
                <span className="text-base md:text-lg text-gray-700">
                  {orderData.payment.transportationCharge}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">
                  Advance payment:
                </span>
                <span className="text-base md:text-lg text-gray-700">
                  {orderData.payment.advancePayment}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">
                  Remaining payment:
                </span>
                <span className="text-base md:text-lg text-gray-700">
                  {orderData.payment.remainingPayment}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
                <span className="text-lg md:text-xl font-bold text-gray-900">Total payment:</span>
                <span className="text-lg md:text-xl font-bold text-gray-900">
                  {orderData.payment.totalPayment.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h2>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('code')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'code'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Code view"
                >
                  <BarChart3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('name')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'name'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Name view"
                >
                  <Type size={20} />
                </button>
              </div>
            </div>

            {/* View Mode Labels */}
            <div className="flex justify-end gap-2 mb-3">
              <span className="text-sm text-gray-600">
                {viewMode === 'code' ? 'Code' : 'Name'}
              </span>
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleDownloadCode}
                className="flex items-center justify-center gap-2 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <Download size={20} />
                <span>Download Code</span>
              </button>
              <button
                onClick={handleDownloadName}
                className="flex items-center justify-center gap-2 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <Download size={20} />
                <span>Download Name</span>
              </button>
            </div>

            {/* Products List */}
            <div className="space-y-2">
              {products.map((product, index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  index={index + 1}
                  onQuantityChange={handleQuantityChange}
                  onEdit={handleProductEdit}
                  onImageClick={handleProductImageClick}
                  editable={orderData.status === 'pending'}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <p className="text-gray-600 font-medium">No products in this order</p>
              </div>
            )}
          </section>
        </main>

        {/* Bottom Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg z-10">
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
            <button
              onClick={handleConfirmOrder}
              disabled={orderData.status !== 'pending'}
              className="bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Confirm Order
            </button>
            <button
              onClick={handleDeleteOrder}
              className="bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Delete Order
            </button>
          </div>
        </div>

        {/* WhatsApp Floating Button */}
        <button
          onClick={handleWhatsApp}
          className="fixed bottom-24 right-4 md:right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 z-20"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={28} fill="white" />
        </button>
      </div>
    </PageContainer>
  );
};
