import { researchCompetitors } from '@/lib/agents/researcher';

// Remove edge runtime to ensure broad compatibility
// export const runtime = 'edge';

export async function POST(req: Request) {
    const { profile } = await req.json();

    // Construct a context string for the researcher
    // We want to find competitors for this specific business context
    const context = `${profile.industry} ${profile.description}`;

    try {
        const analysis = await researchCompetitors(context);
        return Response.json(analysis);
    } catch (error: any) {
        console.error("Research failed:", error);
        return new Response(JSON.stringify({ error: error.message || 'Research failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
