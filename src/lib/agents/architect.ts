import { generateObject } from 'ai';
import { openai, GPT4o } from '@/lib/ai';
import { SiteOption, ClientProfile, CompetitorAnalysis } from '@/types';

export async function generateSiteOptions(
    profile: ClientProfile,
    analysis: CompetitorAnalysis
): Promise<SiteOption[]> {
    // TODO: Implement logic to generate 3 site options
    throw new Error("Not implemented");
}
