import React, { useState, useMemo } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SearchInput } from '@/components/shared/ui/SearchInput';
import { ProductCard } from '@/components/features/products/ProductCard';
import { ProductWithBoxes } from '@/types/common/product.types';
import { Button } from '@/components/shared/ui/Button';

// Mock data - replace with API call
const MOCK_PRODUCTS: ProductWithBoxes[] = [
  {
    id: '1',
    name: 'MARQUINA INTENSO SOFT NATURALE',
    code: '25f580',
    date: '16/02/2026',
    quantity: { boxes: 6, piecesPerBox: 4 },
  },
  {
    id: '2',
    name: 'TRIANGLE LEMMY ASH MATT',
    code: '497b43',
    date: '16/02/2026',
    quantity: { boxes: 2, piecesPerBox: 4 },
  },
  {
    id: '3',
    name: 'LEMMY ASH MATT',
    code: '11750e',
    date: '16/02/2026',
    quantity: { boxes: 2, piecesPerBox: 4 },
  },
  {
    id: '4',
    name: 'TAJMAHAL SILVER MATT',
    code: 'c7148d',
    date: '16/02/2026',
    quantity: { boxes: 8, piecesPerBox: 4 },
  },
  {
    id: '5',
    name: 'SOLOMAN WHITE MATT',
    code: 'ccbcd0',
    date: '16/02/2026',
    quantity: { boxes: 8, piecesPerBox: 4 },
  },
];

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_PRODUCTS;

    const query = searchQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleProductWithBoxesClick = (product: ProductWithBoxes) => {
    console.log('ProductWithBoxes clicked:', product);
    // Navigate to product detail page or show modal
    // navigate(`/admin/products/${product.id}`);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Implement download logic here
      // Example: Generate PDF or CSV of products
      console.log('Downloading products...');

      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Example: Create CSV content
      const csvContent = [
        ['Date', 'ProductWithBoxes Name', 'Code', 'Boxes', 'Pieces/Box', 'Total'],
        ...filteredProducts.map(p => [
          p.date,
          p.name,
          p.code,
          p.quantity.boxes,
          p.quantity.piecesPerBox,
          p.quantity.boxes * p.quantity.piecesPerBox,
        ]),
      ]
        .map(row => row.join(','))
        .join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download products. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Products
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Search Bar */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
              className="mb-6"
            />

            {/* Products List */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-0">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductWithBoxesClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching "{searchQuery}"
                </p>
              </div>
            )}

            {/* Download Button */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 sticky bottom-20 md:bottom-6">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-gradient-to-br from-green-100 to-green-50 text-gray-900 font-bold text-lg py-4 hover:from-green-200 hover:to-green-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isDownloading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Download size={20} />
                      Download
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
