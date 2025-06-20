"use client";

import { useRouter } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import Image from "next/image";
import headerBg from "@/assets/images/auth-bg-login.jpg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function SignIn() {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    await signIn(username, password)
      .then(() => {
        withReactContent(Swal)
          .fire({
            title: "Giriş Başarılı",
            text: "Giriş işleminiz başarıyla tamamlandı. Yönlendiriliyorsunuz..",
            icon: "success",
            timer: 2000,
            confirmButtonText: "Tamam",
          })
          .then(() => {
            router.push("/");
          });
      })
      .catch((error) => {
        withReactContent(Swal).fire({
          title: "Giriş Hatası",
          text: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex flex-col justify-center items-center w-1/3 bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/images/header-logo.png"
            alt="Logo"
            width={150}
            height={50}
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Giriş Yap</h1>
        <p className="text-gray-600 text-center mb-6">
          Hesabınıza erişmek için giriş yapın.
        </p>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
            <span className="text-blue-500">👤</span>
            <input
              type="text"
              className="form-input flex-1 outline-none"
              name="username"
              placeholder="Kullanıcı Adı"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
            <span className="text-blue-500">🔒</span>
            <input
              type="password"
              className="form-input flex-1 outline-none"
              name="password"
              placeholder="Şifre"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="form-checkbox" />
              <label htmlFor="remember" className="text-sm">
                Beni hatırla
              </label>
            </div>
            <a href="#" className="text-sm text-blue-500">
              ŞİFREMİ UNUTTUM
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Hesabınız yok mu?{" "}
          <a href="/auth/sign-up" className="text-blue-500">
            Kayıt Ol
          </a>
        </p>
        <p className="text-center mt-4 text-xs text-gray-500">
          Powered by Crafter
        </p>
      </div>
      <div className="w-full relative">
        <Image
          src={headerBg}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
