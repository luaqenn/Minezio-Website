"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import Image from "next/image";
import headerBg from "@/assets/images/auth-bg-login.jpg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { WebsiteContext } from "@/lib/context/website.context";
import { LockIcon, UserIcon } from "lucide-react";
import Turnstile from "react-turnstile";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignIn() {
  const { signIn } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  // DEBUG ve gereksiz fonksiyonlar kaldırıldı
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileKey, setTurnstileKey] = useState(1);
  const [loginError, setLoginError] = useState(0);

  // Sadece react-turnstile için gerekli reset fonksiyonu
  const forceResetTurnstile = () => {
    setTurnstileToken("");
    setTurnstileKey((prev) => prev + 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    if (website?.security?.cf_turnstile?.site_key && !turnstileToken) {
      withReactContent(Swal).fire({
        title: "Doğrulama Gerekli",
        text: "Lütfen güvenlik doğrulamasını tamamlayın.",
        icon: "warning",
        confirmButtonText: "Tamam",
      });
      setLoginError((prev) => prev + 1);
      return;
    }
    const payload: any = { username, password };
    if (website?.security?.cf_turnstile?.site_key && turnstileToken) {
      payload.turnstileToken = turnstileToken;
    }
    try {
      await signIn(payload.username, payload.password, payload.turnstileToken);
      withReactContent(Swal).fire({
        title: "Giriş Başarılı",
        text: "Giriş işleminiz başarıyla tamamlandı. Yönlendiriliyorsunuz...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      const returnPath = searchParams.get("return");
      router.push(returnPath && returnPath.startsWith("/") ? returnPath : "/");
    } catch (e: any) {
      setLoginError((prev) => prev + 1);
      withReactContent(Swal)
        .fire({
          title: "Giriş Hatası",
          text: e.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
    }
  };

  useEffect(() => {
    if (loginError > 0) {
      forceResetTurnstile();
    }
  }, [loginError]);

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Left Column: Image and Welcome Text (Visible on Medium screens and up) */}
      <div className="relative hidden md:flex w-full md:w-1/2 flex-col items-center justify-center text-white text-center p-8 bg-gradient-to-br from-sky-400 to-blue-600 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0">
          <Image
            src={headerBg}
            alt="Arka Plan"
            layout="fill"
            objectFit="cover"
            className="opacity-20 dark:opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                website?.image || "/images/default-logo.png"
              }`}
              alt="Logo"
              width={200}
              height={200}
              objectFit="contain"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Tekrar Hoş Geldiniz!
          </h1>
          <p className="mt-4 text-lg max-w-sm">
            {website?.name} içindeki tüm özelliklere ve hesabınıza erişin!
          </p>
        </div>
      </div>

      {/* Right Column: Sign-In Form */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-900"
        style={{ backgroundImage: "url('/images/background.png')" }}
      >
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-8">
            <div className="w-40 h-12 relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                  website?.image || "/images/default-logo.png"
                }`}
                alt="Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Giriş Yap
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2 mb-8">
            Hesabınıza erişmek için bilgilerinizi girin.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* loginError debug gösterimi kaldırıldı */}
            <div>
              <label htmlFor="username" className="sr-only">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-input block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Kullanıcı Adı"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Şifre"
                />
              </div>
            </div>

            {/* Turnstile CAPTCHA sadece cf_turnstile varsa göster */}
            {website?.security?.cf_turnstile?.site_key && (
              <div className="flex justify-center">
                <Turnstile
                  key={turnstileKey}
                  sitekey={website.security.cf_turnstile.site_key}
                  theme={"auto"}
                  size="normal"
                  onVerify={setTurnstileToken}
                  onExpire={forceResetTurnstile}
                  onError={forceResetTurnstile}
                  className="my-2"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-900 dark:text-gray-200"
                >
                  Beni hatırla
                </label>
              </div>
              <a
                href="#"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Şifremi unuttum
              </a>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Giriş Yap
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
            Hesabınız yok mu?{" "}
            <a
              href="/auth/sign-up"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              Hemen Kayıt Ol
            </a>
          </p>

          <p className="flex flex-row items-center justify-center text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
            Powered by{" "}
            <Link
              href={"https://crafter.net.tr/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/images/crafter.png"}
                alt={""}
                width={90}
                height={30}
              />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
