import React from 'react';
import { LoaderCircle } from 'lucide-react';

export const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <LoaderCircle className="animate-spin" />
        </div>
    );
};


