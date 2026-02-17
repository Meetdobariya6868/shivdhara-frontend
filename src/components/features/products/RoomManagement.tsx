import React, { useState } from 'react';
import { Home, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';
import { ProductSelectorModal } from './ProductSelectorModal';

export interface RoomProduct {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  products: RoomProduct[];
}

interface RoomManagementProps {
  rooms: Room[];
  onRoomsChange: (rooms: Room[]) => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({
  rooms,
  onRoomsChange,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Add new room
  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: '',
      products: [],
    };
    onRoomsChange([...rooms, newRoom]);
  };

  // Update room name
  const handleRoomNameChange = (roomId: string, name: string) => {
    const updatedRooms = rooms.map((room) =>
      room.id === roomId ? { ...room, name } : room
    );
    onRoomsChange(updatedRooms);
  };

  // Remove room
  const handleRemoveRoom = (roomId: string) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    onRoomsChange(updatedRooms);
  };

  // Open product selector modal
  const handleOpenProductModal = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsProductModalOpen(true);
  };

  // Add product to room
  const handleAddProduct = (product: RoomProduct) => {
    if (!selectedRoomId) return;

    const updatedRooms = rooms.map((room) =>
      room.id === selectedRoomId
        ? { ...room, products: [...room.products, product] }
        : room
    );
    onRoomsChange(updatedRooms);
    setIsProductModalOpen(false);
    setSelectedRoomId(null);
  };

  // Remove product from room
  const handleRemoveProduct = (roomId: string, productId: string) => {
    const updatedRooms = rooms.map((room) =>
      room.id === roomId
        ? {
            ...room,
            products: room.products.filter((p) => p.id !== productId),
          }
        : room
    );
    onRoomsChange(updatedRooms);
  };

  return (
    <>
      {/* Room Management Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm p-4 md:p-6 border border-green-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
              <Home className="text-white" size={20} />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Room Management
            </h2>
          </div>
          <Button
            type="button"
            onClick={handleAddRoom}
            className="flex items-center gap-2 !py-2 !px-4 md:!px-6 text-sm md:text-base"
          >
            <Plus size={18} />
            <span>Add Room</span>
          </Button>
        </div>

        {/* Rooms List */}
        {rooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <Home className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-500 text-sm md:text-base">
              No rooms added yet. Click "Add Room" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Room Header */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Room {index + 1}
                      </label>
                      <input
                        type="text"
                        value={room.name}
                        onChange={(e) =>
                          handleRoomNameChange(room.id, e.target.value)
                        }
                        placeholder="Enter room name (e.g., Living Room)"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm md:text-base"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => handleOpenProductModal(room.id)}
                        className="flex items-center gap-2 !py-2 !px-4 text-sm whitespace-nowrap"
                      >
                        <Plus size={16} />
                        <span>Add Product</span>
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(room.id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Room"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="p-4">
                  {room.products.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto mb-2 text-gray-300" size={40} />
                      <p className="text-gray-500 text-sm">
                        No products added yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {room.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Package className="text-white" size={24} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs md:text-sm text-gray-600">
                                Qty: {product.quantity} × ₹{product.rate.toFixed(2)} = ₹
                                {product.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveProduct(room.id, product.id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-auto"
                            title="Remove Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {/* Room Total */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700 text-sm md:text-base">
                            Room Total:
                          </span>
                          <span className="text-lg md:text-xl font-bold text-green-600">
                            ₹
                            {room.products
                              .reduce((sum, p) => sum + p.totalPrice, 0)
                              .toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grand Total */}
        {rooms.length > 0 && rooms.some((room) => room.products.length > 0) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-md">
            <div className="flex justify-between items-center text-white">
              <span className="text-base md:text-lg font-semibold">
                Grand Total:
              </span>
              <span className="text-xl md:text-2xl font-bold">
                ₹
                {rooms
                  .reduce(
                    (total, room) =>
                      total +
                      room.products.reduce((sum, p) => sum + p.totalPrice, 0),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product Selector Modal */}
      {isProductModalOpen && (
        <ProductSelectorModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedRoomId(null);
          }}
          onAddProduct={handleAddProduct}
        />
      )}
    </>
  );
};
