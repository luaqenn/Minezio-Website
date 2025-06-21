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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
    UserPlus 
} from "lucide-react";

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
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await signIn(username, password);
      // Sadece tam sayfa modundaysa yönlendirme yap
      if (!asWidget) {
        router.push("/");
      }
      // Widget modunda, başarılı giriş sonrası sayfa yenilenebilir veya
      // üst bileşen bir eylem tetikleyebilir. Şimdilik yönlendirme yok.
    } catch (err) {
      setError("Giriş bilgileri hatalı. Lütfen kontrol edip tekrar deneyin.");
      console.error("Giriş Hatası:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Kullanıcı Adı Alanı */}
      <div className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="kullaniciadiniz"
            className="pl-10 h-11"
            disabled={isLoading}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField(null)}
          />
        </div>
      </div>
      
      {/* Şifre Alanı */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Şifre</Label>
          {!asWidget && (
            <Link 
              href="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Şifremi unuttum
            </Link>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11"
            disabled={isLoading}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Giriş Butonu */}
      <Button
        type="submit"
        disabled={isLoading || !username || !password}
        className="w-full h-11 text-base font-semibold"
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
      </Button>
    </form>
  );

  return (
    <div className={`w-full ${asWidget ? '' : 'min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900'}`}>
      <Card className={`w-full ${asWidget ? 'border-none shadow-none bg-transparent' : 'max-w-md shadow-2xl bg-card/80 backdrop-blur-lg'}`}>
        {/* Card Header: Sadece tam sayfa modunda gösterilir */}
        {!asWidget && (
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Tekrar Hoş Geldiniz!</CardTitle>
            <CardDescription>Hesabınıza giriş yaparak maceraya devam edin.</CardDescription>
          </CardHeader>
        )}

        <CardContent className={asWidget ? 'p-0' : 'pt-0'}>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Giriş Başarısız</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {renderFormContent()}
        </CardContent>

        {/* Card Footer: asWidget prop'una göre farklı içerik gösterir */}
        <CardFooter className="flex flex-col items-center gap-4 pt-6">
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        {asWidget ? 'Veya' : 'Hesabınız yok mu?'}
                    </span>
                </div>
            </div>
          
            {asWidget ? (
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/sign-in">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Yeni Hesap Oluştur
                    </Link>
                </Button>
            ) : (
                <Button variant="secondary" className="w-full" asChild>
                    <Link href="/auth/sign-in">
                        Hemen Kayıt Olun
                    </Link>
                </Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}