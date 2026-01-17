import { generateObject } from 'ai';
import { openai, GPT4o } from '@/lib/ai';
import { ClientProfile } from '@/types';

export async function analyzeInterview(transcript: string): Promise<ClientProfile> {
    // TODO: Implement logic to extract client profile from transcript
    throw new Error("Not implemented");
}
