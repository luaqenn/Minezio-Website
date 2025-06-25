import Image from 'next/image';

interface AvatarProps {
  username: string;
  size?: number;
  className?: string;
}

export function Avatar({ username, size = 40, className = '' }: AvatarProps) {
  const avatarUrl = `https://minotar.net/avatar/${username}/${size}`;

  return (
    <Image
      src={avatarUrl}
      alt={`${username} adlı kullanıcının avatarı`}
      width={size}
      height={size}
      className={`rounded-md ${className}`}
      // Minotar gibi servisler her zaman stabil olmayabilir,
      // bu yüzden hata durumunda gösterilecek bir yedek resim eklemek iyi bir pratiktir.
      onError={(e) => {
        // Hedef elementin tipini kontrol ediyoruz
        const target = e.target as HTMLImageElement;
        // Yedek resim (steve)
        target.onerror = null; // Sonsuz döngüyü engelle
        target.src = `https://minotar.net/avatar/steve/${size}`;
      }}
    />
  );
}