"use client";

import { useRouter } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import Image from "next/image";
import headerBg from "@/assets/images/auth-bg-register.png";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function SignUp() {
  const { signUp } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    await signUp({ username, email, password, confirm_password })
      .then(() => {
        withReactContent(Swal).fire({
          title: "Kayıt Başarılı",
          text: "Kayıt işleminiz başarıyla tamamlandı. Yönlendiriliyorsunuz..",
          icon: "success",
          timer: 2000,
          confirmButtonText: "Tamam",
        }).then(() => {
          router.push("/");
        }) 
      })
      .catch((error) => {
        withReactContent(Swal).fire({
          title: "Kayıt Hatası",
          text: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      })
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
        <h1 className="text-2xl font-bold text-center mb-2">Kayıt Ol</h1>
        <p className="text-center text-sm mb-6">
          Sunucumuza katılmak için kayıt olun.
        </p>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
            <span className="text-blue-500">👤</span>
            <input
              type="text"
              className="form-input flex-1"
              name="username"
              placeholder="Kullanıcı Adı"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
            <span className="text-blue-500">📧</span>
            <input
              type="email"
              className="form-input flex-1"
              name="email"
              placeholder="E-Posta"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
            <span className="text-blue-500">🔒</span>
            <input
              type="password"
              className="form-input flex-1"
              name="password"
              placeholder="Şifre"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
            <span className="text-blue-500">🔒</span>
            <input
              type="password"
              className="form-input flex-1"
              name="confirm_password"
              placeholder="Şifre (Tekrar)"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="rules" className="form-checkbox" />
            <label htmlFor="rules" className="text-sm">
              I read the Rules and I accept.
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
          >
            Kayıt Ol
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Hesabınız mı var?{" "}
          <a href="/auth/sign-in" className="text-blue-500">
            Giriş Yap
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

