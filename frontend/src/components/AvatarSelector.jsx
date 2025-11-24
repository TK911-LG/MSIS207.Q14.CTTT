import React, { useState } from 'react';
import { Image, Upload, X } from 'phosphor-react';

// Danh sách avatar đẹp có sẵn từ DiceBear và các nguồn khác
const presetAvatars = [
  // DiceBear Avataaars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c7a2f0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia&backgroundColor=ffd93d',
  
  // DiceBear Notionists
  'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=c7a2f0',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Emma&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/notionists/svg?seed=James&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Olivia&backgroundColor=ffd93d',
  
  // DiceBear Personas
  'https://api.dicebear.com/7.x/personas/svg?seed=Alex&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/personas/svg?seed=Sarah&backgroundColor=c7a2f0',
  'https://api.dicebear.com/7.x/personas/svg?seed=Michael&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/personas/svg?seed=Emma&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/personas/svg?seed=James&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/personas/svg?seed=Olivia&backgroundColor=ffd93d',
  
  // DiceBear Fun-emoji
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Alex',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Michael',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Emma',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=James',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Olivia',
];

const AvatarSelector = ({ currentAvatar, onSelect, onUpload }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const handlePresetSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setUploadedImage(null);
    setUploadPreview(null);
    onSelect(avatarUrl);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setUploadPreview(result);
      setUploadedImage(result);
      setSelectedAvatar(result);
      onSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUpload = () => {
    setUploadedImage(null);
    setUploadPreview(null);
    setSelectedAvatar(null);
    onSelect(null);
  };

  return (
    <div className="space-y-6">
      {/* Current Avatar Preview */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-stone-100 border-4 border-stone-200 overflow-hidden flex items-center justify-center">
            {selectedAvatar ? (
              <img
                src={selectedAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#5E8B7E] to-[#4a7a6d] flex items-center justify-center text-white text-2xl font-bold">
                {currentAvatar ? '?' : '?'}
              </div>
            )}
          </div>
          {selectedAvatar && selectedAvatar !== currentAvatar && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#5E8B7E] rounded-full flex items-center justify-center text-white text-xs font-bold">
              New
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-stone-800 mb-1">Current Avatar</h4>
          <p className="text-sm text-stone-500">
            {selectedAvatar ? 'Preview of your new avatar' : 'No avatar selected'}
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div>
        <label className="block text-xs font-bold text-stone-500 uppercase mb-3">
          Upload Your Image
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-200 rounded-xl hover:border-[#5E8B7E] hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#E7F3F0] flex items-center justify-center text-[#5E8B7E]">
                <Upload size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-800">Click to upload</p>
                <p className="text-xs text-stone-400">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </label>
          {uploadPreview && (
            <button
              onClick={handleRemoveUpload}
              className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
              title="Remove uploaded image"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {uploadPreview && (
          <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <p className="text-xs text-stone-600">
              ✓ Image uploaded successfully. Click "Save Changes" to apply.
            </p>
          </div>
        )}
      </div>

      {/* Preset Avatars */}
      <div>
        <label className="block text-xs font-bold text-stone-500 uppercase mb-3">
          Or Choose from Presets
        </label>
        <div className="grid grid-cols-6 gap-3">
          {presetAvatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => handlePresetSelect(avatar)}
              className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                selectedAvatar === avatar
                  ? 'border-[#5E8B7E] ring-2 ring-[#5E8B7E] ring-offset-2'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedAvatar === avatar && (
                <div className="absolute inset-0 bg-[#5E8B7E]/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#5E8B7E] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;

