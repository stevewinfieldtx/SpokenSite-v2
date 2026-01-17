'use client';

import { useEffect, useState } from 'react';
import { ClientProfile } from '@/types';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface AnalysisProps {
    transcript: string;
    onComplete: (profile: ClientProfile) => void;
}

export default function Analysis({ transcript, onComplete }: AnalysisProps) {
    const [status, setStatus] = useState('Analyzing conversation...');
    const [profile, setProfile] = useState<ClientProfile | null>(null);

    useEffect(() => {
        const analyze = async () => {
            try {
                setStatus('Extracting business profile...');
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transcript }),
                });

                if (!res.ok) throw new Error('Analysis failed');

                const data = await res.json();
                setProfile(data);
                setStatus('Analysis complete!');

                // Auto-proceed after a delay or let user review
                setTimeout(() => onComplete(data), 2000);
            } catch (error) {
                console.error(error);
                setStatus('Error during analysis.');
            }
        };

        analyze();
    }, [transcript, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                {profile ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                ) : (
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
                )}
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{status}</h2>
            </div>

            {profile && (
                <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-semibold mb-4">Strategy Profile</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-slate-500">Business Name</span>
                            <p className="text-lg">{profile.businessName}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-500">Tone & Emotion</span>
                            <div className="flex gap-2 mt-1">
                                {profile.tone.map(t => (
                                    <span key={t} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-sm">
                                        {t}
                                    </span>
                                ))}
                                {profile.emotions.map(e => (
                                    <span key={e} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
