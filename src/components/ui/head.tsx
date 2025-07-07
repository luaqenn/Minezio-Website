import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  username: string;
  size?: number;
  className?: string;
}

export function Head({ username, size = 40, className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  
  const avatarUrl = `https://mc-heads.net/head/${username}/${size}/left`;
  const fallbackUrl = `https://mc-heads.net/head/MHF_Steve/${size}/left`;

  // Eğer hem ana resim hem de fallback resim yüklenemezse, varsayılan bir div göster
  if (imageError && fallbackError) {
    return (
      <div 
        className={`bg-gray-300 flex items-center justify-center text-gray-600 font-medium ${className}`}
        style={{ width: size, height: size }}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={imageError ? fallbackUrl : avatarUrl}
      alt={`${username} adlı kullanıcının avatarı`}
      width={size}
      height={size}
      className={`rounded-md ${className}`}
      onError={(e) => {
        if (!imageError) {
          // İlk hata - fallback resmi dene
          setImageError(true);
        } else if (!fallbackError) {
          // Fallback resmi de başarısız - sonsuz döngüyü engelle
          setFallbackError(true);
          e.currentTarget.onerror = null;
        }
      }}
    />
  );
}