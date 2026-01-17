import { openrouter, defaultModel } from '@/lib/ai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { transcript } = await req.json();

        if (!transcript || transcript.length < 10) {
            return Response.json({
                businessName: "My Business",
                industry: "General",
                description: "A professional business.",
                uniqueSellingPoints: ["Quality service", "Customer focus"],
                foundingStory: "Founded with a passion for excellence.",
                goals: ["Grow online presence"],
                targetAudience: "General public",
                tone: ["Professional"],
                emotions: ["Trust"]
            });
        }

        const result = await generateObject({
            model: openrouter(defaultModel),
            schema: z.object({
                businessName: z.string().default("My Business"),
                industry: z.string().default("General"),
                description: z.string().default("A professional business."),
                uniqueSellingPoints: z.array(z.string()).default(["Quality service"]),
                foundingStory: z.string().default("Founded with passion."),
                goals: z.array(z.string()).default(["Growth"]),
                targetAudience: z.string().default("General audience"),
                tone: z.array(z.string()).describe('Adjectives describing the brand voice').default(["Professional"]),
                emotions: z.array(z.string()).describe('Emotions the website should evoke').default(["Trust"]),
            }),
            prompt: `Analyze the following interview transcript and extract the client's business profile.
        If information is missing, infer reasonable defaults based on the context.
        
        Transcript:
        ${transcript}`,
        });

        return Response.json(result.object);
    } catch (error) {
        console.error("Analysis error:", error);
        // Return a fallback profile instead of crashing
        return Response.json({
            businessName: "New Project",
            industry: "Technology",
            description: "A new exciting project.",
            uniqueSellingPoints: ["Innovation", "Efficiency"],
            foundingStory: "Started to solve a problem.",
            goals: ["Launch successfully"],
            targetAudience: "Early adopters",
            tone: ["Modern", "Clean"],
            emotions: ["Excitement", "Confidence"]
        });
    }
}
