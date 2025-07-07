"use client";

import { useState, useEffect, useContext } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import Image from 'next/image';
import MinecraftIcon from '../../../public/icons/MinecraftIcon.png';
import CubeIcon from "@/assets/icons/minecraft/CubeIcon";
import { ServerIcon } from "lucide-react";

type Props = {
  status: {
    online: boolean;
    players?: { online: number; max: number };
    version?: string;
    type?: string;
  } | null;
};

export default function ServerStatusBar({ status }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const { website } = useContext(WebsiteContext);
  const serverAddress = website?.servers[0]?.ip || "SUNUCU BULUNAMADI";

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(serverAddress).catch((err) => {
    });
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          handleCopy();
        }}
        className="cursor-pointer hidden md:flex items-center md:justify-end gap-4"
      >
        <div className="header-icon w-14 h-14 bg-blue-100/10 rounded-lg flex items-center justify-center relative">
          <div className="relative inline-flex">
            <ServerIcon/>
            <span
              className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                ${status === null ? 'bg-yellow-400' : status.online ? 'bg-green-400' : 'bg-red-400'}
                -translate-y-1/2 translate-x-1/2`}
              title={status === null ? 'Yükleniyor' : status.online ? 'Online' : 'Offline'}
            />
          </div>
        </div>
        <div className="font-medium">
          <div className="text-gray-300">
            {status ? (
              status.online ? (
                <span className="text-green-400">
                  {status.players?.online ?? 0}/{status.players?.max ?? 0}
                </span>
              ) : (
                <span className="text-red-400">OFFLINE</span>
              )
            ) : (
              <span className="text-yellow-400">-/-</span>
            )}{" "}
            Oyuncu Aktif
          </div>

          {isCopied ? (
            <span className="text-green-400 text-sm uppercase opacity-100 transform animate-fade-in">
              SUNUCU ADRESİ KOPYALANDI!
            </span>
          ) : (
            <span className="text-white text-sm uppercase opacity-50">
              {serverAddress || ""}
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}
