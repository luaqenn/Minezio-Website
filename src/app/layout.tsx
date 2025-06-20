// src/app/layout.tsx

import "@/styles/globals.css";
import { WebsiteProvider } from "@/lib/context/website.context";
import { AuthProvider } from "@/lib/context/auth.context";
import { MainLayout } from "@/components/main-layout"; // Yeni bileşeni import edin

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <WebsiteProvider>
          <AuthProvider>
            {/* Provider'ların içine yeni client component'imizi yerleştiriyoruz.
              Bu component, provider'ların context'ine erişebilir ve
              içine aldığı {children}'ı (yani sayfalarımızı) render edebilir.
            */}
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </WebsiteProvider>
      </body>
    </html>
  );
}