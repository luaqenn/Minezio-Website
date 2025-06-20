"use client";

import React from 'react';
import { Button } from './button';
import { useRouter } from 'next/navigation';

export const Expired = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-2xl font-bold">Lisans Süresi Doldu</div>
            <div className="text-sm text-gray-500">Lisans süreniz doldu. Lütfen lisansınızı yenileyiniz.</div>
            <Button onClick={() => router.push('https://crafter.web.tr/dashboard')} className="mt-4">Crafter Dashboard'a git</Button>
        </div>
    );
};


