import { openrouter, defaultModel } from '@/lib/ai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: openrouter(defaultModel),
        messages,
        system: `You are an expert website consultant conducting a discovery interview. 
    Your goal is to understand the client's business, their unique value proposition, their story, and their goals.
    Ask one question at a time. Be friendly, professional, and encouraging.
    Keep your responses concise (under 2 sentences) to keep the conversation flowing naturally.
    
    Key topics to cover:
    1. Business overview
    2. Unique selling points
    3. Founding story
    4. Future goals
    5. Website purpose
    
    Start by introducing yourself and asking about their business.`,
    });

    return result.toTextStreamResponse();
}
