'use client';

import { useEffect, useState } from 'react';
import { ClientProfile, CompetitorAnalysis, SiteOption } from '@/types';
import { Loader2, Layout, Palette, Check } from 'lucide-react';

interface GenerationProps {
    profile: ClientProfile;
    analysis: CompetitorAnalysis;
    onSelect: (option: SiteOption) => void;
}

export default function Generation({ profile, analysis, onSelect }: GenerationProps) {
    const [status, setStatus] = useState('Architecting design concepts...');
    const [options, setOptions] = useState<SiteOption[]>([]);

    useEffect(() => {
        const generate = async () => {
            try {
                const res = await fetch('/api/propose', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile, analysis }),
                });

                if (!res.ok) throw new Error('Generation failed');

                const data = await res.json();
                setOptions(data.options);
                setStatus('Select a design direction:');
            } catch (error) {
                console.error(error);
                setStatus('Error generating options.');
            }
        };

        generate();
    }, [profile, analysis]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                {options.length === 0 && (
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
                )}
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{status}</h2>
            </div>

            {options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="group relative bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer flex flex-col h-full"
                            onClick={() => onSelect(option)}
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-indigo-600 text-white p-2 rounded-full">
                                    <Check className="w-4 h-4" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{option.theme}</p>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">{option.description}</p>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Features</span>
                                    <ul className="mt-2 space-y-1">
                                        {option.features.slice(0, 3).map((f, i) => (
                                            <li key={i} className="text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Palette</span>
                                    <div className="flex gap-2 mt-2">
                                        {/* @ts-ignore - assuming colorPalette exists on option from API even if not in strict type yet */}
                                        {option.colorPalette?.map((c: string, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full border border-slate-200" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white rounded-lg font-medium transition-colors">
                                Select This Design
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
