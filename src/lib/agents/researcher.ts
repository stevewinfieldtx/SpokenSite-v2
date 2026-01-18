import { generateObject } from 'ai';
import { openai, GPT4o, openrouter, defaultModel } from '@/lib/ai';
import { CompetitorAnalysis } from '@/types';
import { z } from 'zod';

// Define the schema for the competitor analysis
const CompetitorAnalysisSchema = z.object({
    competitors: z.array(z.object({
        name: z.string(),
        url: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        gaps: z.array(z.string()),
    })),
    marketGaps: z.array(z.string()),
    recommendedStrategy: z.string(),
});

export async function researchCompetitors(businessType: string): Promise<CompetitorAnalysis> {
    // 1. Search for competitors
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (!tavilyApiKey) {
        throw new Error('Missing TAVILY_API_KEY');
    }

    const query = `top competitors for ${businessType} business`;

    const searchResponse = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: tavilyApiKey,
            query,
            search_depth: 'advanced',
            include_answer: true,
            max_results: 5,
        }),
    });

    if (!searchResponse.ok) {
        throw new Error(`Tavily API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const context = JSON.stringify(searchData.results);

    // 2. Analyze results with AI
    const { object } = await generateObject({
        model: openrouter(defaultModel), // Use the default model (Claude 3.5 Sonnet) for better analysis
        schema: CompetitorAnalysisSchema,
        system: `You are an expert market researcher. Analyze the provided search results to identify key competitors, their strengths/weaknesses, and market gaps.`,
        prompt: `Analyze these search results for a "${businessType}" business:
    ${context}
    
    Provide a detailed competitor analysis.`,
    });

    return object;
}
