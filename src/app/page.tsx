'use client';

import { useState } from 'react';
import Interview from '@/components/Interview';
import Analysis from '@/components/Analysis';
import Research from '@/components/Research';
import Generation from '@/components/Generation';
import Preview from '@/components/Preview';
import Survey, { SurveyData } from '@/components/Survey'; // Import Survey
import { ClientProfile, CompetitorAnalysis, SiteOption } from '@/types';
import { Loader2, Mic, X } from 'lucide-react';

type Step = 'survey' | 'interview' | 'analysis' | 'research' | 'generation' | 'selection' | 'refinement';

export default function Home() {
  const [step, setStep] = useState<Step>('survey'); // Start with survey
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null); // Survey state
  const [transcript, setTranscript] = useState<string>('');
  const [conversationId, setConversationId] = useState<string | null>(null); // Store conversation ID
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [selectedOption, setSelectedOption] = useState<SiteOption | null>(null);
  const [isRefining, setIsRefining] = useState(false);

  const handleRefinementComplete = async (convId: string) => {
    setIsRefining(false);
    // Call refine API
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: convId }),
      });
      if (!res.ok) throw new Error('Refinement failed');
      // For now, we'll just close the modal.
    } catch (error) {
      console.error(error);
    }
  };

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setStep('interview');
  };

  const handleInterviewComplete = async (convId: string) => {
    setConversationId(convId);
    // Now trigger the backend process to fetch transcript & analyze
    try {
      const res = await fetch('/api/process-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: convId, surveyData }),
      });

      if (!res.ok) throw new Error('Processing failed');

      const data = await res.json();
      // data should contain { transcript, analysis } ideally, or just transcript
      // For now, let's assume it returns the transcript and we proceed to analysis step
      // But the original code had 'Analysis' component doing the analysis. 
      // Let's stick to the flow: Interview -> Analysis (component) -> ...
      // So we pass the transcript to the next step.

      setTranscript(data.transcript);
      setStep('analysis');

    } catch (err) {
      console.error("Error processing interview:", err);
      alert("Failed to process interview. Check console.");
    }
  };

  const handleAnalysisComplete = (data: ClientProfile) => {
    setProfile(data);
    setStep('research');
  };

  const handleResearchComplete = (data: CompetitorAnalysis) => {
    setAnalysis(data);
    setStep('generation');
  };

  const handleSelection = (option: SiteOption) => {
    setSelectedOption(option);
    setStep('selection');
    buildSite(option);
  };

  const buildSite = async (option: SiteOption) => {
    try {
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option, profile, analysis }),
      });
      if (!res.ok) throw new Error('Build failed');
      setStep('refinement');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-50 dark:bg-slate-950">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          SpokenSite
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex gap-2">
            {['survey', 'interview', 'analysis', 'research', 'generation', 'selection', 'refinement'].map((s) => (
              <div
                key={s}
                className={`px-3 py-1 rounded-full text-xs capitalize ${step === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        {step === 'survey' && (
          <Survey onComplete={handleSurveyComplete} />
        )}

        {step === 'interview' && (
          <Interview onComplete={handleInterviewComplete} />
        )}

        {step === 'analysis' && (
          <Analysis transcript={transcript} onComplete={handleAnalysisComplete} />
        )}

        {step === 'research' && (
          <Research profile={profile!} onComplete={handleResearchComplete} />
        )}

        {step === 'generation' && (
          <Generation profile={profile!} analysis={analysis!} onSelect={handleSelection} />
        )}

        {(step === 'selection' || step === 'refinement') && (
          <div className="w-full">
            {step === 'selection' ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Building your website...</h2>
                <p className="text-slate-500">Writing code, optimizing images, and deploying preview.</p>
              </div>
            ) : (
              <div className="relative w-full">
                <div className="sticky top-0 z-50 bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
                  <h2 className="font-bold">Site Preview</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsRefining(true)}
                      className="px-4 py-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" /> Request Changes
                    </button>
                    <button className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors">
                      Deploy Live
                    </button>
                  </div>
                </div>
                <div className="border-4 border-slate-900 rounded-b-xl overflow-hidden min-h-screen">
                  <Preview />
                </div>

                {/* Refinement Overlay */}
                {isRefining && (
                  <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-2xl relative shadow-2xl">
                      <button
                        onClick={() => setIsRefining(false)}
                        className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <h3 className="text-xl font-bold mb-4 text-center">What would you like to change?</h3>
                      <Interview onComplete={handleRefinementComplete} /> {/* Reuse Interview ? Wait, Interview expects onComplete(string) logic was changed... need to check this */}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
