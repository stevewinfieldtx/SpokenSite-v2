import { openrouter, defaultModel } from '@/lib/ai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { profile, analysis } = await req.json();

    const result = await generateObject({
        model: openrouter(defaultModel),
        schema: z.object({
            options: z.array(z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
                theme: z.string(),
                layout: z.string(),
                features: z.array(z.string()),
                colorPalette: z.array(z.string()),
            })).length(3),
        }),
        prompt: `Based on the client profile and competitor analysis, generate 3 distinct website design concepts.
    Each concept should have a unique angle (e.g., one focused on minimalism/trust, one on high-energy/growth, one on storytelling).
    
    Client Profile:
    ${JSON.stringify(profile)}
    
    Competitor Analysis:
    ${JSON.stringify(analysis)}
    `,
    });

    return Response.json(result.object);
}
