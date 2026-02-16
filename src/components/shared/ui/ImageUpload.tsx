import React, { useRef, useState } from 'react';
import { ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null, previewUrl: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onChange?.(file, previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange?.(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        onClick={handleClick}
        className={`relative w-52 h-72 bg-[#D9E5D6] rounded-3xl flex flex-col items-center justify-center overflow-hidden border-2 border-gray-300 ${
          !disabled ? 'cursor-pointer hover:bg-[#c9d5c6]' : 'cursor-not-allowed opacity-60'
        } transition-all`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain p-2"
            />
            {!disabled && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <ImageIcon size={32} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-700">
              Choose Photo
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
