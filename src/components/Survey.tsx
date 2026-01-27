'use client';

import { useState } from 'react';
import { ArrowRight, Globe, Building2, Link as LinkIcon } from 'lucide-react';

interface SurveyProps {
  onComplete: (data: SurveyData) => void;
}

export interface SurveyData {
  businessName: string;
  industry: string;
  existingUrl: string;
}

export default function Survey({ onComplete }: SurveyProps) {
  const [formData, setFormData] = useState<SurveyData>({
    businessName: '',
    industry: '',
    existingUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-8 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Tell us about your business
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We'll use this to guide the AI interview.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Business Name
          </label>
          <input
            type="text"
            required
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Acme Corp"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Industry
          </label>
          <input
            type="text"
            required
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Plumbing, Law, SaaS..."
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Existing Website (Optional)
          </label>
          <input
            type="url"
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="https://..."
            value={formData.existingUrl}
            onChange={(e) => setFormData({ ...formData, existingUrl: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] mt-4"
        >
          Start Interview
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
