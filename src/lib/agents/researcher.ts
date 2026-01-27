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
    // 1. Search for competitors (try Tavily, fallback to LLM knowledge)
    let context = "";

    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (tavilyApiKey) {
        try {
            const query = `top competitors for ${businessType} business`;
            const searchResponse = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
                    query,
                    search_depth: 'advanced',
                    include_answer: true,
                    max_results: 5,
                }),
            });

            if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                context = JSON.stringify(searchData.results);
            } else {
                console.warn("Tavily API returned error", searchResponse.statusText);
            }
        } catch (err) {
            console.warn("Tavily search failed, falling back to LLM knowledge", err);
        }
    } else {
        console.log("No TAVILY_API_KEY found, using LLM knowledge base.");
    }

    // 2. Analyze results or generate based on knowledge
    const systemPrompt = context
        ? `You are an expert market researcher. Analyze the provided search results to identify key competitors, their strengths/weaknesses, and market gaps.`
        : `You are an expert market researcher. You do not have access to live search results right now, so you must use your broad knowledge base to identify likely STANDARD competitors and market norms for this industry. Generate a realistic 'Market Positioning Analysis' based on typical industry patterns.`;

    const userPrompt = context
        ? `Analyze these search results for a "${businessType}" business:\n${context}\n\nProvide a detailed competitor analysis.`
        : `Perform a Market Positioning Analysis for a "${businessType}" business based on your knowledge of the industry. Identify typical competitors (real or representative types), strengths, weaknesses, and market gaps.`;

    const { object } = await generateObject({
        model: openrouter(defaultModel),
        schema: CompetitorAnalysisSchema,
        system: systemPrompt,
        prompt: userPrompt,
    });

    return object;
}
