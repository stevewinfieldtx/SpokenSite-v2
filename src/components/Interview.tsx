'use client';

import { useState, useCallback } from 'react';
import { Conversation } from '@11labs/client';
import { Mic, Square, Loader2 } from 'lucide-react';

interface InterviewProps {
    onComplete: (conversationId: string) => void;
}

export default function Interview({ onComplete }: InterviewProps) {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'finished'>('idle');
    const [conversation, setConversation] = useState<any>(null); // Conversation type is slightly complex, using any for safety or I can import the type if available
    const [conversationId, setConversationId] = useState<string | null>(null);

    const startInterview = useCallback(async () => {
        try {
            setStatus('connecting');
            // Request microphone permission first
            await navigator.mediaDevices.getUserMedia({ audio: true });

            const conv = await Conversation.startSession({
                agentId: 'agent_5201ke72y6r1fpx9nv541p6d6tah',
            } as any);

            setConversation(conv);
            const convId = (conv as any).sessionId || (conv as any).id; // Try both
            setConversationId(convId);
            setStatus('connected');

        } catch (error) {
            console.error('Failed to start conversation:', error);
            setStatus('idle');
            alert('Failed to connect to the AI agent. Please check your microphone and try again.');
        }
    }, []);

    const endInterview = useCallback(async () => {
        if (conversation) {
            await conversation.endSession();
            setStatus('finished');
            if (conversationId) {
                onComplete(conversationId);
            }
        }
    }, [conversation, conversationId, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-8 animate-in fade-in duration-500">
            <div className="w-full max-w-2xl text-center space-y-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Voice Interview
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    {status === 'idle' && "Click start to begin the interview."}
                    {status === 'connecting' && "Connecting to AI..."}
                    {status === 'connected' && "Listening... Click stop when you're done."}
                    {status === 'finished' && "Interview completed."}
                </p>
            </div>

            <div className="flex flex-col items-center gap-6">
                {/* Visualizer / Status Indicator */}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${status === 'connected'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-4 ring-indigo-500/20 scale-110 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                    {status === 'connecting' ? (
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    ) : (
                        <Mic className={`w-12 h-12 transition-colors ${status === 'connected' ? 'text-indigo-600' : 'text-slate-400'
                            }`} />
                    )}
                </div>

                {status === 'idle' && (
                    <button
                        onClick={startInterview}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <Mic className="w-5 h-5" />
                        Start Interview
                    </button>
                )}

                {status === 'connected' && (
                    <button
                        onClick={endInterview}
                        className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <Square className="w-5 h-5 fill-current" />
                        Finish Interview
                    </button>
                )}
            </div>
        </div>
    );
}
