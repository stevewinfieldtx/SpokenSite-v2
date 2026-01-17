import { openrouter, defaultModel } from '@/lib/ai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { profile } = await req.json();

    // 1. Search for competitors
    const query = `successful ${profile.industry} websites similar to ${profile.businessName} ${profile.description}`;

    let searchResults = [];
    try {
        const searchRes = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query,
                search_depth: "advanced",
                include_answer: true,
                max_results: 5
            })
        });
        const data = await searchRes.json();
        searchResults = data.results || [];
    } catch (error) {
        console.error("Search failed:", error);
        // Fallback or continue with empty results
    }

    // 2. Analyze competitors and generate strategy
    const result = await generateObject({
        model: openrouter(defaultModel),
        schema: z.object({
            competitors: z.array(z.object({
                name: z.string(),
                url: z.string(),
                strengths: z.array(z.string()),
                weaknesses: z.array(z.string()),
                gaps: z.array(z.string()),
            })),
            marketGaps: z.array(z.string()),
            recommendedStrategy: z.string(),
        }),
        prompt: `Based on the following client profile and search results for competitors, perform a deep dive analysis.
    Identify what successful competitors are doing right, where their weaknesses are, and find gaps that the client can fill.
    
    Client Profile:
    ${JSON.stringify(profile)}
    
    Competitor Search Results:
    ${JSON.stringify(searchResults)}
    `,
    });

    return Response.json(result.object);
}
