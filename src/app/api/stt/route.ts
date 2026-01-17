import { openai } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response('No file uploaded', { status: 400 });
        }

        // Convert File to ArrayBuffer for the SDK if needed, or pass directly if supported
        // The Vercel AI SDK doesn't have a direct "transcribe" helper yet that wraps this perfectly for all providers,
        // so we might use the raw OpenAI client or a fetch call if the SDK falls short.
        // However, let's try to use the raw fetch to OpenAI API for Whisper to be safe and simple,
        // or use the 'openai' instance if it exposes the audio endpoint.

        // Using direct fetch to OpenAI API for Whisper to avoid SDK complexity for this specific endpoint
        const openAiKey = process.env.OPENAI_API_KEY;
        if (!openAiKey) return new Response('Missing OpenAI Key', { status: 500 });

        const apiFormData = new FormData();
        apiFormData.append('file', file);
        apiFormData.append('model', 'whisper-1');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiKey}`,
            },
            body: apiFormData,
        });

        if (!response.ok) {
            const error = await response.text();
            return new Response(`OpenAI Error: ${error}`, { status: response.status });
        }

        const data = await response.json();
        return Response.json({ text: data.text });

    } catch (error) {
        console.error('STT Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
