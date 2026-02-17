import React from 'react';
import { Plus, Trash2, Home } from 'lucide-react';

export interface Room {
  id: string;
  name: string;
  quantity: string;
  size: string;
  price: string;
}

interface RoomInputProps {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
}

export const RoomInput: React.FC<RoomInputProps> = ({ rooms, onChange }) => {
  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      size: '',
      price: '',
    };
    onChange([...rooms, newRoom]);
  };

  const removeRoom = (id: string) => {
    onChange(rooms.filter((room) => room.id !== id));
  };

  const updateRoom = (id: string, field: keyof Room, value: string) => {
    onChange(
      rooms.map((room) =>
        room.id === id ? { ...room, [field]: value } : room
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Home size={16} />
          Room Details
        </label>
        <button
          type="button"
          onClick={addRoom}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1a4132] bg-[#d4e4d8] rounded-lg hover:bg-[#c4d4c8] transition-colors"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
          <Home className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-500 text-sm">No rooms added yet</p>
          <button
            type="button"
            onClick={addRoom}
            className="mt-3 text-[#1a4132] font-medium text-sm hover:underline"
          >
            Add your first room
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Room {index + 1}
                </span>
                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(room.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Room name (e.g., Living Room)"
                  value={room.name}
                  onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  value={room.quantity}
                  onChange={(e) => updateRoom(room.id, 'quantity', e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  placeholder="Size (e.g., 10x12 ft)"
                  value={room.size}
                  onChange={(e) => updateRoom(room.id, 'size', e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={room.price}
                  onChange={(e) => updateRoom(room.id, 'price', e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
