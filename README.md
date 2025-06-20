# 🎨 Crafter Default Theme

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Crafter](https://img.shields.io/badge/Crafter-CMS-orange?style=for-the-badge)](https://crafter.net.tr/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

Modern, özelleştirilebilir ve performanslı bir **[Crafter](https://crafter.net.tr/)** frontend teması. Next.js 15'ün gücüyle SSR/SSG desteği sunan, geliştirici dostu bir çözüm.

---

## ✨ Özellikler

- 🚀 **Next.js 15** ile modern React geliştirme deneyimi
- ⚡ **SSR/SSG** desteği ile yüksek performans
- 🔧 **Ortam değişkenleri** ile kolay yapılandırma
- 📦 **NPM** ve **Bun** paket yöneticisi desteği
- 🎯 **TypeScript** ile tip güvenli geliştirme
- 🧹 **Temiz kod yapısı** ve kolay özelleştirme
- 📱 **Responsive** tasarım desteği
- 🔌 **Crafter** ile sorunsuz entegrasyon

---

## 🚀 Hızlı Başlangıç

### 📋 Ön Koşullar

- Node.js 18+ veya Bun
- Crafter üzerinden lisans ve site bilgisi oluşturmak

### 1️⃣ Depoyu Klonlama

```bash
git clone https://github.com/EfeSorogluu/Crafter-Default-Theme.git
cd Crafter-Default-Theme
```

### 2️⃣ Bağımlılıkları Kurma

**NPM ile:**
```bash
npm install
```

**Bun ile:**
```bash
bun install
```

### 3️⃣ Ortam Değişkenlerini Ayarlama

Proje kök dizininde `.env` dosyası oluşturun:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Crafter Yapılandırması
NEXT_PUBLIC_WEBSITE_ID=
NEXT_PUBLIC_LICENCE_KEY=
NEXT_PUBLIC_BACKEND_URL=https://api.crafter.net.tr

# Geliştirme Modu (isteğe bağlı)
NODE_ENV=development
```

### 4️⃣ Geliştirme Sunucusunu Başlatma

**NPM ile:**
```bash
npm run dev
```

**Bun ile:**
```bash
bun dev
```

🎉 Uygulamanız artık [http://localhost:3000](http://localhost:3000) adresinde çalışıyor!

---

## 🛠️ Build ve Deployment

### Production Build

**NPM ile:**
```bash
npm run build
npm start
```

**Bun ile:**
```bash
bun run build
bun start
```

### Deployment Seçenekleri

- **Vercel**: Next.js'in yaratıcıları tarafından önerilen platform
- **Netlify**: Statik site deployment'ı için
- **Docker**: Konteyner tabanlı deployment

---

## 📂 Proje Yapısı

```
Crafter-Default-Theme/
├── 📁 app/                     # Next.js App Router dizini
│   ├── globals.css             # Global stiller
│   ├── layout.tsx              # Ana layout komponenti
│   └── page.tsx                # Ana sayfa komponenti
├── 📁 public/                 # Statik dosyalar (resimler, favicon vs.)
├── 📁 lib/                    # Yardımcı fonksiyonlar ve servisler
│   └── ...                    # Crafter API entegrasyon dosyaları
├── 📁 components/            # Yeniden kullanılabilir React bileşenleri
├── 📁 styles/                # CSS modülleri ve stil dosyaları
├── 📄 .env.example           # Ortam değişkeni şablonu
├── 📄 next.config.js         # Next.js yapılandırması
├── 📄 package.json           # Proje bağımlılıkları
├── 📄 tsconfig.json          # TypeScript yapılandırması
└── 📄 README.md              # Bu dosya
```

---

## 🔧 Yapılandırma

### Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `NEXT_PUBLIC_WEBSITE_ID` | Crafter site ID numarası | - |
| `NEXT_PUBLIC_LICENSE_KEY` | Crafter site lisans anahtarı | - |
| `NEXT_PUBLIC_BACKEND_URL` | Crafter base URL'i | `https://api.crafter.net.tr` |

### Next.js Yapılandırması

`next.config.js` dosyasında özelleştirmelerinizi yapabilirsiniz:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Crafter ile çalışmak için gerekli ayarlar
  images: {
    domains: ['localhost', 'api.crafter.net.tr'],
  },
}

module.exports = nextConfig
```

---

## 🎨 Özelleştirme

### Stil Değişiklikleri

- **Global stiller**: `app/globals.css`
- **Component stilleri**: `styles/` dizini
- **Tailwind CSS**: Kurulu ve kullanıma hazır

### Yeni Bileşenler Ekleme

```typescript
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
    </div>
  );
}
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen şu adımları takip edin:

1. 🍴 Projeyi fork edin
2. 🌿 Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. 💾 Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. 📤 Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. 🔀 Pull Request oluşturun

---

## 🐛 Sorun Bildirimi

Bir sorunla karşılaştınız mı? [Issue açmaktan](https://github.com/EfeSorogluu/Crafter-Default-Theme/issues) çekinmeyin!

Sorun bildirirken lütfen şunları belirtin:
- İşletim sistemi ve sürümü
- Node.js/Bun sürümü
- Hata mesajı (varsa)
- Yeniden üretme adımları

---

## 📚 Faydalı Kaynaklar

- 📖 [Next.js Dokümantasyonu](https://nextjs.org/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 📝 [TypeScript Rehberi](https://www.typescriptlang.org/docs/)

---

## 📄 Lisans

Bu proje **MIT** lisansı ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

---

## ✉️ İletişim

**Mert Efe Soroğlu** - [@EfeSorogluu](https://github.com/EfeSorogluu)

📧 Sorularınız için: [Issue açın](https://github.com/EfeSorogluu/Crafter-Default-Theme/issues) veya doğrudan benimle iletişime geçin.

---

<div align="center">

⭐ **Projeyi beğendiyseniz yıldız vermeyi unutmayın!** ⭐

Made with ❤️ by [Efe Soroğlu](https://github.com/EfeSorogluu)

</div>
