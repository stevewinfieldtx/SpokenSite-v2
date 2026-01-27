import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { conversation_id, surveyData } = await req.json();

        if (!conversation_id) {
            return NextResponse.json({ message: 'Missing conversation_id' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            // Fallback for dev/demo if key is missing? or error.
            console.warn("ELEVENLABS_API_KEY is missing");
            // Return a mock if no key, or error. 
            // Given the user wants a "Fix", I should try to make it work.
            // If they don't have a key, this will fail.
            // I'll error out.
            return NextResponse.json({ message: 'Server configuration error: Missing API Key' }, { status: 500 });
        }

        // Fetch transcript from ElevenLabs API
        const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversation_id}`, {
            headers: {
                'xi-api-key': apiKey,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API Error:', errorText);
            return NextResponse.json({ message: 'Failed to fetch transcript from ElevenLabs' }, { status: 502 });
        }

        const data = await response.json();
        const transcript = data.transcript.map((t: any) => `${t.role === 'agent' ? 'AI' : 'User'}: ${t.message}`).join('\n');

        // We can prepend the survey data to the transcript to ensure it's context for downstream tasks
        const enhancedTranscript = `
SURVEY DATA:
Business Name: ${surveyData?.businessName || 'N/A'}
Industry: ${surveyData?.industry || 'N/A'}
Existing URL: ${surveyData?.existingUrl || 'N/A'}

TRANSCRIPT:
${transcript}
        `.trim();

        return NextResponse.json({
            transcript: enhancedTranscript,
            raw_transcript: transcript,
            surveyData
        });

    } catch (error) {
        console.error('Process Interview Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
