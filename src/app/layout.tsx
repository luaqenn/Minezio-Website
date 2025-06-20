import "@/styles/globals.css";
import { WebsiteProvider } from "@/lib/context/website.context";
import { AuthProvider } from "@/lib/context/auth.context";

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
            {children}
          </AuthProvider>
        </WebsiteProvider>
      </body>
    </html>
  );
}
