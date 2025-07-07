// components/auth-form.tsx

"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Context
import { AuthContext } from "@/lib/context/auth.context";

// Shadcn UI ve Lucide React
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  UserPlus,
  DoorOpen
} from "lucide-react";

// Widget Component
import Widget from "@/components/widgets/widget";
import { Head } from "@/components/ui/body";

// SweetAlert2
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Props Tipi
interface AuthFormProps {
  asWidget?: boolean;
}

export function AuthForm({ asWidget = false }: AuthFormProps) {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();

  // State'ler
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form gönderim fonksiyonu
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Kullanıcı adı ve şifre alanları zorunludur.");
      withReactContent(Swal).fire({
        title: "Eksik Bilgi",
        text: "Kullanıcı adı ve şifre alanları zorunludur.",
        icon: "warning",
        confirmButtonText: "Tamam",
      });
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await signIn(username, password);
      // Giriş başarılıysa swal göster
      await withReactContent(Swal).fire({
        title: "Giriş Başarılı",
        text: "Giriş işleminiz başarıyla tamamlandı. Yönlendiriliyorsunuz...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      // Sadece tam sayfa modundaysa yönlendirme yap
      if (!asWidget) {
        router.push("/");
      }
      // Widget modunda, başarılı giriş sonrası sayfa yenilenebilir veya
      // üst bileşen bir eylem tetikleyebilir. Şimdilik yönlendirme yok.
    } catch (err) {
      setError("Giriş bilgileri hatalı. Lütfen kontrol edip tekrar deneyin.");
      withReactContent(Swal).fire({
        title: "Giriş Hatası",
        text: "Giriş bilgileri hatalı. Lütfen kontrol edip tekrar deneyin.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar + Kullanıcı Adı Alanı */}
      <div className="flex flex-col items-center space-y-2 mb-2">
        <div className="relative group">
          <Head username={username || "MHF_Steve"} size={64} className="shadow-lg border-2 border-blue-400 group-hover:scale-105 transition-transform duration-300 bg-white" />
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-blue-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300 select-none">
            {username ? `${username} karakteri` : "Steve karakteri"}
          </span>
        </div>
      </div>
      {/* Kullanıcı Adı Alanı */}
      <div className="space-y-2">
        <Label htmlFor="username" className="sr-only">
          Kullanıcı Adı
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı Adı"
            className="form-input block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm transition-all duration-300 animate-pulse"
            disabled={isLoading}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField(null)}
            autoComplete="username"
          />
        </div>
      </div>
      {/* Şifre Alanı */}
      <div className="space-y-2">
        <Label htmlFor="password" className="sr-only">
          Şifre
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="form-input block w-full pl-10 pr-10 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm transition-all duration-300"
            disabled={isLoading}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            disabled={isLoading}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {/* Giriş Butonu */}
      <button
        type="submit"
        disabled={isLoading || !username || !password}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-bounce"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Giriş Yapılıyor...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-5 w-5" />
            Giriş Yap
          </>
        )}
      </button>
    </form>
  );

  // Widget modu için render
  if (asWidget) {
    return (
      <Widget className="overflow-visible">
        <Widget.Header className="relative flex items-center min-h-[80px] pr-20 overflow-visible">
          <span className="flex items-center gap-1 text-lg font-semibold">
            <DoorOpen className="h-6 w-6 text-blue-700 dark:text-cyan-200 shadow-[0_2px_16px_0_rgba(34,211,238,0.08)]" />
            Giriş Yap
          </span>
          <div
            className="overflow-hidden absolute -right-0 -top-10"
            style={{ zIndex: 10, width: 100, height: 120 }}
          >
            <Head username={username || "MHF_Steve"} size={200} />
          </div>
        </Widget.Header>
        <Widget.Body>
          <div className="flex flex-row items-center gap-4 p-2 sm:p-4">
            {/* Sol: Form Alanı */}
            <div className="flex-1 min-w-0">
              {error && (
                <Alert variant="destructive" className="mb-3 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <AlertTitle className="text-xs">Giriş Başarısız</AlertTitle>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="username" className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                    Kullanıcı Adı
                  </Label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı Adı"
                    className="form-input block w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                    Şifre
                  </Label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre"
                    className="form-input block w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !username || !password}
                  className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Giriş Yapılıyor...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Giriş Yap
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          {/* Widget footer */}
          <div className="mt-4 pt-4 border-t border-white/10 dark:border-gray-700/50">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              Hesabınız yok mu?
            </div>
            <Link
              href="/auth/sign-up"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Yeni Hesap Oluştur
            </Link>
          </div>
        </Widget.Body>
      </Widget>
    );
  }

  // Tam sayfa modu için render
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Tekrar Hoş Geldiniz!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Hesabınıza giriş yaparak maceraya devam edin.
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Giriş Başarısız</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {renderFormContent()}
          </div>

          {/* Footer */}
          <div className="p-6 pt-0">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Hesabınız yok mu?
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/auth/sign-up"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                Hemen Kayıt Olun
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}