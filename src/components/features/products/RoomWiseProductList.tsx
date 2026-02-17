import React from 'react';
import { Home, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Room, calculateRoomTotal, calculateGrandTotal } from '@/types/common/product.types';

interface RoomWiseProductListProps {
  rooms: Room[];
  title?: string;
  showGrandTotal?: boolean;
  collapsible?: boolean;
}

export const RoomWiseProductList: React.FC<RoomWiseProductListProps> = ({
  rooms,
  title = 'Products by Room',
  showGrandTotal = true,
  collapsible = false,
}) => {
  const [expandedRooms, setExpandedRooms] = React.useState<Set<string>>(
    new Set(rooms.map((room) => room.id))
  );

  const toggleRoom = (roomId: string) => {
    if (!collapsible) return;

    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(roomId)) {
      newExpanded.delete(roomId);
    } else {
      newExpanded.add(roomId);
    }
    setExpandedRooms(newExpanded);
  };

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <Home className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="text-gray-500">No rooms with products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
          <Home className="text-white" size={20} />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Rooms List */}
      <div className="space-y-4">
        {rooms.map((room, index) => {
          const isExpanded = expandedRooms.has(room.id);
          const roomTotal = calculateRoomTotal(room);

          return (
            <div
              key={room.id}
              className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
            >
              {/* Room Header */}
              <div
                className={`p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 ${
                  collapsible ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => toggleRoom(room.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Home className="text-green-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {room.name || `Room ${index + 1}`}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        {room.products.length} {room.products.length === 1 ? 'Product' : 'Products'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Total</p>
                      <p className="font-bold text-green-600 text-sm md:text-base">
                        ₹{roomTotal.toFixed(2)}
                      </p>
                    </div>
                    {collapsible && (
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="text-gray-400" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={20} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products List */}
              {isExpanded && (
                <div className="p-4 bg-white">
                  {room.products.length === 0 ? (
                    <div className="text-center py-6">
                      <Package className="mx-auto mb-2 text-gray-300" size={32} />
                      <p className="text-gray-500 text-sm">No products in this room</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {room.products.map((product, productIndex) => (
                        <div
                          key={product.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          {/* Product Image/Icon */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Package className="text-white" size={24} />
                              </div>
                            )}

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h5 className="font-medium text-gray-900 text-sm md:text-base truncate">
                                  {product.name}
                                </h5>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  #{productIndex + 1}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs md:text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Qty:</span> {product.quantity}
                                </div>
                                <div>
                                  <span className="font-medium">Rate:</span> ₹{product.rate.toFixed(2)}
                                </div>
                                <div className="font-semibold text-green-600">
                                  ₹{product.totalPrice.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grand Total */}
      {showGrandTotal && rooms.some((room) => room.products.length > 0) && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-md">
          <div className="flex justify-between items-center text-white">
            <div>
              <p className="text-sm opacity-90">Grand Total</p>
              <p className="text-xs opacity-75">
                {rooms.reduce((sum, room) => sum + room.products.length, 0)} total products
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl md:text-3xl font-bold">
                ₹{calculateGrandTotal(rooms).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
