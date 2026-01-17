'use client';

import { useEffect, useState } from 'react';
import { ClientProfile, CompetitorAnalysis } from '@/types';
import { Loader2, TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface ResearchProps {
    profile: ClientProfile;
    onComplete: (analysis: CompetitorAnalysis) => void;
}

export default function Research({ profile, onComplete }: ResearchProps) {
    const [status, setStatus] = useState('Searching the web for competitors...');
    const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);

    useEffect(() => {
        const research = async () => {
            try {
                const res = await fetch('/api/research', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile }),
                });

                if (!res.ok) throw new Error('Research failed');

                const data = await res.json();
                setAnalysis(data);
                setStatus('Research complete!');

                // Auto-proceed
                setTimeout(() => onComplete(data), 3000);
            } catch (error) {
                console.error(error);
                setStatus('Error during research.');
            }
        };

        research();
    }, [profile, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                {!analysis && (
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
                )}
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{status}</h2>
            </div>

            {analysis && (
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="text-green-500" /> Market Gaps
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                            {analysis.marketGaps.map((gap, i) => (
                                <li key={i}>{gap}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Target className="text-indigo-500" /> Strategy
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">{analysis.recommendedStrategy}</p>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-semibold mb-4">Competitor Insights</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {analysis.competitors.map((comp, i) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <h4 className="font-bold mb-2">{comp.name}</h4>
                                    <div className="text-sm space-y-2">
                                        <p className="text-green-600 dark:text-green-400"><strong>+</strong> {comp.strengths[0]}</p>
                                        <p className="text-red-600 dark:text-red-400"><strong>-</strong> {comp.weaknesses[0]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
