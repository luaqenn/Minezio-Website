"use client";

import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { AuthForm } from "@/components/auth-form";
import { TopBar } from "@/components/top-bar";
import Link from "next/link";
import Header from "@/components/header";
import { WebsiteContext } from "@/lib/context/website.context";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext)

  return (
    <main>
      <TopBar broadcastItems={website.broadcast_items} />
      <Header />

      {/* Main Content */}
      <section className="container mx-auto py-20 pb-8">
        <div className={isAuthenticated ? "" : "grid gap-6 lg:grid-cols-12 items-start"}>
          {/* Left Side - Slider */}
          <div className={`rounded-2xl ${!isAuthenticated ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <div className="carousel zippy-carousel relative overflow-hidden rounded-2xl">
              <div className="inner">
                <div
                  className="los-slide active relative h-[400px]"
                  style={{
                    backgroundImage: "url('/images/header-bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="text-center md:text-left h-full flex flex-col justify-center p-6 relative z-30">
                    <div className="text-white text-2xl font-semibold">Play Now!</div>
                    <p className="text-white/75">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, sapiente quam. Rerum voluptatibus placeat blanditiis sapiente dignissimos veritatis porro earum.
                    </p>
                    <Link
                      href="/play"
                      className="w-fit mx-auto md:mx-0 rounded-md rounded-tr-xl rounded-bl-xl py-2 px-3 font-medium text-white opacity-75 transition duration-300 hover:opacity-100 bg-green-500 mt-3 block"
                    >
                      Bağlantıya git
                    </Link>
                  </div>

                  {/* Background effect */}
                  <div className="bg-black/25 absolute z-20 top-0 left-0 h-full w-full">
                    <div className="absolute top-0 left-0 h-full w-full bg-green-900/25" />
                    <div className="absolute z-10 top-0 left-0 h-full w-full bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                  </div>
                </div>
              </div>
              <ul className="indicators" />
            </div>
          </div>

          {/* Right Side - Login Form */}
          {!isAuthenticated && (
            <div className="lg:col-span-4">
              <AuthForm asWidget={true} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}