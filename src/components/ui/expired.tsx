"use client";

import React from 'react';
import { Button } from './button';
import { useRouter } from 'next/navigation';

export const Expired = (error: any) => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-2xl font-bold">Lisans Doğrulama Hatası</div>
            <div className="text-sm text-gray-500">{error.error.message || "Lisansınız bir hata sebebiyle doğrulanamadı, lütfen https://crafter.net.tr/ adresini ziyaret edin."}</div>
            <Button onClick={() => router.push('https://crafter.web.tr/dashboard')} className="mt-4">Crafter Dashboard'a git</Button>
        </div>
    );
};


