'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const CurrentSite = dynamic(() => import('@/components/generated/CurrentSite'), {
    loading: () => (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
    ),
    ssr: false,
});

export default function Preview() {
    return (
        <div className="w-full min-h-screen bg-white">
            <Suspense fallback={<div className="p-10">Loading preview...</div>}>
                <CurrentSite />
            </Suspense>
        </div>
    );
}
