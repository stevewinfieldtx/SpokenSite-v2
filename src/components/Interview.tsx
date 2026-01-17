'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { CheckCircle, AlertCircle } from 'lucide-react';

<p className="text-slate-600 dark:text-slate-400">
    Speak with the AI agent below.
</p>
            </div >

    {/* ElevenLabs Widget */ }
    < div className = "w-full max-w-md flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 min-h-[200px]" >
                <elevenlabs-convai
                    ref={widgetRef}
                    agent-id="agent_5201ke72y6r1fpx9nv541p6d6tah"
                ></elevenlabs-convai>
                <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
            </div >

    {/* Transcript / Notes Area */ }
    < div className = "w-full max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4" >
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Interview Transcript & Notes
                    </label>
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                        <AlertCircle className="w-3 h-3" />
                        <span>Please ensure key details are captured here</span>
                    </div>
                </div>

                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="The agent's transcript should appear here. If not, please summarize the key points: Business name, industry, goals, and unique selling points."
                    className="w-full h-48 p-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
                />

                <button
                    onClick={() => onComplete(summary || "Client wants a professional website.")}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                >
                    <CheckCircle className="w-5 h-5" />
                    Generate Website Plan
                </button>
            </div >
        </div >
    );
}
