import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  imageUrl?: string;
  name: string;
  onImageChange?: (file: File) => void;
  editable?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  name,
  onImageChange,
  editable = false,
}) => {
  const [preview, setPreview] = useState<string | undefined>(imageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Pass file to parent
      onImageChange(file);
    }
  };

  const getInitials = () => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto">
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-xl">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl md:text-4xl font-bold text-gray-700">
              {getInitials()}
            </span>
          )}
        </div>
      </div>

      {editable && (
        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-200 transform hover:scale-110 active:scale-95">
          <Camera size={18} />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
